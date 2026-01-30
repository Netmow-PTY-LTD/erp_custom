/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  useDeleteSupplierMutation,
  useGetAllSuppliersQuery,
  useGetSupplierStatsQuery,
} from "@/store/features/suppliers/supplierApiService";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, PlusCircle, Trash2, Users as UsersIcon, ShoppingCart, User, Filter, AlertCircle, UserCheck, DollarSign, Printer } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router";
import { toast } from "sonner";
import type { Supplier } from "@/types/supplier.types";
import { useAppSelector } from "@/store/store";
import { SuperAdminPermission, SupplierPermission } from "@/config/permissions";



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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
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

export default function SuppliersList() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("newest");
  const limit = 10;

  const currency = useAppSelector((state) => state.currency.value);

  const userPermissions = useAppSelector((state) => state.auth.user?.role.permissions || []);

  // permissions

  const canDeleteSupplier = userPermissions.includes(SupplierPermission.DELETE) || userPermissions.includes(SuperAdminPermission.ACCESS_ALL);

  const { data: suppliersData, isLoading } = useGetAllSuppliersQuery({
    search,
    page,
    limit,
    sort: sort !== 'newest' ? sort : undefined
  });
  const [deleteSupplier, { isLoading: isDeleting }] = useDeleteSupplierMutation();

  const { data: supplierStats } = useGetSupplierStatsQuery(undefined);

  const activeSuppliers = supplierStats?.data?.find((c: any) => c.label === "All Active Suppliers")?.value || 0;
  const totalSuppliersStat = supplierStats?.data?.find((c: any) => c.label === "Total Suppliers")?.value || 0;
  const totalPurchase = supplierStats?.data?.find((c: any) => c.label === "Total Purchase Amount")?.value || 0;
  const totalPaid = supplierStats?.data?.find((c: any) => c.label === "Total Paid")?.value || 0;
  const totalDue = supplierStats?.data?.find((c: any) => c.label === "Total Due")?.value || 0;

  const stats = [
    {
      label: "Active Suppliers",
      value: activeSuppliers,
      gradient: "from-emerald-600 to-emerald-400",
      shadow: "shadow-emerald-500/30",
      icon: <UserCheck className="w-6 h-6 text-white" />,
    },
    {
      label: "Total Suppliers",
      value: totalSuppliersStat,
      gradient: "from-blue-600 to-blue-400",
      shadow: "shadow-blue-500/30",
      icon: <UsersIcon className="w-6 h-6 text-white" />,
    },
    {
      label: "Total Purchase Amount",
      value: `${currency} ${Number(totalPurchase).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      gradient: "from-indigo-600 to-indigo-400",
      shadow: "shadow-indigo-500/30",
      icon: <ShoppingCart className="w-6 h-6 text-white" />,
    },
    {
      label: "Total Paid",
      value: `${currency} ${Number(totalPaid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      gradient: "from-emerald-600 to-emerald-400",
      shadow: "shadow-emerald-500/30",
      icon: <DollarSign className="w-6 h-6 text-white" />,
    },
    {
      label: "Total Due",
      value: `${currency} ${Number(totalDue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      gradient: "from-rose-600 to-rose-400",
      shadow: "shadow-rose-500/30",
      icon: <AlertCircle className="w-6 h-6 text-white" />,
    },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | number | null>(null);
  const [previewData, setPreviewData] = useState<{
    images: string[];
    index: number;
  } | null>(null);

  const handleDeleteClick = (id: string | number) => {
    setSelectedSupplierId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSupplierId) return;

    try {
      await deleteSupplier(selectedSupplierId).unwrap();
      toast.success("Supplier deleted successfully");
    } catch (error) {
      toast.error("Failed to delete supplier");
      console.error(error);
    } finally {
      setModalOpen(false);
      setSelectedSupplierId(null);
    }
  };

  const supplierColumns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "id",
      header: "ID",
      meta: { className: "md:sticky md:left-0 z-20 bg-background min-w-[60px]" } as any
    },
    {
      accessorKey: "name",
      header: "Name",
      meta: { className: "md:sticky md:left-[60px] z-20 bg-background md:shadow-[4px_0px_5px_-2px_rgba(0,0,0,0.1)]" } as any,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">
            {row.original.name}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {row.original.contact_person || "—"}
          </span>
        </div>
      )
    },
    {
      accessorKey: "thumb_url",
      header: "Image",
      meta: { className: "min-w-[110px]" } as any,
      cell: ({ row }) => {
        const thumbUrl = row.original.thumb_url;
        return thumbUrl ? (
          <img
            src={thumbUrl}
            alt={row.original.name}
            className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity shrink-0"
            onClick={() =>
              setPreviewData({
                images: [thumbUrl].filter(Boolean) as string[],
                index: 0,
              })
            }
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-gray-500" />
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "total_purchase_amount",
      header: () => <div className="text-right">Total Purchase Amount ({currency})</div>,
      cell: ({ row }) => {
        const amount = row.getValue("total_purchase_amount");
        return (
          <div className="text-right font-medium">
            {amount ? Number(amount).toFixed(2) : "0.00"}
          </div>
        );
      },
    },
    {
      accessorKey: "total_paid_amount",
      header: () => <div className="text-right">Total Paid ({currency})</div>,
      cell: ({ row }) => {
        const amount = row.getValue("total_paid_amount");
        return (
          <div className="text-right text-emerald-600 font-medium">
            {amount ? Number(amount).toFixed(2) : "0.00"}
          </div>
        );
      },
    },
    {
      accessorKey: "total_due_amount",
      header: () => <div className="text-right">Total Due ({currency})</div>,
      cell: ({ row }) => {
        const amount = row.getValue("total_due_amount");
        return (
          <div className="text-right text-rose-600 font-bold">
            {amount ? Number(amount).toFixed(2) : "0.00"}
          </div>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("is_active") as boolean;
        const color = status ? "bg-green-600" : "bg-red-600";
        return <Badge className={`${color} text-white`}>{status ? "Active" : "Inactive"}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const supplier = row.original;
        return (
          <div className="flex gap-2">
            <Link to={`/dashboard/purchase-orders/create?supplierId=${supplier.id}`}>
              <Button size="sm" variant="outline" title="Create Purchase Order">
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </Link>
            <Link to={`/dashboard/suppliers/${supplier.id}/edit`}>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            </Link>
            {
              canDeleteSupplier && <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteClick(supplier.id)}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            }

          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 print:hidden">
        <h1 className="text-2xl font-bold tracking-tight">Supplier Management</h1>
        <div className="flex items-center gap-4">
          <div className="w-[180px] print:hidden">
            <Select
              value={sort}
              onValueChange={(value) => {
                setSort(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full bg-white dark:bg-slate-950 border-gray-200 dark:border-gray-800">
                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="top_purchase">Top Purchase</SelectItem>
                <SelectItem value="low_purchase">Low Purchase</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-slate-600 to-slate-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-slate-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-slate-500/40 active:translate-y-0 active:shadow-none print:hidden">
            <Printer size={18} />
            Print
          </button>
          <Link to="/dashboard/suppliers/create">
            <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-500/40 active:translate-y-0 active:shadow-none print:hidden">
              <PlusCircle size={18} />
              Add Supplier
            </button>
          </Link>
        </div>
      </div>

      {/* Print Only Header */}
      <div className="hidden print:block text-center mb-1">
        <h1 className="text-4xl font-extrabold uppercase tracking-tight">SUPPLIER LIST</h1>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-6 mb-6 print:hidden">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className={`relative flex-1 min-w-60 overflow-hidden rounded-2xl bg-linear-to-br ${item.gradient} p-6 shadow-lg ${item.shadow} transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-2px]`}
          >
            {/* Background Pattern */}
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

            {/* Progress/Indicator line (optional visual flair) */}
            <div className="mt-4 h-1 w-full rounded-full bg-black/10">
              <div className="h-full w-2/3 rounded-full bg-white/40" />
            </div>
          </div>
        ))}
      </div>

      <Card className="pt-6 pb-2 border-none shadow-none">
        <CardHeader className="print:hidden">
          <CardTitle>All Suppliers</CardTitle>
          <CardDescription>Manage your supplier list</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            // Data Table
            <div className="max-w-full overflow-hidden text-black">
              <DataTable
                columns={supplierColumns}
                data={suppliersData?.data || []}
                totalCount={suppliersData?.pagination?.total || 0}
                pageIndex={page - 1}
                pageSize={limit}
                onPageChange={(idx) => setPage(idx + 1)}
                onSearch={(val) => {
                  setSearch(val);
                  setPage(1);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation modal */}
      <ConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this supplier? This action cannot be undone."
      />

      <Dialog
        open={!!previewData}
        onOpenChange={(open) => !open && setPreviewData(null)}
      >
        <DialogContent className="max-w-3xl p-5 overflow-hidden bg-white">
          <div className="relative flex items-center justify-center">
            {previewData && (
              <>
                <img
                  src={previewData.images[previewData.index]}
                  alt="Supplier Preview"
                  className="max-w-full max-h-[70vh] rounded-lg object-contain"
                />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
                @media print {
                    .no-print, 
                    header, 
                    nav, 
                    aside, 
                    button, 
                    .print\\:hidden,
                    .flex.flex-wrap.items-center.justify-between.py-4.gap-4 {
                        display: none !important;
                    }
                    input, .max-w-sm { /* Hide search input specifically */
                        display: none !important;
                    }
                    html, body {
                        background: white !important;
                        overflow: visible !important;
                        height: auto !important;
                        color: black !important;
                        font-size: 10pt !important;
                    }
                    * {
                        color: black !important;
                        background: transparent !important;
                        box-shadow: none !important;
                        text-shadow: none !important;
                    }
                    .text-4xl {
                        font-size: 14pt !important;
                        font-weight: bold !important;
                        margin-bottom: 10px !important;
                    }
                    .text-sm {
                        font-size: 10pt !important;
                    }
                    .border, .Card, .CardContent, .pt-6 {
                        border: none !important;
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                        margin-top: 0 !important;
                    }
                    .bg-card {
                        background: none !important;
                        padding: 0 !important;
                    }
                    .p-6, .CardContent {
                        padding: 0 !important;
                    }
                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                        color: black !important;
                    }
                    th, td {
                        border: 1px solid #000 !important;
                        padding: 3px !important;
                        font-size: 7pt !important;
                        color: black !important;
                        text-align: left !important;
                    }
                    .text-right {
                        text-align: right !important;
                    }
                    th {
                        background-color: #f2f2f2 !important;
                        -webkit-print-color-adjust: exact;
                        font-weight: bold !important;
                    }

                    /* Force Name and Contact Person to same size */
                    td .flex.flex-col span {
                        font-size: 7pt !important;
                        font-weight: normal !important;
                        color: black !important;
                    }

                    /* Hide specific columns in print */
                    th:nth-child(3), td:nth-child(3) { /* Image column */
                        display: none !important;
                    }
                    th:nth-child(10), td:nth-child(10) { /* Status column */
                        display: none !important;
                    }
                    th:last-child, td:last-child { /* Actions column */
                        display: none !important;
                    }

                    .mb-8, .mb-6, .pb-2, .pb-4 {
                        margin-bottom: 0 !important;
                        padding-bottom: 0 !important;
                    }
                    .mt-2, .mt-1 {
                        margin-top: 0 !important;
                    }
                    .hidden.print\\:block.mb-1 {
                        margin-bottom: 5px !important;
                        display: block !important;
                    }
                    .rounded-md.border {
                        border: none !important;
                        box-shadow: none !important;
                    }
                    
                    /* Sticky columns fix for print */
                    .md\\:sticky {
                        position: static !important;
                        background: none !important;
                        shadow: none !important;
                    }
                }
            `}} />
    </div>
  );
}
