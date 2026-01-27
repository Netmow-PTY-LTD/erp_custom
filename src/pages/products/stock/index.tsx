/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { Eye, Package, AlertTriangle, XCircle, DollarSign, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import DamageWastageForm from "@/components/products/DamageWastageForm";
import type { Product } from "@/types/types";
import { useGetAllProductsQuery } from "@/store/features/admin/productsApiService";
import { Link } from "react-router";
import { useAppSelector } from "@/store/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StockManagement() {
  const [openDamageForm, setOpenDamageForm] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [stockStatus, setStockStatus] = useState<string>("all");
  const limit = 10;

  const {
    data: fetchedProducts,
    isFetching,
  } = useGetAllProductsQuery({
    page,
    limit,
    search,
    stock_status: stockStatus === "all" ? undefined : stockStatus
  });

  const products: Product[] = fetchedProducts?.data || [];

  const pagination = fetchedProducts?.pagination ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPage: 1,
  };

  const currency = useAppSelector((state) => state.currency.value);

  const productColumns: ColumnDef<Product>[] = [
    {
      accessorKey: "sku",
      header: "SKU",
      meta: { className: "md:sticky md:left-0 z-20 bg-background min-w-[60px]" } as any
    },
    {
      accessorKey: "name",
      header: "Product Name",
      meta: { className: "md:sticky md:left-[60px] z-20 bg-background md:shadow-[4px_0px_5px_-2px_rgba(0,0,0,0.1)]" } as any
    },
    {
      accessorKey: "thumb_url",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={row.original.thumb_url}
          alt={row.original.name}
          className="w-10 h-10 rounded-full"
        />
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => row?.original?.category?.name,
    },
    {
      accessorKey: "cost",
      header: () => (
        <div className="text-right">Cost Price ({currency})</div>
      ),
      cell: ({ row }) => (
        <div className="text-right">{Number(row.original.cost).toFixed(2)}</div>
      ),
    },
    {
      accessorKey: "price",
      header: () => (
        <div className="text-right">Selling Price ({currency})</div>
      ),
      cell: ({ row }) => (
        <div className="text-right">{Number(row.original.price).toFixed(2)}</div>
      ),
    },
    {
      accessorKey: "stock_quantity",
      header: () => <div className="text-right">Stock</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">{row.original.stock_quantity}</div>
      ),
    },
    {
      id: "stock_status",
      header: "Stock wise status",
      cell: ({ row }) => {
        const stock = row.original.stock_quantity || 0;
        const isAvailable = stock > 0;
        return (
          <span
            className={`py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider ${isAvailable
              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
              : "bg-rose-100 text-rose-700 border border-rose-200"
              }`}
          >
            {isAvailable ? "Available" : "Out of Stock"}
          </span>
        );
      },
    },
    {
      id: "total_cost",
      header: () => <div className="text-right">Total Cost Price ({currency})</div>,
      cell: ({ row }) => {
        const totalCost = (row.original.stock_quantity || 0) * (row.original.cost || 0);
        return <div className="text-right text-blue-600">{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>;
      },
    },
    {
      id: "total_sell",
      header: () => <div className="text-right">Total Sell Price ({currency})</div>,
      cell: ({ row }) => {
        const totalSell = (row.original.stock_quantity || 0) * (row.original.price || 0);
        return <div className="text-right text-emerald-600">{totalSell.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>;
      },
    },
    {
      id: "profit",
      header: () => <div className="text-right">Total Profitable ({currency})</div>,
      cell: ({ row }) => {
        const profit = ((row.original.price || 0) - (row.original.cost || 0)) * (row.original.stock_quantity || 0);
        return (
          <div className={`text-right font-bold ${profit >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            {profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        );
      },
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
          <div className="flex items-center gap-2">
            <Link
              to={`/dashboard/products/${product.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View
            </Link>
            <button
              onClick={() => {
                setSelectedProductId(product.id);
                setOpenDamageForm(true);
              }}
              disabled={Number(product.stock_quantity) <= 0}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${Number(product.stock_quantity) <= 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                }`}
            >
              <Trash2 className="w-4 h-4" />
              Damage
            </button>
          </div>
        );
      },
    },
  ];

  // Calculate statistics
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock_quantity <= p.min_stock_level && p.stock_quantity > 0).length;
  const outOfStockProducts = products.filter(p => p.stock_quantity === 0).length;
  const totalStockValue = products.reduce((sum, p) => sum + (p.stock_quantity * p.cost), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Stock Management
          </h1>
          <p className="text-muted-foreground mt-2">Monitor and manage product inventory</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={stockStatus} onValueChange={(val) => { setStockStatus(val); setPage(1); }}>
            <SelectTrigger className="w-[200px] bg-white shadow-sm border-gray-200 rounded-xl font-medium">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 shadow-xl">
              <SelectItem value="all">All Stock Status</SelectItem>
              <SelectItem value="available" className="text-emerald-600 font-medium focus:text-emerald-700">Available</SelectItem>
              <SelectItem value="low_stock" className="text-orange-600 font-medium focus:text-orange-700">Low Stock</SelectItem>
              <SelectItem value="out_of_stock" className="text-rose-600 font-medium focus:text-rose-700">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 to-blue-400 p-6 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-2px]">
          {/* Background Pattern */}
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-black/10 blur-2xl" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white/90">Total Products</p>
              <h3 className="mt-2 text-3xl font-bold text-white">
                {totalProducts}
              </h3>
            </div>
            <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Progress/Indicator line */}
          <div className="mt-4 h-1 w-full rounded-full bg-black/10">
            <div className="h-full w-2/3 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Low Stock */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-orange-600 to-orange-400 p-6 shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-2px]">
          {/* Background Pattern */}
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-black/10 blur-2xl" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white/90">Low Stock</p>
              <h3 className="mt-2 text-3xl font-bold text-white">
                {lowStockProducts}
              </h3>
            </div>
            <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Progress/Indicator line */}
          <div className="mt-4 h-1 w-full rounded-full bg-black/10">
            <div className="h-full w-2/3 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Out of Stock */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-red-600 to-red-400 p-6 shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-2px]">
          {/* Background Pattern */}
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-black/10 blur-2xl" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white/90">Out of Stock</p>
              <h3 className="mt-2 text-3xl font-bold text-white">
                {outOfStockProducts}
              </h3>
            </div>
            <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Progress/Indicator line */}
          <div className="mt-4 h-1 w-full rounded-full bg-black/10">
            <div className="h-full w-2/3 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Total Stock Value */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-green-600 to-green-400 p-6 shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-2px]">
          {/* Background Pattern */}
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-black/10 blur-2xl" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white/90">Total Stock Value</p>
              <h3 className="mt-2 text-3xl font-bold text-white">
                {currency} {totalStockValue.toFixed(2)}
              </h3>
            </div>
            <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Progress/Indicator line */}
          <div className="mt-4 h-1 w-full rounded-full bg-black/10">
            <div className="h-full w-2/3 rounded-full bg-white/40" />
          </div>
        </div>
      </div>

      <DataTable
        columns={productColumns}
        data={products}
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

      <DamageWastageForm
        open={openDamageForm}
        setOpen={setOpenDamageForm}
        products={products}
        initialProductId={selectedProductId}
        refetchProducts={async () => { }}
      />
    </div>
  );
}
