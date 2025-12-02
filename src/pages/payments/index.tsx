import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { payments } from "@/data/data";
import type { Payment } from "@/types/types";
import type { ColumnDef } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router";


export default function Payments() {
  const paymentColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "paymentNumber",
    header: "Payment #",
    cell: ({ row }) => <span className="font-medium">{row.getValue("paymentNumber")}</span>,
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <div className="font-semibold">{row.getValue("customer")}</div>
        <div className="text-xs text-muted-foreground">{row.original.customerId}</div>
      </div>
    ),
  },
  {
    accessorKey: "invoiceNumber",
    header: "Invoice #",
    cell: ({ row }) => row.getValue("invoiceNumber"),
  },
  {
    accessorKey: "paymentDate",
    header: "Payment Date",
    cell: ({ row }) => row.getValue("paymentDate"),
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => {
      const method = row.getValue("method") as Payment["method"];
      const color =
        method === "Cash"
          ? "bg-yellow-500"
          : method === "Bank Transfer"
          ? "bg-blue-500"
          : "bg-purple-500"; // Credit Card
      return <Badge className={color}>{method}</Badge>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const value = row.getValue("amount") as number;
      return <span>RM {value.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => row.getValue("reference") || "-",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="flex items-center gap-2">
          <Link to={`/dashboard/payments/${payment.id}`}>
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
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <Link to="/dashboard/payments/create">
          <Button variant="info">
            <PlusCircle className="h-4 w-4" />
            Record Payment
          </Button>
        </Link>
      </div>
      <DataTable
        columns={paymentColumns}
        data={payments}
        />
    </div>
  );
}

