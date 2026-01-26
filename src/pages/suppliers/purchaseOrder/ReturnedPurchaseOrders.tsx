/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { useDeletePurchaseOrderMutation, useGetAllPurchasesQuery, useUpdatePurchaseOrderMutation } from "@/store/features/purchaseOrder/purchaseOrderApiService";
import { useAppSelector } from "@/store/store";
import type { PurchaseOrder } from "@/types/purchaseOrder.types";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Trash2, FileText, PlusCircle, RotateCcw } from "lucide-react";
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
export default function ReturnedPurchaseOrders() {
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const limit = 10;

    // Filter by status: "returned"
    const { data, isFetching } = useGetAllPurchasesQuery({
        page,
        limit,
        search,
        status: "returned"
    });

    const purchaseOrdersData: PurchaseOrder[] = Array.isArray(data?.data)
        ? data.data
        : [];

    const pagination = data?.pagination ?? {
        total: 0,
        page: 1,
        limit: 10,
        totalPage: 1,
    };

    // For stats, we might want to still show general PO stats or specialized ones.
    // Using the same logic as PurchaseOrdersList for consistency, but we could specialize it.
    const { data: allPOData } = useGetAllPurchasesQuery({ limit: 1000 });
    const allPOs = (Array.isArray(allPOData?.data) ? allPOData?.data : []) as any[];

    const returnedPOsCount = allPOs.filter((po: any) => po.status === "returned").length;

    const stats = [
        {
            label: "Returned Orders",
            value: returnedPOsCount,
            gradient: "from-rose-600 to-rose-400",
            shadow: "shadow-rose-500/30",
            icon: <RotateCcw className="w-6 h-6 text-white" />,
        },
        {
            label: "Total Orders",
            value: allPOs.length,
            gradient: "from-blue-600 to-blue-400",
            shadow: "shadow-blue-500/30",
            icon: <FileText className="w-6 h-6 text-white" />,
        },
    ];

    const currency = useAppSelector((state) => state.currency.value);

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
        } catch (error: any) {
            toast.error(error?.data?.message || "Delete failed");
        } finally {
            setModalOpen(false);
            setSelectedPOId(null);
        }
    }, [selectedPOId, deletePurchaseOrder]);

    const [updatePurchaseOrder] = useUpdatePurchaseOrderMutation();



    /* COLUMNS */
    const poColumns: ColumnDef<PurchaseOrder>[] = [
        {
            accessorKey: "po_number",
            header: "PO Number",
            meta: { className: "md:sticky md:left-0 z-20 bg-background min-w-[120px]" } as any
        },
        {
            accessorKey: "supplier",
            header: "Supplier",
            meta: { className: "md:sticky md:left-[120px] z-20 bg-background md:shadow-[4px_0px_5px_-2px_rgba(0,0,0,0.1)]" } as any,
            cell: ({ row }) => `${row.original.supplier?.name || "N/A"}`,
        },
        {
            accessorKey: "order_date",
            header: "Order Date",
            cell: ({ row }) => new Date(row.original.order_date as string).toLocaleDateString(),
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
                                : status === "returned"
                                    ? "bg-orange-600"
                                    : "bg-green-600";

                return <Badge className={`${color} text-white capitalize`}>{status}</Badge>;
            },
        },
        {
            accessorKey: "total_payable_amount",
            header: () => <div className="text-right">Total Payable ({currency})</div>,
            cell: ({ row }) => (
                <div className="text-right">
                    {row.original.total_payable_amount.toFixed(2)}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const po = row.original;
                const isEditable = !["approved", "received", "delivered"].includes(po.status);

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
                                        setSelectedPOId(Number(po.id));
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
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight">
                    Returned Purchase Orders
                </h1>
                <Link to="/dashboard/purchase-orders/create">
                    <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-500/40 active:translate-y-0 active:shadow-none">
                        <PlusCircle size={18} />
                        Add Purchase Order
                    </button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item, idx) => (
                    <div
                        key={idx}
                        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} p-6 shadow-lg ${item.shadow} transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-2px]`}
                    >
                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-black/10 blur-2xl" />

                        <div className="relative flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-white/90">{item.label}</p>
                                <h3 className="mt-2 text-3xl font-bold text-white">
                                    {item.value}
                                </h3>
                            </div>
                            <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                                {item.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Card className="py-6">
                <CardHeader>
                    <CardTitle>Returned Purchase Orders</CardTitle>
                    <CardDescription>Manage your returned purchase orders</CardDescription>
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
                message="Are you sure you want to delete this purchase order? This action cannot be undone."
            />
        </div>
    );
}
