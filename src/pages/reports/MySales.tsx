"use client";

import { useState } from "react";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMySalesQuery } from "@/store/features/reports/reportApiService";
import { useGetCustomersQuery } from "@/store/features/customers/customersApiService";
import { useAppSelector } from "@/store/store";
import { DollarSign, ShoppingCart, Users, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MySalesData {
    customer_id: number;
    customer_name: string;
    order_count: number;
    total_sales: number;
    paid_amount: number;
    due_amount: number;
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

export default function MySales() {
    const [startDate, setStartDate] = useState(getStartOfCurrentMonth());
    const [endDate, setEndDate] = useState(getEndOfCurrentMonth());
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<string>("all");
    const limit = 10;

    const currency = useAppSelector((state) => state.currency.value);

    // Fetch customers for the filter dropdown
    const { data: customersData } = useGetCustomersQuery({ page: 1, limit: 100 });

    const { data, isFetching } = useGetMySalesQuery({
        startDate,
        endDate,
        page,
        limit,
        search,
        customerId: selectedCustomer,
    });

    const columns: ColumnDef<MySalesData>[] = [
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
            header: "Sales",
            cell: (info) => `${currency} ${(info.getValue() as number).toFixed(2)}`,
        },
        {
            accessorKey: "paid_amount",
            header: "Paid",
            cell: (info) => `${currency} ${(info.getValue() as number).toFixed(2)}`,
        },
        {
            accessorKey: "due_amount",
            header: "Due",
            cell: (info) => `${currency} ${(info.getValue() as number).toFixed(2)}`,
        },
    ];

    // Calculate summary stats from data
    const totalCustomers = data?.data?.length || 0;
    const totalOrders = data?.data?.reduce((sum: number, item: any) => sum + (item.order_count || 0), 0) || 0;
    const totalSales = data?.data?.reduce((sum: number, item: any) => sum + (item.total_sales || 0), 0) || 0;
    const totalPaid = data?.data?.reduce((sum: number, item: any) => sum + (item.paid_amount || 0), 0) || 0;
    const totalDue = data?.data?.reduce((sum: number, item: any) => sum + (item.due_amount || 0), 0) || 0;

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
            label: "Total Paid",
            value: `${currency} ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            gradient: "from-green-600 to-green-400",
            shadow: "shadow-green-500/30",
            icon: <DollarSign className="w-6 h-6 text-white" />,
        },
        {
            label: "Total Due",
            value: `${currency} ${totalDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            gradient: "from-red-600 to-red-400",
            shadow: "shadow-red-500/30",
            icon: <DollarSign className="w-6 h-6 text-white" />,
        },
    ];

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">My Sales</h1>
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

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                    <div className="flex items-center justify-between gap-4">
                        <CardTitle>Sales by Customer</CardTitle>
                        <div className="flex gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[200px] justify-start">
                                        <Filter className="w-4 h-4 mr-2" />
                                        {selectedCustomer === "all"
                                            ? "Filter by Customer"
                                            : customersData?.data?.find((c: any) => c.id.toString() === selectedCustomer)?.company +
                                              " - " +
                                              customersData?.data?.find((c: any) => c.id.toString() === selectedCustomer)?.name || "Filter by Customer"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                    <div className="p-2">
                                        <Input
                                            placeholder="Search customers..."
                                            value={search}
                                            onChange={(e) => {
                                                setSearch(e.target.value);
                                            }}
                                            className="mb-2"
                                        />
                                        <div className="max-h-[300px] overflow-y-auto">
                                            <div
                                                className="flex items-center gap-2 px-2 py-2 hover:bg-accent rounded-md cursor-pointer"
                                                onClick={() => {
                                                    setSelectedCustomer("all");
                                                    setPage(1);
                                                }}
                                            >
                                                All Customers
                                            </div>
                                            {customersData?.data
                                                ?.filter((customer: any) =>
                                                    customer.company.toLowerCase().includes(search.toLowerCase()) ||
                                                    customer.name.toLowerCase().includes(search.toLowerCase())
                                                )
                                                .map((customer: any) => (
                                                    <div
                                                        key={customer.id}
                                                        className="flex items-center gap-2 px-2 py-2 hover:bg-accent rounded-md cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedCustomer(customer.id.toString());
                                                            setPage(1);
                                                        }}
                                                    >
                                                        {customer.company} - {customer.name}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={data?.data || []}
                        pagination={{
                            page,
                            totalPages: data?.pagination?.totalPage || 1,
                            onPageChange: setPage,
                        }}
                        isFetching={isFetching}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
