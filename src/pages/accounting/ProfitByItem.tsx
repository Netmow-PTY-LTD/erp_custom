"use client";

import { useState } from "react";
import { Search, TrendingUp, DollarSign, Package, BarChart3, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useGetProductProfitLossQuery } from "@/store/features/accounting/accoutntingApiService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ProfitByItem() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [searchQuery, setSearchQuery] = useState("");

    // API Query Params
    const queryParams: { from?: string; to?: string } = {
        from: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
        to: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
    };

    const { data: reportResponse, isLoading, isError } = useGetProductProfitLossQuery(queryParams);

    const profitByItemData = reportResponse?.data || [];

    const filteredData = profitByItemData.filter(item =>
        item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(item => {
        // Calculate margin securely
        const margin = item.revenue > 0
            ? ((item.profit / item.revenue) * 100)
            : 0;

        return {
            ...item,
            margin: Number(margin.toFixed(2))
        };
    });

    const totalSales = filteredData.reduce((sum, item) => sum + Number(item.revenue), 0);
    const totalCost = filteredData.reduce((sum, item) => sum + Number(item.cost), 0);
    const totalProfit = filteredData.reduce((sum, item) => sum + Number(item.profit), 0);
    const averageMargin = filteredData.length > 0
        ? (filteredData.reduce((sum, item) => sum + item.margin, 0) / filteredData.length)
        : 0;

    // Handler triggers re-fetch automatically thanks to RTK Query and state change,
    // but we add a manual refetch button for clarity if needed, or just let the date picker drive it.
    // For this UI, the "Run Analysis" button conceptually updates the view, 
    // but in React state terms, changing the date range already does it. 
    // We can make the button purely visual or force a refetch if we wanted manual control,
    // but typically reactive is better. 
    // Let's just keep the button as a manual refresh trigger if needed, or simpler: 
    // The user picks dates -> State updates -> Query refetches.

    if (isError) {
        toast.error("Failed to fetch product profit data.");
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic">
                        Profit by Item
                    </h2>
                    <p className="text-muted-foreground italic">Analyze profitability across your entire product catalog.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        Export Report <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Filters Section */}
            <Card className="border-none shadow-sm bg-slate-50/50 dark:bg-slate-900/50">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Search Products</label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or SKU..."
                                    className="pl-9 bg-white dark:bg-slate-950"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 italic">Select Period</label>
                            <DateRangePicker
                                dateRange={dateRange}
                                onDateRangeChange={setDateRange}
                                className="w-[300px] bg-white dark:bg-slate-950"
                            />
                        </div>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                            onClick={() => {
                                // Optional: You could implement manual refetching here if auto-fetch isn't desired
                                // For now, the date picker state drives the query perfectly.
                                toast.info("Analysis updated based on selected criteria.");
                            }}
                        >
                            Run Analysis
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500 shadow-sm transition-all hover:shadow-md py-6">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardDescription className="font-medium">Total Revenue</CardDescription>
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                                <DollarSign className="w-4 h-4 text-blue-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            {isLoading ? <Skeleton className="h-8 w-24" /> : `RM ${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card className="border-l-4 border-l-slate-400 shadow-sm transition-all hover:shadow-md py-6">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardDescription className="font-medium italic">Total Cost</CardDescription>
                            <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <Package className="w-4 h-4 text-slate-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            {isLoading ? <Skeleton className="h-8 w-24" /> : `RM ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card className="border-l-4 border-l-emerald-500 shadow-sm transition-all hover:shadow-md py-6">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardDescription className="font-medium">Gross Profit</CardDescription>
                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-emerald-600">
                            {isLoading ? <Skeleton className="h-8 w-24" /> : `RM ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card className="border-l-4 border-l-amber-500 shadow-sm transition-all hover:shadow-md bg-amber-50/30 dark:bg-amber-950/10 py-6">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardDescription className="font-medium italic text-amber-900 dark:text-amber-200">Avg. Margin</CardDescription>
                            <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                                <BarChart3 className="w-4 h-4 text-amber-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-amber-700 dark:text-amber-500">
                            {isLoading ? <Skeleton className="h-8 w-24" /> : `${averageMargin.toFixed(1)}%`}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Detailed Table */}
            <Card className="shadow-sm border-none overflow-hidden pb-6">
                <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50 py-4 gap-0">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-lg">Product Profitability Breakdown</CardTitle>
                            <CardDescription>Performance of individual SKUs based on sales and COGS.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/80 dark:bg-slate-900">
                                <TableRow>
                                    <TableHead className="w-[300px] px-6 py-4">Item Details</TableHead>
                                    <TableHead className="text-center px-4 py-4">Qty Sold</TableHead>
                                    <TableHead className="text-right px-4 py-4">Revenue</TableHead>
                                    <TableHead className="text-right italic px-4 py-4">COGS</TableHead>
                                    <TableHead className="text-right font-bold text-indigo-600 px-4 py-4">Net Profit</TableHead>
                                    <TableHead className="text-right px-6 py-4">Margin</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell colSpan={6}><Skeleton className="h-12 w-full" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                            No products found matching your search.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((item) => (
                                        <TableRow key={item.product_id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/30 transition-colors">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.product_name}</span>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                                                        <Badge variant="outline" className="text-[10px] py-0 h-4 bg-white dark:bg-slate-950">{item.sku}</Badge>
                                                        {/* Optional category if API provides it, or remove */}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-medium px-4 py-4">{item.quantity_sold}</TableCell>
                                            <TableCell className="text-right text-slate-600 dark:text-slate-400 px-4 py-4">
                                                {Number(item.revenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell className="text-right text-slate-500 italic px-4 py-4">
                                                {Number(item.cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-emerald-600 px-4 py-4">
                                                RM {Number(item.profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell className="text-right px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full transition-all duration-1000",
                                                                item.margin > 40 ? "bg-emerald-500" : item.margin > 25 ? "bg-amber-500" : "bg-rose-500"
                                                            )}
                                                            style={{ width: `${Math.min(item.margin, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-semibold w-8">{item.margin.toFixed(0)}%</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}