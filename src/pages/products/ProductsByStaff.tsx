/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTable } from "@/components/dashboard/components/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
//import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import {
  // AlertCircle,
  AlertTriangle,
  Boxes,
  CheckCircle,
  Eye,
  MoreHorizontal,
  PackagePlus,
  Pencil,
  Tags,
  Trash,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";
import type { Product } from "@/types/types";
import { useState } from "react";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useGetProductStatsQuery,
  useGetAllCategoriesQuery,
} from "@/store/features/admin/productsApiService";
import { toast } from "sonner";
import { useAppSelector } from "@/store/store";
import { selectCurrency } from "@/store/currencySlice";
// import { ProductPermission } from "@/config/permissions";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ProductPermission, SuperAdminPermission } from "@/config/permissions";

export default function ProductsByStaff() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [previewData, setPreviewData] = useState<{
    images: string[];
    index: number;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [limit, setLimit] = useState<number>(10);



  const userPermissions = useAppSelector((state) => state.auth.user?.role.permissions || []);
  const canDeleteProduct = userPermissions.includes(ProductPermission.DELETE) || userPermissions.includes(SuperAdminPermission.ACCESS_ALL);

  const { data: productStatsData } = useGetProductStatsQuery(undefined);

  const totalProductsCount = productStatsData?.data?.filter(
    (p: { label: string; value: number }) => p.label === "Total Products"
  )?.[0]?.value || 0;

  const activeProductsCount = productStatsData?.data?.filter(
    (p: { label: string; value: number }) => p.label === "Active Products"
  )?.[0]?.value || 0;

  const lowStockCount = productStatsData?.data?.filter(
    (p: { label: string; value: number }) => p.label === "Low Stock"
  )?.[0]?.value || 0;

  const totalStockCount = productStatsData?.data?.filter(
    (p: { label: string; value: number }) => p.label === "Total Stock"
  )?.[0]?.value || 0;

  const stats = [
    {
      label: "Total Products",
      value: totalProductsCount,
      gradient: "from-blue-600 to-blue-400",
      shadow: "shadow-blue-500/30",
      icon: <Boxes className="w-6 h-6 text-white" />,
    },
    {
      label: "Active Products",
      value: activeProductsCount,
      gradient: "from-emerald-600 to-emerald-400",
      shadow: "shadow-emerald-500/30",
      icon: <CheckCircle className="w-6 h-6 text-white" />,
    },
    {
      label: "Low Stock",
      value: lowStockCount,
      gradient: "from-rose-600 to-rose-400",
      shadow: "shadow-rose-500/30",
      icon: <AlertTriangle className="w-6 h-6 text-white" />,
    },
    {
      label: "Total Stock",
      value: totalStockCount,
      gradient: "from-cyan-600 to-cyan-400",
      shadow: "shadow-cyan-500/30",
      icon: <Boxes className="w-6 h-6 text-white" />,
    },
  ];

  const {
    data: fetchedProducts,
    isFetching,
    refetch: refetchProducts,
  } = useGetAllProductsQuery({
    page,
    limit,
    search,
    category_id: selectedCategory !== "all" ? selectedCategory : undefined,
  });

  const { data: categoriesData } = useGetAllCategoriesQuery();
  const categories = categoriesData?.data || [];

  const products: Product[] = fetchedProducts?.data || [];
  const pagination = fetchedProducts?.pagination ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPage: 1,
  };

  const [deleteProduct] = useDeleteProductMutation();
  const handleDeleteProduct = async (id: number) => {
    // Ask for confirmation using a simple toast with prompt
    const confirmed = await new Promise<boolean>((resolve) => {
      toast("Are you sure you want to delete this product?", {
        action: {
          label: "Delete",
          onClick: () => resolve(true), // user confirmed
        },
        duration: 10000, // auto-dismiss after 5s
      });

      // resolve false if toast disappears automatically
      setTimeout(() => resolve(false), 10000);
    });

    if (!confirmed) return; // stop if user didn’t confirm

    try {
      const res = await deleteProduct(id).unwrap();
      if (res.status) {
        toast.success("Product deleted successfully");
        refetchProducts();
      } else {
        toast.error("Failed to delete unit");
      }
    } catch (error: any) {
      console.error("Error deleting unit:", error);
      toast.error(error?.data?.message || "Failed to delete unit");
    }
  };

  const currency = useAppSelector(selectCurrency);

  const productColumns: ColumnDef<Product>[] = [
    {
      accessorKey: "sku",
      header: "SKU",
      meta: { className: "md:sticky md:left-0 z-20 bg-background min-w-[60px]" } as any
    },
    {
      accessorKey: "name",
      header: "Product Name",
      meta: { className: "md:sticky md:left-[60px] z-20 bg-background md:shadow-[4px_0px_5px_-2px_rgba(0,0,0,0.1)]" } as any,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">
            {row.original.name}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {row.original.specification || "—"}
          </span>
        </div>
      )
    },
    {
      accessorKey: "thumb_url",
      header: "Image",
      meta: { className: "min-w-[110px]" } as any,
      cell: ({ row }) => (
        <img
          src={row.original.thumb_url}
          alt={row.original.name}
          className="w-20 h-20 rounded-full cursor-pointer hover:opacity-80 transition-opacity shrink-0"
          onClick={() =>
            setPreviewData({
              images: [row.original.thumb_url].filter(Boolean),
              index: 0,
            })
          }
        />
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => row?.original?.category?.name
    },
    {
      accessorKey: "price",
      header: () => (
        <div className="text-right">
          Selling Price {currency ? `(${currency})` : ""}
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          {parseFloat(row.getValue("price")).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "sales_tax",
      header: () => (
        <div className="text-right">
          Sales Tax {currency ? `(${currency})` : ""}
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          {parseFloat(row.getValue("sales_tax")).toFixed(2)}
        </div>
      ),
    },

    {
      accessorKey: "stock_quantity",
      header: () => <div className="text-right">Stock</div>,
      cell: ({ row }) => (
        <div className="text-right">{row.original.stock_quantity}</div>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.is_active;
        const bgColor = status ? "bg-green-500" : "bg-red-500";
        return (
          <span
            className={`py-1 px-2 rounded-full text-xs text-white font-medium ${bgColor}`}
          >
            {status ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  to={`/dashboard/products/${product.id}/edit`}
                  className="w-full flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  to={`/dashboard/products/${product.id}`}
                  className="w-full flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {
                canDeleteProduct && (
                  <DropdownMenuItem
                    onClick={() => handleDeleteProduct(product.id)}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Trash className="w-4 h-4" />
                    Delete
                  </DropdownMenuItem>
                )
              }
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-semibold">Product Management</h2>

        <div className="flex flex-wrap items-center gap-4">
          <Link to="/dashboard/products/categories">
            <Button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white">
              <Tags className="h-4 w-4" />
              Categories
            </Button>
          </Link>

          <Link to="/dashboard/products/create">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <PackagePlus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>


        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-6 mb-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className={`relative flex-1 min-w-60 overflow-hidden rounded-2xl bg-linear-to-br ${item.gradient} p-6 shadow-lg ${item.shadow} transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5`}
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
      <Card className="pt-6 pb-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>All Products</CardTitle>
          <div className="w-[140px]">
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full bg-white dark:bg-slate-950 border-gray-200 dark:border-gray-800">
                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={productColumns}
            data={products}
            pageIndex={page - 1}
            pageSize={limit}
            totalCount={pagination.total}
            onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
            onPageSizeChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            onSearch={(value) => {
              setSearch(value);
              setPage(1);
            }}
            isFetching={isFetching}
          />
        </CardContent>
      </Card>
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
                  alt="Product Preview"
                  className="max-w-full max-h-[70vh] rounded-lg object-contain"
                />

                {/* Left Arrow (Previous) */}
                {previewData.images.length > 1 && (
                  <button
                    onClick={() =>
                      setPreviewData((prev) =>
                        prev
                          ? {
                            ...prev,
                            index:
                              prev.index === 0
                                ? prev.images.length - 1
                                : prev.index - 1,
                          }
                          : null
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                )}

                {/* Right Arrow (Next) */}
                {previewData.images.length > 1 && (
                  <button
                    onClick={() =>
                      setPreviewData((prev) =>
                        prev
                          ? {
                            ...prev,
                            index:
                              prev.index === prev.images.length - 1
                                ? 0
                                : prev.index + 1,
                          }
                          : null
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                )}

                {/* Counter */}
                {previewData.images.length > 1 && (
                  <div className="absolute bottom-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                    {previewData.index + 1} / {previewData.images.length}
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
