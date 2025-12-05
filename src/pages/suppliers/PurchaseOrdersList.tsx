
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
import { useGetAllPurchasesQuery } from "@/store/features/purchaseOrder/purchaseOrderApiService";
import type { PurchaseOrder } from "@/types/purchaseOrder.types";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";



/* COLUMNS */
const poColumns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: "po_number",
    header: "PO Number",
  },
  {
    accessorKey: "supplier_id",
    header: "Supplier",
    cell: ({ row }) => `Supplier #${row.original.supplier_id}`,
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const color =
        status === "pending"
          ? "bg-yellow-500"
          : status === "approved"
            ? "bg-blue-600"
            : status === "rejected"
              ? "bg-red-600"
              : "bg-green-600";

      return <Badge className={`${color} text-white capitalize`}>{status}</Badge>;
    },
  },
  {
    accessorKey: "total_amount",
    header: "Total",
    cell: ({ row }) =>
      `RM ${parseFloat(row.original.total_amount).toFixed(2)}`,
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

          <Link to={`/dashboard/purchase-orders/${po.id}/edit`}>
            <Button size="sm" variant="outline">
              <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
          </Link>
        </div>
      );
    },
  },
];

/* COMPONENT */
export default function PurchaseOrdersList() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const limit = 10;
  const { data, isFetching } = useGetAllPurchasesQuery({ page, limit, search });
  const purchaseOrdersData: PurchaseOrder[] = Array.isArray(data?.data)
    ? data.data
    : [];
  const pagination = data?.pagination ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPage: 1,
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Purchase Orders
        </h1>
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
          <DataTable
            columns={poColumns}
            data={purchaseOrdersData}
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
