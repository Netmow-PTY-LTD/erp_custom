"use client";

import { useState } from "react";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMyInvoicesQuery } from "@/store/features/reports/reportApiService";
import { useGetCustomersQuery } from "@/store/features/customers/customersApiService";
import { useGetSettingsInfoQuery } from "@/store/features/admin/settingsApiService";
import { useAppSelector } from "@/store/store";
import { FileText, DollarSign, AlertCircle, CheckCircle, Filter, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MyInvoicesData {
    id: number;
    invoice_number: string;
    customer_name: string;
    invoice_date: string;
    due_date: string;
    total_amount: number;
    paid_amount: number;
    payment_status: string;
    balance_due: number;
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

export default function MyInvoices() {
    const [startDate, setStartDate] = useState(getStartOfCurrentMonth());
    const [endDate, setEndDate] = useState(getEndOfCurrentMonth());
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<string>("all");
    const limit = 10;

    const currency = useAppSelector((state) => state.currency.value);
    const { data: settingsData } = useGetSettingsInfoQuery();
    const from = settingsData?.data;

    // Fetch customers for the filter dropdown
    const { data: customersData } = useGetCustomersQuery({ page: 1, limit: 100 });

    const { data, isFetching } = useGetMyInvoicesQuery({
        startDate,
        endDate,
        page,
        limit,
        search,
        customerId: selectedCustomer,
    });

    const columns: ColumnDef<MyInvoicesData>[] = [
        {
            accessorKey: "invoice_number",
            header: "Invoice #",
            cell: (info) => info.getValue() as string,
        },
        {
            accessorKey: "customer_name",
            header: "Customer",
            cell: (info) => info.getValue() as string,
        },
        {
            accessorKey: "invoice_date",
            header: "Invoice Date",
            cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
        },
        {
            accessorKey: "due_date",
            header: "Due Date",
            cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
        },
        {
            accessorKey: "total_amount",
            header: "Total",
            cell: (info) => `${currency} ${(info.getValue() as number).toFixed(2)}`,
        },
        {
            accessorKey: "paid_amount",
            header: "Paid",
            cell: (info) => `${currency} ${(info.getValue() as number).toFixed(2)}`,
        },
        {
            accessorKey: "balance_due",
            header: "Balance",
            cell: (info) => `${currency} ${(info.getValue() as number).toFixed(2)}`,
        },
        {
            accessorKey: "payment_status",
            header: "Status",
            cell: (info) => {
                const status = info.getValue() as string;
                return (
                    <Badge variant={status === "paid" ? "default" : "destructive"}>
                        {status === "paid" ? "Paid" : "Unpaid"}
                    </Badge>
                );
            },
        },
    ];

    // Calculate summary stats from data
    const totalInvoices = data?.pagination?.total || 0;
    const totalAmount = data?.data?.reduce((sum: number, item: any) => sum + (item.total_amount || 0), 0) || 0;
    const totalPaid = data?.data?.reduce((sum: number, item: any) => sum + (item.paid_amount || 0), 0) || 0;
    const totalUnpaid = data?.data?.reduce((sum: number, item: any) => sum + (item.balance_due || 0), 0) || 0;

    const stats = [
        {
            label: "Total Invoices",
            value: totalInvoices,
            gradient: "from-blue-600 to-blue-400",
            shadow: "shadow-blue-500/30",
            icon: <FileText className="w-6 h-6 text-white" />,
        },
        {
            label: "Total Amount",
            value: `${currency} ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            gradient: "from-purple-600 to-purple-400",
            shadow: "shadow-purple-500/30",
            icon: <DollarSign className="w-6 h-6 text-white" />,
        },
        {
            label: "Outstanding",
            value: `${currency} ${totalUnpaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            gradient: "from-rose-600 to-rose-400",
            shadow: "shadow-rose-500/30",
            icon: <AlertCircle className="w-6 h-6 text-white" />,
        },
    ];

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between print:hidden">
                <h1 className="text-3xl font-bold">My Invoices</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint} className="gap-2">
                        <Printer className="w-4 h-4" />
                        Print
                    </Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(new Date(startDate), "PPP") : "Pick start date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={new Date(startDate)} onSelect={(date) => date && setStartDate(date.toISOString().slice(0, 10))} initialFocus />
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? format(new Date(endDate), "PPP") : "Pick end date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={new Date(endDate)} onSelect={(date) => date && setEndDate(date.toISOString().slice(0, 10))} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
                {stats.map((stat) => (
                    <Card key={stat.label} className={`bg-gradient-to-br ${stat.gradient} ${stat.shadow}`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-white">{stat.label}</CardTitle>
                            {stat.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="print:w-full print:m-0 print:p-0">
                {/* Print Only Header */}
                <div id="invoice" className="hidden print:block mb-4">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col gap-2 mt-2 details-text text-left">
                            <h1 className="font-bold uppercase company-name">{from?.company_name || "Company"}</h1>
                            <p className="leading-tight max-w-[400px]">
                                {from?.address || "Company Address"}
                            </p>
                            <p>T: {from?.phone || "-"}{from?.email && `, E: ${from.email}`}</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <div className="mb-1">
                                {from?.logo_url ? (
                                    <img src={from.logo_url} alt="Logo" className="h-14 object-contain" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full border-2 border-[#4CAF50] flex items-center justify-center text-[#4CAF50] font-bold text-lg overflow-hidden">
                                        LOGO
                                    </div>
                                )}
                            </div>
                            <h2 className="font-bold text-gray-800 mb-1 uppercase details-text">My Invoices</h2>
                            <div className="details-text space-y-1">
                                <p><strong>Date:</strong> {format(new Date(), "dd/MM/yyyy")}</p>
                                <p><strong>Period:</strong> {format(new Date(startDate), "dd/MM/yyyy")} - {format(new Date(endDate), "dd/MM/yyyy")}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Card className="pt-6 pb-2 border-none shadow-none print:pt-0">
                    <CardHeader className="print:hidden">
                        <div className="flex items-center justify-between gap-4">
                            <CardTitle>Invoice List</CardTitle>
                            <div className="flex gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-[200px] justify-start">
                                            <Filter className="w-4 h-4 mr-2" />
                                            {selectedCustomer === "all"
                                                ? "Filter by Customer"
                                                : customersData?.data?.find((c: any) => c.id.toString() === selectedCustomer)?.company +
                                                  " - " +
                                                  customersData?.data?.find((c: any) => c.id.toString() === selectedCustomer)?.name || "Filter by Customer"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0">
                                        <div className="p-2">
                                            <Input
                                                placeholder="Search customers..."
                                                value={search}
                                                onChange={(e) => {
                                                    setSearch(e.target.value);
                                                }}
                                                className="mb-2"
                                            />
                                            <div className="max-h-[300px] overflow-y-auto">
                                                <div
                                                    className="flex items-center gap-2 px-2 py-2 hover:bg-accent rounded-md cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedCustomer("all");
                                                        setPage(1);
                                                    }}
                                                >
                                                    All Customers
                                                </div>
                                                {customersData?.data
                                                    ?.filter((customer: any) =>
                                                        customer.company.toLowerCase().includes(search.toLowerCase()) ||
                                                        customer.name.toLowerCase().includes(search.toLowerCase())
                                                    )
                                                    .map((customer: any) => (
                                                        <div
                                                            key={customer.id}
                                                            className="flex items-center gap-2 px-2 py-2 hover:bg-accent rounded-md cursor-pointer"
                                                            onClick={() => {
                                                                setSelectedCustomer(customer.id.toString());
                                                                setPage(1);
                                                            }}
                                                        >
                                                            {customer.company} - {customer.name}
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-auto w-full print:p-0 px-0">
                        {/* Print Title */}
                        <div className="hidden print:block text-center mb-4">
                            <h3 className="text-xl font-bold uppercase details-text">
                                {selectedCustomer === "all"
                                    ? "Customer Wise Invoices"
                                    : `${customersData?.data?.find((c: any) => c.id.toString() === selectedCustomer)?.company || ""} Invoices`
                                }
                            </h3>
                        </div>
                        <DataTable
                            columns={columns}
                            data={data?.data || []}
                            pageIndex={page - 1}
                            pageSize={limit}
                            totalCount={data?.pagination?.total || 0}
                            onPageChange={(newPage) => setPage(newPage + 1)}
                            onSearch={(value) => {
                                setSearch(value);
                                setPage(1);
                            }}
                            isFetching={isFetching}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Print Styles */}
            <style>{`
        @media print {
          @page {
            margin: 5mm;
            size: A4 landscape;
          }
          body {
            -webkit-print-color-adjust: exact;
            font-size: 11px !important;
            background: white !important;
            color: black !important;
          }
          .no-print,
          header,
          nav,
          aside,
          button,
          input,
          .max-w-sm,
          .print\\:hidden,
          .grid.grid-cols-1,
          .flex.flex-wrap.items-center.justify-between.py-4.gap-4 {
            display: none !important;
          }
          #invoice {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          h1 { font-size: 11px !important; }
          h2 { font-size: 11px !important; }
          table {
            font-size: 11px !important;
            width: 100% !important;
            border-collapse: collapse !important;
            table-layout: auto !important;
          }
          th, td {
            border: 1px solid #ddd !important;
            padding: 4px !important;
            font-size: 11px !important;
          }
          .details-text, .table-text {
            font-size: 11px !important;
            line-height: 1.2 !important;
          }
          .company-name {
            font-size: 18px !important;
            line-height: 1.2 !important;
          }
          .text-sm, .text-xs, .text-base, .text-lg, .text-xl, .font-bold, .font-semibold, span, p, div {
            font-size: 11px !important;
          }
          .mb-6 { margin-bottom: 8px !important; }
          .mb-4 { margin-bottom: 4px !important; }

          /* Ensure table container matches header width */
          .Card, .CardContent, .rounded-xl, .border {
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
        /* Standardizing screen sizes */
        .company-name { font-size: 18px !important; line-height: 1.2; }
        .details-text { font-size: 12px !important; line-height: 1.4; }
        .table-text { font-size: 12px !important; }
      `}</style>
        </div>
    );
}
