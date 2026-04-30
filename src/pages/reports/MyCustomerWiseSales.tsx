"use client";

import { useState } from "react";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMyCustomerWiseSalesQuery } from "@/store/features/reports/reportApiService";
import { useAppSelector } from "@/store/store";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MyCustomerWiseSalesData {
    customer_id: number;
    customer_name: string;
    order_count: number;
    total_sales: number;
}

function getStartOfCurrentMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .slice(0, 10);
}

function getEndOfCurrentMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .slice(0, 10);
}

export default function MyCustomerWiseSales() {
    const [startDate, setStartDate] = useState(getStartOfCurrentMonth());
    const [endDate, setEndDate] = useState(getEndOfCurrentMonth());
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const limit = 10;

    const currency = useAppSelector((state) => state.currency.value);

    const { data, isFetching } = useGetMyCustomerWiseSalesQuery({
        startDate,
        endDate,
        page,
        limit,
        search,
    });

    const columns: ColumnDef<MyCustomerWiseSalesData>[] = [
        {
            accessorKey: "customer_name",
            header: "Customer",
            cell: (info) => info.getValue() as string,
        },
        {
            accessorKey: "order_count",
            header: "Orders",
            cell: (info) => info.getValue() as number,
        },
        {
            accessorKey: "total_sales",
            header: "Total Sales",
            cell: (info) => `${currency} ${(info.getValue() as number).toFixed(2)}`,
        },
        {
            id: "avg_order_value",
            header: "Avg Order Value",
            cell: (info) => {
                const row = info.row.original as MyCustomerWiseSalesData;
                const avg = row.order_count > 0 ? row.total_sales / row.order_count : 0;
                return `${currency} ${avg.toFixed(2)}`;
            },
        },
    ];

    // Calculate summary stats from data
    const totalCustomers = data?.pagination?.total || 0;
    const totalOrders = data?.data?.reduce((sum: number, item: any) => sum + (item.order_count || 0), 0) || 0;
    const totalSales = data?.data?.reduce((sum: number, item: any) => sum + (item.total_sales || 0), 0) || 0;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    const stats = [
        {
            label: "Total Customers",
            value: totalCustomers,
            gradient: "from-blue-600 to-blue-400",
            shadow: "shadow-blue-500/30",
            icon: <Users className="w-6 h-6 text-white" />,
        },
        {
            label: "Total Orders",
            value: totalOrders,
            gradient: "from-emerald-600 to-emerald-400",
            shadow: "shadow-emerald-500/30",
            icon: <ShoppingCart className="w-6 h-6 text-white" />,
        },
        {
            label: "Total Sales",
            value: `${currency} ${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            gradient: "from-purple-600 to-purple-400",
            shadow: "shadow-purple-500/30",
            icon: <DollarSign className="w-6 h-6 text-white" />,
        },
        {
            label: "Avg Order Value",
            value: `${currency} ${avgOrderValue.toFixed(2)}`,
            gradient: "from-orange-600 to-orange-400",
            shadow: "shadow-orange-500/30",
            icon: <TrendingUp className="w-6 h-6 text-white" />,
        },
    ];

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">My Customer Wise Sales</h1>
                <div className="flex gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(new Date(startDate), "PPP") : "Pick start date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={new Date(startDate)} onSelect={(date) => date && setStartDate(date.toISOString().slice(0, 10))} initialFocus />
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? format(new Date(endDate), "PPP") : "Pick end date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={new Date(endDate)} onSelect={(date) => date && setEndDate(date.toISOString().slice(0, 10))} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className={`bg-gradient-to-br ${stat.gradient} ${stat.shadow}`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-white">{stat.label}</CardTitle>
                            {stat.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Sales by Customer</CardTitle>
                        <Input
                            placeholder="Search customers..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="max-w-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={data?.data || []}
                        pageIndex={page - 1}
                        pageSize={limit}
                        totalCount={data?.pagination?.total || 0}
                        onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
                        isFetching={isFetching}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
