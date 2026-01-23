import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetAllSalesOrdersQuery } from "@/store/features/salesOrder/salesOrder";
import { useAppSelector } from "@/store/store";
import type { SalesOrder } from "@/types/salesOrder.types";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Link } from "react-router";
import { DataTable } from "./DataTable";

interface StatusOrdersTableProps {
    status: "pending" | "confirmed" | "delivered" | "in_transit";
}

export default function StatusOrdersTable({ status }: StatusOrdersTableProps) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const limit = 10;

    const { data, isLoading } = useGetAllSalesOrdersQuery({
        page,
        limit,
        search,
        status,
    });

    const orders = data?.data ?? [];
    const currency = useAppSelector((state) => state.currency.value);

    const OrderColumns: ColumnDef<SalesOrder>[] = [
        {
            accessorKey: "order_number",
            header: "Order #",
            cell: ({ row }) => (
                <span className="font-medium">{row.original.order_number}</span>
            ),
        },
        {
            accessorKey: "customer",
            header: "Customer",
            cell: ({ row }) => (
                <div className="font-semibold">{row.original.customer?.name}</div>
            ),
        },
        {
            accessorKey: "order_date",
            header: "Date",
            cell: ({ row }) => new Date(row.original.order_date).toLocaleDateString(),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const orderStatus = row.original.status;
                const color =
                    orderStatus === "delivered"
                        ? "bg-green-600"
                        : orderStatus === "pending"
                            ? "bg-yellow-600"
                            : orderStatus === "confirmed"
                                ? "bg-blue-600"
                                : orderStatus === "intransit"
                                    ? "bg-purple-600"
                                    : "bg-gray-500";

                return (
                    <Badge className={`${color} text-white capitalize`}>{orderStatus}</Badge>
                );
            },
        },
        {
            accessorKey: "total_amount",
            header: () => <div className="text-right">Amount ({currency})</div>,
            cell: ({ row }) => (
                <div className="text-right">
                    {parseFloat(row.original.total_amount).toFixed(2)}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Link to={`/dashboard/sales/orders/${row.original.id}`}>
                        <Button size="sm" variant="outline-info">
                            View
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <div>
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
        </div>
    );
}
