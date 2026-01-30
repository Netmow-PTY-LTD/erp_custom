import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useParams } from "react-router";
import {
  useGetAllStockMovementsQuery,
  useGetProductByIdQuery,
  useGetOrdersByProductIdQuery,
} from "@/store/features/admin/productsApiService";
import type { Product, StockMovement } from "@/types/types";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { useAppSelector } from "@/store/store";
import { BackButton } from "@/components/BackButton";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { MoveLeft, MoveRight } from "lucide-react";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";

export default function ProductDetailsPage() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [previewData, setPreviewData] = useState<{
    images: string[];
    index: number;
  } | null>(null);
  const limit = 10;
  const productId = useParams().productId;

  const { data: fetchedProduct } = useGetProductByIdQuery(Number(productId), {
    skip: !productId,
  });

  const product: Product | undefined = fetchedProduct?.data;

  const currency = useAppSelector((state) => state.currency.value);

  const {
    data: fetchedStockMovements,
    isFetching,
  } = useGetAllStockMovementsQuery(
    { id: Number(productId), page, limit, search },
    {
      skip: !productId,
    }
  );

  // console.log("Fetched Stock Movements: ", fetchedStockMovements);

  const columns: ColumnDef<StockMovement>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ getValue }) => {
        const dateStr = getValue<string>();
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")} ${String(
          date.getHours()
        ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      },
    },
    {
      accessorKey: "movement_type",
      header: "Movement Type",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => row?.original?.quantity,
    },
    {
      accessorKey: "reference_type",
      header: "Reference Number",
      cell: ({ row }) => row.original.reference_type,
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => row.original.notes,
    },
  ];

  /* ---------------- PRODUCT ORDERS LOGIC ---------------- */
  const [ordersPage, setOrdersPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const {
    data: fetchedOrders,
    isFetching: isOrdersFetching
  } = useGetOrdersByProductIdQuery({
    id: Number(productId),
    page: ordersPage,
    limit,
    status: statusFilter || undefined,
    start_date: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    end_date: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
  }, {
    skip: !productId
  });

  const orderColumns: ColumnDef<any>[] = [
    {
      accessorKey: "order_number",
      header: "Order #",
      cell: ({ row }) => (
        <Link to={`/dashboard/sales/orders/${row.original.id}`} className="text-blue-600 hover:underline">
          {row.original.order_number}
        </Link>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className={`capitalize ${row.original.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' :
          row.original.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
            'bg-gray-100 text-gray-800 border-gray-200'
          }`}>
          {row.original.status}
        </Badge>
      )
    },
    {
      accessorKey: "order_date",
      header: "Order Date",
      cell: ({ row }) => {
        if (!row.original.order_date) return <span>N/A</span>;
        return <span>{format(new Date(row.original.order_date), "yyyy-MM-dd")}</span>;
      }
    },
    {
      accessorKey: "customer.name",
      header: "Customer",
    }
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Product: {product?.name}</h1>

        <div className="flex gap-3">
          <Link to={`/dashboard/products/${product?.id}/edit`}>
            <Button variant="outline-info">✏️ Edit</Button>
          </Link>
          <BackButton />
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="col-span-1 space-y-6">
          {/* Overview */}
          <Card className="py-6 border-none shadow-md bg-white">
            <CardHeader className="pb-2 border-b mb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                📦 Product Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 items-center">
                {/* Product Details */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SKU</p>
                    <p className="text-lg font-bold font-mono text-blue-600">{product?.sku}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</p>
                    <p className="text-sm font-medium">{product?.category?.name || "Uncategorized"}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 text-xs font-bold ${product?.is_active
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                    >
                      {product?.is_active ? "● ACTIVE" : "○ INACTIVE"}
                    </Badge>
                  </div>
                </div>

                {/* Product Image */}
                <div className="flex flex-col items-center justify-center p-2 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50 hover:bg-white transition-colors group cursor-pointer"
                  onClick={() => setPreviewData({ images: [product?.thumb_url || ""], index: 0 })}
                >
                  <img
                    src={product?.thumb_url}
                    alt={product?.name}
                    className="w-full h-auto max-h-[140px] object-contain rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                  <p className="mt-2 text-[10px] font-bold text-gray-400 group-hover:text-blue-500 transition-colors uppercase tracking-widest">
                    Product Image
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>
                <strong>Unit Price:</strong> {currency} {product?.price?.toFixed(2)}
              </p>
              <p>
                <strong>Cost Price:</strong> {currency} {product?.cost?.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          {/* Stock */}
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Stock</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                <strong>InitialStock:</strong> {product?.initial_stock}{" "}
                {product?.unit?.name}
              </p>
              <p>
                <strong>Stock:</strong> {product?.stock_quantity}{" "}
                {product?.unit?.name}
              </p>
              <p>
                <strong>Min:</strong> {product?.min_stock_level} &nbsp; | &nbsp;
                <strong>Max:</strong> {product?.max_stock_level}
              </p>


            </CardContent>
          </Card>

          {/* Product Gallery */}
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Product Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {product?.gallery_items && product.gallery_items.length > 0 ? (
                  product.gallery_items.map((url, i) => (
                    <div
                      key={url}
                      className="aspect-square rounded-lg overflow-hidden border bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() =>
                        setPreviewData({
                          images: product.gallery_items || [],
                          index: i,
                        })
                      }
                    >
                      <img
                        src={url}
                        alt={`Gallery ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <p className="col-span-3 text-sm text-muted-foreground text-center py-4">
                    No gallery images available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Recent Stock Movements */}
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={fetchedStockMovements?.data}
                pageIndex={page - 1}
                pageSize={limit}
                totalCount={fetchedStockMovements?.pagination?.total ?? 0}
                search={search}
                onSearch={(val) => {
                  setSearch(val);
                  setPage(1);
                }}
                isFetching={isFetching}
              />
            </CardContent>
          </Card>


          {/* Recent Orders */}
          <Card className="py-6">
            <CardHeader className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle>Recent Orders Containing This Product</CardTitle>
              <div className="flex flex-wrap gap-4">
                {/* Status Filter */}
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setOrdersPage(1);
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Date Range */}
                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={(range: DateRange | undefined) => {
                    setDateRange(range);
                    setOrdersPage(1);
                  }}
                  placeholder="Pick a date range"
                  className="w-[240px]"
                  numberOfMonths={2}
                />

                {(statusFilter || dateRange) && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setStatusFilter("");
                      setDateRange(undefined);
                      setOrdersPage(1);
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>

            </CardHeader>
            <CardContent>
              <DataTable
                columns={orderColumns}
                data={fetchedOrders?.data}
                pageIndex={ordersPage - 1}
                pageSize={limit}
                totalCount={fetchedOrders?.pagination?.total ?? 0}
                onPageChange={(p) => setOrdersPage(p + 1)}
                isFetching={isOrdersFetching}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog
        open={!!previewData}
        onOpenChange={(open) => !open && setPreviewData(null)}
      >
        <DialogContent className="max-w-3xl p-5 overflow-hidden bg-white border-none shadow-2xl">
          <div className="relative flex items-center justify-center min-h-[50vh]">
            {previewData && (
              <>
                <img
                  src={previewData.images[previewData.index]}
                  alt="Product Preview"
                  className="max-w-full max-h-[70vh] rounded-lg object-contain shadow-sm"
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
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110 active:scale-95"
                  >
                    <MoveLeft className="w-5 h-5" />
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all hover:scale-110 active:scale-95"
                  >
                    <MoveRight className="w-5 h-5" />
                  </button>
                )}

                {/* Counter */}
                {previewData.images.length > 1 && (
                  <div className="absolute bottom-2 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium">
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
