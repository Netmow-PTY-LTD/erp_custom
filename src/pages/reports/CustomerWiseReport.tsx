"use client";

import { useState } from "react";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DollarSign, Calendar, User, Printer, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useGetCustomersQuery } from "@/store/features/customers/customersApiService";
import { useGetCustomerWiseInvoicesQuery } from "@/store/features/reports/reportApiService";
import { useAppSelector } from "@/store/store";
import { format } from "date-fns";
import { skipToken } from "@reduxjs/toolkit/query";
import { type Customer } from "@/store/features/customers/customersApiService";

interface InvoiceData {
  id: number;
  invoice_number: string;
  order_id?: number;
  total_amount: number;
  paid_amount: number;
  status: string;
  created_at: string;
  due_date?: string;
}

function getStartOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
}

function getEndOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);
}

export default function CustomerWiseReport() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [startDate, setStartDate] = useState(getStartOfCurrentMonth());
  const [endDate, setEndDate] = useState(getEndOfCurrentMonth());
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerPopoverOpen, setCustomerPopoverOpen] = useState(false);
  const limit = 10;

  const currency = useAppSelector((state) => state.currency.value);

  // Fetch customers for dropdown
  const { data: customersResponse } = useGetCustomersQuery({
    limit: 100,
    status: "active",
    search: customerSearch,
  });
  const customers = (customersResponse?.data as Customer[]) || [];

  // Fetch invoices for selected customer
  const queryParams = selectedCustomerId ? {
    customer_id: selectedCustomerId,
    start_date: startDate,
    end_date: endDate,
    page,
    limit,
    search,
    ...(statusFilter !== 'all' && { status: statusFilter }),
  } : undefined;

  const { data: invoicesData, isFetching } = useGetCustomerWiseInvoicesQuery(
    queryParams || skipToken
  );

  const columns: ColumnDef<InvoiceData>[] = [
    {
      accessorKey: "invoice_number",
      header: "Invoice #",
      cell: (info) => info.getValue() as string,
    },
    {
      accessorKey: "created_at",
      header: "Invoice Date",
      cell: (info) => {
        const date = new Date(info.getValue() as string);
        return format(date, "yyyy-MM-dd");
      },
    },
    {
      accessorKey: "total_amount",
      header: "Total Amount",
      cell: (info) => {
        const value = info.getValue() as number;
        return `${currency} ${value.toFixed(2)}`;
      }
    },
    {
      accessorKey: "paid_amount",
      header: "Paid Amount",
      cell: (info) => {
        const value = info.getValue() as number;
        return `${currency} ${value.toFixed(2)}`;
      }
    },
    {
      accessorKey: "due_amount",
      header: "Due Amount",
      cell: (info) => {
        const row = info.row.original as InvoiceData;
        const dueAmount = row.total_amount - row.paid_amount;
        return `${currency} ${dueAmount.toFixed(2)}`;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as string;
        const statusColors: Record<string, string> = {
          paid: "text-green-600 bg-green-50",
          partially_paid: "text-yellow-600 bg-yellow-50",
          unpaid: "text-red-600 bg-red-50",
          refunded: "text-gray-600 bg-gray-50",
        };
        const colorClass = statusColors[status] || "text-gray-600 bg-gray-50";
        // Format status for display
        const displayStatus = status === 'partially_paid' ? 'Partial' :
          status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {displayStatus}
          </span>
        );
      },
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: (info) => {
        const date = info.getValue() as string;
        return date ? format(new Date(date), "yyyy-MM-dd") : "—";
      },
    },
  ];

  const totalInvoices = invoicesData?.pagination?.total || 0;

  // Calculate summary stats from current visible data
  const invoiceList = invoicesData?.data || [];
  const totalAmount = invoiceList.reduce(
    (sum: number, item: InvoiceData) => sum + (item.total_amount || 0),
    0
  );
  const totalPaid = invoiceList.reduce(
    (sum: number, item: InvoiceData) => sum + (item.paid_amount || 0),
    0
  );
  const totalDue = totalAmount - totalPaid;

  const selectedCustomer = customers.find((c) => c.id === Number(selectedCustomerId));

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @media print {
          /* Don't hide body children by default */
          body {
            background: white !important;
          }

          /* Hide elements marked as no-print */
          .no-print {
            display: none !important;
          }

          /* Show print-only elements */
          .print-only.hidden {
            display: block !important;
          }

          /* Hide DataTable pagination controls */
          [class*="pagination"],
          [role="navigation"],
          .table-footer {
            display: none !important;
          }

          /* Ensure the report container is visible */
          [data-print-container] {
            display: block !important;
          }

          /* Make cards print-friendly */
          .Card, .card {
            break-inside: avoid;
            box-shadow: none !important;
            border: none !important;
            margin-bottom: 1rem !important;
          }

          /* Make summary stats inline in a single row for print */
          .summary-stats-grid {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 0.75rem !important;
          }

          .summary-stats-grid > * {
            flex: 1 !important;
            min-width: 140px !important;
            max-width: 200px !important;
          }

          /* Adjust card content for print */
          .summary-stats-grid .CardContent {
            padding: 0.75rem !important;
          }

          .summary-stats-grid p {
            font-size: 0.75rem !important;
          }

          .summary-stats-grid .text-2xl {
            font-size: 1.25rem !important;
          }

          .summary-stats-grid .w-10 {
            width: 1.5rem !important;
            height: 1.5rem !important;
          }

          /* Preserve background colors */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Page settings */
          @page {
            size: landscape;
            margin: 0.5cm;
          }
        }

        /* Base styles for print-only */
        .print-only.hidden {
          display: none;
        }
      `}</style>
      <div className="space-y-6" data-print-container id="customer-wise-report">
        {/* Print-only header */}
        <div className="print-only hidden mb-6 p-4">
          <h1 className="text-2xl font-bold text-center">Customer Wise Invoice Report</h1>
          {selectedCustomer && (
            <div className="text-center mt-2">
              <p className="text-lg font-semibold">{selectedCustomer.company} ({selectedCustomer.name})</p>
              <p className="text-sm text-gray-600">Period: {startDate} to {endDate}</p>
              <p className="text-xs text-gray-500 mt-1">Printed on: {new Date().toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Header Card */}
        <Card className="py-6 print:hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Customer Wise Invoice Report
              </CardTitle>
              {invoiceList.length > 0 && (
                <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2 no-print">
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="no-print">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Customer Selection */}
              <div className="space-y-2">
                <Label>Select Customer</Label>
                <Popover open={customerPopoverOpen} onOpenChange={setCustomerPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between font-normal">
                      <span className="truncate">
                        {selectedCustomerId
                          ? `${selectedCustomer?.company || selectedCustomer?.name}${selectedCustomer?.company && selectedCustomer?.name ? ` (${selectedCustomer.name})` : ''}`
                          : "Select a customer"}
                      </span>
                      {selectedCustomerId ? (
                        <X className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50 hover:opacity-100" onClick={(e) => { e.stopPropagation(); setSelectedCustomerId(""); setPage(1); }} />
                      ) : (
                        <ChevronDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput placeholder="Search by name or company..." onValueChange={setCustomerSearch} />
                      <CommandList>
                        <CommandEmpty>No customer found.</CommandEmpty>
                        <CommandGroup>
                          {customers.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              onSelect={() => { setSelectedCustomerId(customer.id.toString()); setCustomerPopoverOpen(false); setPage(1); }}
                              className={selectedCustomerId === customer.id.toString() ? "bg-accent" : ""}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{customer.company || customer.name}</span>
                                {customer.company && customer.name && (
                                  <span className="text-xs text-muted-foreground">{customer.name}</span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  max={endDate}
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  min={startDate}
                />
              </div>

              {/* Payment Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status">Payment Status</Label>
                <Select value={statusFilter} onValueChange={(value) => {
                  console.log('Status filter changed:', value);
                  setStatusFilter(value);
                  setPage(1);
                }}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="partially_paid">Partial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        {invoiceList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 summary-stats-grid">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Invoices (All)</p>
                    <p className="text-2xl font-bold text-blue-700">{totalInvoices}</p>
                  </div>
                  <FileText className="w-10 h-10 text-blue-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-green-600 font-medium">Total Amount</p>
                      <span className="text-[10px] text-green-500">(Page)</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      {currency} {totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="w-10 h-10 text-green-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-emerald-600 font-medium">Paid Amount</p>
                      <span className="text-[10px] text-emerald-500">(Page)</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-700">
                      {currency} {totalPaid.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="w-10 h-10 text-emerald-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-orange-600 font-medium">Due Amount</p>
                      <span className="text-[10px] text-orange-500">(Page)</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-700">
                      {currency} {totalDue.toFixed(2)}
                    </p>
                  </div>
                  <Calendar className="w-10 h-10 text-orange-300" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Invoices Table */}
        {invoiceList.length > 0 && (
          <Card className="py-6">
            <CardHeader className="no-print">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Invoices for {selectedCustomer?.company} ({selectedCustomer?.name})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={invoiceList}
                pageIndex={page - 1}
                pageSize={limit}
                totalCount={totalInvoices}
                onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
                onSearch={setSearch}
                isFetching={isFetching}
              />
            </CardContent>
          </Card>
        )}

        {/* No Data Message */}
        {!invoiceList.length && selectedCustomerId && !isFetching && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No invoices found</p>
                <p className="text-sm">
                  Try adjusting the date range or select a different customer
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Initial State */}
        {!selectedCustomerId && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a Customer</p>
                <p className="text-sm">
                  Choose a customer from the dropdown above to view their invoices
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
