"use client";

import { useState } from "react";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMyCustomerWiseInvoicesQuery } from "@/store/features/reports/reportApiService";
import { useAppSelector } from "@/store/store";
import { FileText, DollarSign, AlertCircle, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MyCustomerWiseInvoicesData {
    customer_id: number;
    customer_name: string;
    invoice_count: number;
    total_amount: number;
    paid_amount: number;
    unpaid_amount: number;
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

export default function MyCustomerWiseInvoices() {
    const [startDate, setStartDate] = useState(getStartOfCurrentMonth());
    const [endDate, setEndDate] = useState(getEndOfCurrentMonth());
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const limit = 10;

    const currency = useAppSelector((state) => state.currency.value);

    const { data, isFetching } = useGetMyCustomerWiseInvoicesQuery({
        startDate,
        endDate,
        page,
        limit,
        search,
    });

    const columns: ColumnDef<MyCustomerWiseInvoicesData>[] = [
        {
            accessorKey: "customer_name",
            header: "Customer",
            cell: (info) => info.getValue() as string,
        },
        {
            accessorKey: "invoice_count",
            header: "Invoices",
            cell: (info) => info.getValue() as number,
        },
        {
            accessorKey: "total_amount",
            header: "Total Amount",
            cell: (info) => `${currency} ${(info.getValue() as number).toFixed(2)}`,
        },
        {
            accessorKey: "paid_amount",
            header: "Paid Amount",
            cell: (info) => `${currency} ${(info.getValue() as number).toFixed(2)}`,
        },
        {
            accessorKey: "unpaid_amount",
            header: "Unpaid Amount",
            cell: (info) => `${currency} ${(info.getValue() as number).toFixed(2)}`,
        },
        {
            id: "payment_percentage",
            header: "Paid %",
            cell: (info) => {
                const row = info.row.original as MyCustomerWiseInvoicesData;
                const percentage = row.total_amount > 0 ? (row.paid_amount / row.total_amount) * 100 : 0;
                return `${percentage.toFixed(1)}%`;
            },
        },
    ];

    // Calculate summary stats from data
    const totalCustomers = data?.pagination?.total || 0;
    const totalInvoices = data?.data?.reduce((sum: number, item: any) => sum + (item.invoice_count || 0), 0) || 0;
    const totalAmount = data?.data?.reduce((sum: number, item: any) => sum + (item.total_amount || 0), 0) || 0;
    const totalUnpaid = data?.data?.reduce((sum: number, item: any) => sum + (item.unpaid_amount || 0), 0) || 0;

    const stats = [
        {
            label: "Total Customers",
            value: totalCustomers,
            gradient: "from-blue-600 to-blue-400",
            shadow: "shadow-blue-500/30",
            icon: <Users className="w-6 h-6 text-white" />,
        },
        {
            label: "Total Invoices",
            value: totalInvoices,
            gradient: "from-purple-600 to-purple-400",
            shadow: "shadow-purple-500/30",
            icon: <FileText className="w-6 h-6 text-white" />,
        },
        {
            label: "Total Amount",
            value: `${currency} ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            gradient: "from-emerald-600 to-emerald-400",
            shadow: "shadow-emerald-500/30",
            icon: <DollarSign className="w-6 h-6 text-white" />,
        },
        {
            label: "Outstanding",
            value: `${currency} ${totalUnpaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            gradient: "from-rose-600 to-rose-400",
            shadow: "shadow-rose-500/30",
            icon: <AlertCircle className="w-6 h-6 text-white" />,
        },
    ];

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">My Customer Wise Invoices</h1>
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
                        <CardTitle>Invoices by Customer</CardTitle>
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
