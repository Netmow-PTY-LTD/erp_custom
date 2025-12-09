

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useGetAllSalesOrdersQuery } from "@/store/features/salesOrder/salesOrder";
import { useState } from "react";
import type { SalesOrder } from "@/types/salesOrder.types";
export default function DeliveryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); // backend starts from 1
  const [limit] = useState(10);

  const { data, isLoading } = useGetAllSalesOrdersQuery({
    page,
    limit,
    search,
  });

  const orders = data?.data ?? [];



  const OrderColumns: ColumnDef<SalesOrder>[] = [
    {
      accessorKey: "order_number",
      header: "Order #",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.order_number}</span>
      ),
    },

    {
      accessorKey: "customer_id",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold">Customer #{row.original.customer_id}</div>
          <div className="text-xs text-muted-foreground">
            ID: {row.original.customer_id}
          </div>
        </div>
      ),
    },

    {
      accessorKey: "total_amount",
      header: "Total Amount",
      cell: ({ row }) => `RM ${parseFloat(row.original.total_amount).toFixed(2)}`,
    },
    {
      accessorKey: "delivery_date",
      header: "Delivery Date ",
      cell: ({ row }) => {
        return row.original.delivery_date ? new Date(row.original.delivery_date).toLocaleDateString() : '-'
      }

    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        const color =
          status === "delivered"
            ? "bg-green-600"
            : status === "pending"
              ? "bg-yellow-600"
              : status === "confirmed"
                ? "bg-blue-600"
                : "bg-gray-500";

        return (
          <Badge className={`${color} text-white capitalize`}>
            {status}
          </Badge>
        );
      },
    },



    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex gap-2">
            <Link to={`/dashboard/orders/${item.id}`}>
              <Button size="sm" variant="outline-info">
                View
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];










  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Delivery - Ready to Dispatch</CardTitle>
        </CardHeader>

        <CardContent>

          <DataTable
            columns={OrderColumns}
            data={orders}
            pageIndex={page - 1}
            pageSize={limit}
            totalCount={data?.pagination?.total ?? 0}
            onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
            onSearch={(value) => {
              setSearch(value);
              setPage(1);
            }}
            isFetching={isLoading}
          />




        </CardContent>
      </Card>
    </div>
  );
}

