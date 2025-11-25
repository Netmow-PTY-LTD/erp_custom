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

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router";

/* ------------------ TYPE ------------------ */
interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected" | "Delivered";
  total: number;
}

/* ------------------ DUMMY DATA ------------------ */
const purchaseOrdersData: PurchaseOrder[] = [
  {
    id: "1",
    poNumber: "PO1001",
    supplier: "ABC Ltd.",
    date: "2025-11-25",
    status: "Pending",
    total: 1200.0,
  },
  {
    id: "2",
    poNumber: "PO1002",
    supplier: "XYZ Corp.",
    date: "2025-11-22",
    status: "Approved",
    total: 3500.5,
  },
  {
    id: "3",
    poNumber: "PO1003",
    supplier: "Mega Supplies",
    date: "2025-11-20",
    status: "Delivered",
    total: 780.0,
  },
];

/* ------------------ COLUMNS ------------------ */
const poColumns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: "poNumber",
    header: "PO Number",
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const color =
        status === "Pending"
          ? "bg-yellow-500"
          : status === "Approved"
          ? "bg-blue-600"
          : status === "Rejected"
          ? "bg-red-600"
          : "bg-green-600";
      return <Badge className={`${color} text-white`}>{status}</Badge>;
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => `RM ${row.original.total.toFixed(2)}`,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const po = row.original;
      return (
        <div className="flex gap-2">
          <Link to={`/dashboard/purchase-orders/${po.id}`}>
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4 mr-1" /> View
            </Button>
          </Link>
          {/* <Link to={`/dashboard/purchase-orders/${po.id}/edit`}>
            <Button size="sm" variant="outline">
              <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
          </Link>
          <Button size="sm" variant="destructive">
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button> */}
        </div>
      );
    },
  },
];

/* ------------------ COMPONENT ------------------ */
export default function PurchaseOrdersList() {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Purchase Orders</h1>
        <Link to="/dashboard/purchase-orders/create">
          <Button>Add Purchase Order</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Purchase Orders</CardTitle>
          <CardDescription>Manage all your purchase orders</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={poColumns} data={purchaseOrdersData} />
        </CardContent>
      </Card>
    </div>
  );
}
