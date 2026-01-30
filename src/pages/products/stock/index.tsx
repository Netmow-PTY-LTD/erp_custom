/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { Eye, Trash2, Printer } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import DamageWastageForm from "@/components/products/DamageWastageForm";
import type { Product } from "@/types/types";
import { useGetAllProductsQuery, useGetProductStatsQuery } from "@/store/features/admin/productsApiService";
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

  // Fetch stats from API
  const { data: statsData } = useGetProductStatsQuery(undefined);
  const stats = statsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 print:hidden">
        <div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Stock Management
          </h1>
          <p className="text-muted-foreground mt-2">Monitor and manage product inventory</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-slate-600 to-slate-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-slate-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-slate-500/40 active:translate-y-0 active:shadow-none print:hidden">
            <Printer size={18} />
            Print
          </button>
          <Select value={stockStatus} onValueChange={(val) => { setStockStatus(val); setPage(1); }}>
            <SelectTrigger className="w-[200px] bg-white shadow-sm border-gray-200 rounded-xl font-medium print:hidden">
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

      {/* Print Only Header */}
      <div className="hidden print:block text-center mb-1">
        <h1 className="text-4xl font-extrabold uppercase tracking-tight">STOCK MANAGEMENT REPORT</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((item: any, idx: number) => {
          // Dynamic colors based on label or index if color not provided
          const baseColor = item.color || (
            item.label.includes('Purchase') ? 'bg-blue-600' :
              item.label.includes('Salable') ? 'bg-emerald-600' :
                item.label.includes('Profit') ? 'bg-indigo-600' : 'bg-slate-600'
          );

          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl ${baseColor} p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1`}
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-xl" />

              <div className="relative space-y-2">
                <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">{item.label}</p>
                <h3 className="text-2xl font-extrabold text-white truncate">
                  {item.isCurrency ? `${currency} ` : ''}
                  {item.isCurrency ? Number(item.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.value}
                </h3>
              </div>

              <div className="mt-4 h-1 w-full rounded-full bg-black/10">
                <div className="h-full w-1/3 rounded-full bg-white/30" />
              </div>
            </div>
          );
        })}
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
                    .grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-6,
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
                        margin-bottom: 5px !important;
                        background: none !important;
                        -webkit-text-fill-color: initial !important;
                        color: black !important;
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

                    /* Hide specific columns in print */
                    th:nth-child(3), td:nth-child(3) { /* Image column */
                        display: none !important;
                    }
                    th:nth-child(8), td:nth-child(8) { /* Stock wise status */
                        display: none !important;
                    }
                    th:nth-child(12), td:nth-child(12) { /* Status column */
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
