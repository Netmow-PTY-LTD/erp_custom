import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { PlusCircle } from "lucide-react";
import type { SalesRoute } from "@/types/salesRoute.types";
import { useGetAllSalesRouteQuery } from "@/store/features/salesRoute/salesRoute";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function SalesRoutesPage() {

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const limit = 10;

  const {
    data: salesRouteData,
    isFetching,
  } = useGetAllSalesRouteQuery({ page, limit, search });

  const salesRoute: SalesRoute[] = salesRouteData?.data || [];

  console.log('salesRoute', salesRoute)







  const RoutesColumns: ColumnDef<SalesRoute>[] = [
    {
      accessorKey: "route_name",
      header: "Route Name",
      cell: ({ row }) => (
        <Link
          to={`/dashboard/sales-routes/${row.original.id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          {row.original.route_name}
        </Link>
      ),
    },

    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.original.description || "-"}
        </span>
      ),
    },

    {
      accessorKey: "assigned_sales_rep_id",
      header: "Sales Rep",
      cell: ({ row }) => (
        <span className="font-medium">
          Rep #{row.original.assigned_sales_rep_id ?? "-"}
        </span>
      ),
    },

    {
      accessorKey: "start_location",
      header: "Start Location",
      cell: ({ row }) => row.original.start_location || "-",
    },

    {
      accessorKey: "end_location",
      header: "End Location",
      cell: ({ row }) => row.original.end_location || "-",
    },

    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={
            row.original.is_active
              ? "bg-green-600 text-white"
              : "bg-gray-500 text-white"
          }
        >
          {row.original.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },

    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) =>
        new Date(row.original.created_at).toLocaleDateString(),
    },
    // {
    //   accessorKey: "sataff",
    //   header: "Staff",
    //   cell: () => {


    //     return 0
    //   }

    // },
    // {
    //   accessorKey: "customers",
    //   header: "Customers",
    //   cell: () => {

    //     return 0
    //   }

    // },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const route = row.original;
        return (
          <div className="flex items-center gap-2">
            <Link to={`/dashboard/sales/sales-routes/${route.id}`}>
              <Button size="sm" variant="outline-info">
                View
              </Button>
            </Link>

            <Link to={`/dashboard/sales/sales-routes/${route.id}/assign`}>
              <Button size="sm" variant="outline-info">
                Assign
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-5 mb-5">
        <h2 className="text-xl font-bold">Sales Routes</h2>
        <Link to="/dashboard/sales/sales-routes/create">
          <Button size="sm" variant="info">
            <PlusCircle className="h-4 w-4" />
            New Route
          </Button>
        </Link>
      </div>
      <Card className="shadow-sm">
        <CardContent>


          <DataTable
            columns={RoutesColumns}
            data={salesRoute}
            pageIndex={page - 1}
            pageSize={limit}
            totalCount={salesRouteData?.pagination?.total}
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
