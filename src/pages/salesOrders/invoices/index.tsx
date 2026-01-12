
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";


import { useGetSalesInvoicesQuery } from "@/store/features/salesOrder/salesOrder";
import type { SalesInvoice } from "@/types/salesInvoice.types";
import { useAppSelector } from "@/store/store";

export default function Invoices() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const limit = 10;

  // Fetch invoices with pagination & search
  const { data: fetchedInvoices, isFetching } = useGetSalesInvoicesQuery({
    page,
    limit,
    search,
  });

  const invoices: SalesInvoice[] = fetchedInvoices?.data || [];
  const pagination = fetchedInvoices?.pagination ?? {
    total: 0,
    page: 1,
    limit,
    totalPage: 1,
  };

  const currency = useAppSelector((state) => state.currency.value);

  const invoiceColumns: ColumnDef<SalesInvoice>[] = [
    {
      accessorKey: "invoice_number",
      header: "Invoice #",
      meta: { className: "md:sticky md:left-0 z-20 bg-background min-w-[120px]" } as any,
      cell: ({ row }) => <span className="font-medium">{row.getValue("invoice_number")}</span>,
    },
    {
      accessorKey: "order.customer.name",
      header: "Customer",
      meta: { className: "md:sticky md:left-[120px] z-20 bg-background md:shadow-[4px_0px_5px_-2px_rgba(0,0,0,0.1)]" } as any,
      cell: ({ row }) => row.original?.order?.customer.name,
    },
    {
      accessorKey: "order.order_number",
      header: "Order #",
      cell: ({ row }) => row.original?.order?.order_number,
    },
    {
      accessorKey: "invoice_date",
      header: "Invoice Date",
      cell: ({ row }) => new Date(row.getValue("invoice_date")).toLocaleDateString(),
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }) => new Date(row.getValue("due_date")).toLocaleDateString(),
    },
    {
      accessorKey: "total_amount",
      header: `Total Amount (${currency})`,
      cell: ({ row }) => <span>{currency} {parseFloat(row.getValue("total_amount")).toFixed(2)}</span>,
    },
    {
      accessorKey: "total_payable",
      header: `Total Payable (${currency})`,
      cell: ({ row }) => <span>{currency} {parseFloat(row.getValue("total_payable")).toFixed(2)}</span>,
    },
    {
      accessorKey: "paid_amount",
      header: `Paid Amount (${currency})`,
      cell: ({ row }) => <span>{currency} {parseFloat(row.getValue("paid_amount")).toFixed(2)}</span>,
    },
    {
      accessorKey: "remaining_balance",
      header: `Due Amount (${currency})`,
      cell: ({ row }) => <span>{currency} {parseFloat(row.getValue("remaining_balance")).toFixed(2)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const color =
          status === "paid"
            ? "bg-green-500"
            : status === "draft"
              ? "bg-yellow-500"
              : "bg-gray-500";
        return <Badge className={color}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div className="flex items-center gap-2">
            <Link to={`/dashboard/sales/invoices/${invoice.id}`}>
              <Button size="sm" variant="outline-info">View</Button>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales Invoices</h1>
        <Link to="/dashboard/sales/orders/create">
          <Button variant="info">
            <PlusCircle className="h-4 w-4" /> Create Order
          </Button>
        </Link>
      </div>

      {/* DataTable */}
      <DataTable
        columns={invoiceColumns}
        data={invoices}
        pageIndex={page - 1}
        pageSize={limit}
        totalCount={pagination.total}
        onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        isFetching={isFetching}
      />
    </div>
  );
}
