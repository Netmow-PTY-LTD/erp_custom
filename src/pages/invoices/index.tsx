import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { invoiceData } from "@/data/data";
import type { Invoice } from "@/types/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";


export default function Invoices() {
  const invoiceColumns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice #",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("invoiceNumber")}</span>
      ),
    },

    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold">{row.getValue("customer")}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.customerId}
          </div>
        </div>
      ),
    },

    {
      accessorKey: "orderNumber",
      header: "Order #",
      cell: ({ row }) => row.getValue("orderNumber"),
    },

    {
      accessorKey: "invoiceDate",
      header: "Invoice Date",
      cell: ({ row }) => row.getValue("invoiceDate"),
    },

    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => row.getValue("dueDate"),
    },

    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => {
        const value = row.getValue("totalAmount") as number;
        return <span>RM {value.toFixed(2)}</span>;
      },
    },

    {
      accessorKey: "paidAmount",
      header: "Paid Amount",
      cell: ({ row }) => {
        const value = row.getValue("paidAmount") as number;
        return <span>RM {value.toFixed(2)}</span>;
      },
    },

    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => {
        const value = row.getValue("balance") as number;
        return <span>RM {value.toFixed(2)}</span>;
      },
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        const color =
          status === "Paid"
            ? "bg-green-500"
            : status === "Sent"
            ? "bg-blue-500"
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
            <Link to={`/dashboard/invoices/${invoice.id}`}>
              <Button size="sm" variant="outline-info">View</Button>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
        <Link to="/dashboard/orders/create">
          <Button>Create Order</Button>
        </Link>
      </div>
      <DataTable
        columns={invoiceColumns}
        data={invoiceData}
        />
    </div>
  );
}
