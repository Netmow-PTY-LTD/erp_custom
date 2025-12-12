
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
import { useDeletePurchaseOrderMutation, useGetAllPurchasesQuery } from "@/store/features/purchaseOrder/purchaseOrderApiService";
import type { PurchaseOrder } from "@/types/purchaseOrder.types";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";


// Simple confirmation modal
function ConfirmModal({
  open,
  onClose,
  onConfirm,
  message,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl w-96">
        <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}









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

  const [deletePurchaseOrder, { isLoading: isDeleting }] =
    useDeletePurchaseOrderMutation();


  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPOId, setSelectedPOId] = useState<number | null>(null);

  /* DELETE HANDLER */
  const handleDelete = useCallback(async () => {
    if (!selectedPOId) return;

    try {
      const res = await deletePurchaseOrder(selectedPOId).unwrap();
      if (res.status) {
        toast.success("Purchase Order Deleted Successfully");
      } else {
        toast.error(res?.message || "Delete failed");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Delete failed");
    } finally {
      setModalOpen(false);
      setSelectedPOId(null);
    }
  }, [selectedPOId, deletePurchaseOrder]);





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
        `RM ${row.original.total_amount.toFixed(2)}`,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const po = row.original;
          const isEditable = !["approved", "received", "delivered"].includes(po.status); // hide for approved, received, delivered
        return (
          <div className="flex gap-2">
            <Link to={`/dashboard/purchase-orders/${po.id}`}>
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-1" /> View
              </Button>
            </Link>

            {isEditable && (
              <>
                <Link to={`/dashboard/purchase-orders/${po.id}/edit`}>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  onClick={() => {
                    setSelectedPOId(po.id);
                    setModalOpen(true);
                  }}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </>
            )}
          </div>
        );
      },
    }

  ];







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

      {/* Delete confirmation modal */}
      <ConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this supplier? This action cannot be undone."
      />
    </div>
  );
}
