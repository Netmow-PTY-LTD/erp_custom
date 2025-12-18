



import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetSalesPaymentQuery } from "@/store/features/salesOrder/salesOrder";
import { useAppSelector } from "@/store/store";
import type { SalesPayment } from "@/types/salesPayment.types";
import type { ColumnDef } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function Payments() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit] = useState(10);

  const { data: salesPayment, isFetching } = useGetSalesPaymentQuery({
    page,
    limit,
    search,
  });

  const currency = useAppSelector((state) => state.currency.value);

  const paymentColumns: ColumnDef<SalesPayment>[] = [
    {
      accessorKey: "id",
      header: "Payment #",
      cell: ({ row }) => <span className="font-medium">PAY-{row.original.id}</span>,
    },
    {
      accessorKey: "order.order_number",
      header: "Order #",
      cell: ({ row }) => row.original.order?.order_number ?? "-",
    },
    {
      accessorKey: "order.customer_id",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold">{row.original.order?.customer.name}</div>
          <div className="text-xs text-muted-foreground">
            ID: {row.original.order?.customer_id}
          </div>
        </div>
      ),
    },
    // {
    //   accessorKey: "invoice_id",
    //   header: "Invoice #",
    //   cell: ({ row }) => row.original.invoice_id ?? "-",
    // },
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
            : "bg-purple-500";

        return <Badge className={color}>{method}</Badge>;
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const value = parseFloat(row.original.amount);
        return <span>{currency} {value.toFixed(2)}</span>;
      },
    },
    {
      accessorKey: "reference_number",
      header: "Reference",
      cell: ({ row }) => row.original.reference_number ?? "-",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <div className="flex items-center gap-2">
            <Link to={`/dashboard/sales/payments/${payment.id}`}>
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
        <h1 className="text-2xl font-bold tracking-tight">Sales Payments</h1>

        <Link to="/dashboard/sales/payments/create">
          <Button variant="info">
            <PlusCircle className="h-4 w-4" />
            Record Payment
          </Button>
        </Link>
      </div>

      <DataTable
        columns={paymentColumns}
        data={salesPayment?.data ?? []}
        pageIndex={page - 1}
        pageSize={limit}
        totalCount={salesPayment?.pagination?.total ?? 0}
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
