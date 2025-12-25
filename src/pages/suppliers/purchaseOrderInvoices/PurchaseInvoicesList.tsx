"use client";

import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useGetAllPurchaseInvoicesQuery } from "@/store/features/purchaseOrder/purchaseOrderApiService";
import { useAppSelector } from "@/store/store";
import type { PurchaseInvoice } from "@/types/PurchaseInvoice.types";

import type { ColumnDef } from "@tanstack/react-table";
import { CreditCard, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function PurchaseInvoicesList() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const limit = 10;

  const { data, isFetching } = useGetAllPurchaseInvoicesQuery({
    page,
    limit,
    search,
  });

  const invoicesData: PurchaseInvoice[] = Array.isArray(data?.data)
    ? data.data
    : [];
  const pagination = data?.pagination ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPage: 1,
  };

  const currency = useAppSelector((state) => state.currency.value);

  // Table Columns
  const invoiceColumns: ColumnDef<PurchaseInvoice>[] = [
    {
      accessorKey: "invoice_number",
      header: "Invoice #",
    },
    {
      accessorKey: "purchase_order",
      header: "PO Number",
      cell: ({ row }) => `PO #${row.original.purchase_order.po_number}`,
    },
    // Only include supplier if you have supplier_id in the invoice or via PO relation
    // {
    //   accessorKey: "supplier_id",
    //   header: "Supplier",
    //   cell: ({ row }) => `Supplier #${row.original.supplier_id}`,
    // },
     {
      accessorKey: "purchase_order",
      header: "Supplier",
      cell: ({ row }) => `${row.original.purchase_order.supplier?.name}`,
    },
    {
      accessorKey: "total_payable_amount",
      header: `Total Payable Amount (${currency})`,
      cell: ({ row }) => `${row.original.total_payable_amount.toFixed(2)}`,
    },
    {
      accessorKey: "paid_amount",
      header: `Paid Amount (${currency})`,
      cell: ({ row }) => `${row.original.paid_amount.toFixed(2)}`,
    },
    {
      accessorKey: "due_amount",
      header: `Due Amount (${currency})`,
      cell: ({ row }) => ` ${row.original.due_amount.toFixed(2)}`,
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const color =
          status === "draft"
            ? "bg-yellow-500"
            : status === "paid"
            ? "bg-green-600"
            : status === "overdue"
            ? "bg-red-600"
            : "bg-gray-400";

        return (
          <Badge className={`${color} text-white capitalize`}>{status}</Badge>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const invoice = row.original;

        return (
          <div className="flex gap-2">
            <Link to={`/dashboard/purchase-invoices/${invoice.id}`}>
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-1" /> View
              </Button>
            </Link>
            <Link
              to={`/dashboard/purchase-payments/create?pon=${invoice.purchase_order.po_number}`}
            >
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1.5 px-3"
              >
                <CreditCard className="w-4 h-4" /> Pay
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Purchase Invoices</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Purchase Invoices</CardTitle>
          <CardDescription>Manage all your purchase invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={invoiceColumns}
            data={invoicesData}
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
        </CardContent>
      </Card>
    </div>
  );
}
