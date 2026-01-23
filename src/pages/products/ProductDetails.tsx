import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "react-router";
import {
  useGetAllStockMovementsQuery,
  useGetProductByIdQuery,
  useGetOrdersByProductIdQuery,
} from "@/store/features/admin/productsApiService";
import type { Product, StockMovement } from "@/types/types";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { useState } from "react";
import EditStockForm from "@/components/products/EditStockForm";
import { useAppSelector } from "@/store/store";
import { BackButton } from "@/components/BackButton";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";

export default function ProductDetailsPage() {
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const limit = 10;
  const productId = useParams().productId;

  const { data: fetchedProduct } = useGetProductByIdQuery(Number(productId), {
    skip: !productId,
  });

  const product: Product | undefined = fetchedProduct?.data;

  const currency = useAppSelector((state) => state.currency.value);

  const {
    data: fetchedStockMovements,
    refetch: refetchStockMovements,
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
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>SKU:</strong> {product?.sku}
              </p>
              <p>
                <strong>Category:</strong> {product?.category?.name}
              </p>
              <p className="flex items-center gap-2">
                <strong>Status:</strong>
                <Badge variant="outline" className="bg-gray-200 text-gray-700">
                  {product?.is_active ? "Active" : "Inactive"}
                </Badge>
              </p>
              <div className="flex flex-col gap-4">
                <strong>Product Image:</strong>
                <img
                  src={product?.thumb_url}
                  alt={product?.name}
                  className="w-20 h-20 rounded-full"
                />
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

              <Separator />

              <div className="flex justify-center">
                <EditStockForm
                  productId={Number(productId)}
                  open={open}
                  setOpen={setOpen}
                  refetchStockMovements={refetchStockMovements}
                />
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
    </div>
  );
}
