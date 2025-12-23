import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetAllPurchasePaymentsQuery } from "@/store/features/purchaseOrder/purchaseOrderApiService";

import type { PurchasePayment } from "@/types/purchasePayment.types";
import type { ColumnDef } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function PurchasePayments() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit] = useState(10);

  const { data: paymentData, isFetching } = useGetAllPurchasePaymentsQuery({
    page,
    limit,
    search,
  });

  const payments = paymentData?.data;

  const columns: ColumnDef<PurchasePayment>[] = [
    {
      accessorKey: "id",
      header: "Payment #",
      cell: ({ row }) => <span className="font-medium">PPAY-{row.original.id}</span>,
    },
    {
      accessorKey: "purchase_order.po_number",
      header: "PO Number",
      cell: ({ row }) => row.original.purchase_order.po_number ?? "-",
    },
    {
      accessorKey: "supplier",
      header: "Supplier",
      cell: ({ row }) => {
        const supplier = row.original.purchase_order?.supplier;
        if (!supplier) return "-";

        return (
          <div>
            <div className="font-semibold">{supplier.name}</div>
            <div className="text-xs text-muted-foreground">
              ID: {supplier.id}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "invoice.invoice_number",
      header: "Invoice #",
      cell: ({ row }) => row.original.invoice?.invoice_number ?? "-",
    },
    {
      accessorKey: "payment_date",
      header: "Payment Date",
      cell: ({ row }) => new Date(row.original.payment_date).toLocaleString(),
    },
    {
      accessorKey: "payment_method",
      header: "Method",
      cell: ({ row }) => {
        const method = row.original.payment_method;

        const color =
          method === "cash"
            ? "bg-yellow-500"
            : method === "bank_transfer"
            ? "bg-blue-500"
            : method === "card"
            ? "bg-purple-500"
            : "bg-gray-600";

        return <Badge className={color}>{method}</Badge>;
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span>RM {Number(row.original.amount).toFixed(2)}</span>
      ),
    },
    {
      accessorKey: "reference_number",
      header: "Reference",
      cell: ({ row }) => row.original.reference_number ?? "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const color =
          status === "completed"
            ? "bg-green-600"
            : status === "pending"
            ? "bg-yellow-500"
            : "bg-red-600";

        return <Badge className={color}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <div className="flex items-center gap-2">
            <Link to={`/dashboard/purchase-payments/${payment.id}`}>
              <Button size="sm" variant="outline">View</Button>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Purchase Payments</h1>

        <Link to="/dashboard/purchase-payments/create">
          <Button variant="info">
            <PlusCircle className="h-4 w-4" />
            Record Payment
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={payments ?? []}
        pageIndex={page - 1}
        pageSize={limit}
        totalCount={paymentData?.pagination?.total ?? 0}
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
