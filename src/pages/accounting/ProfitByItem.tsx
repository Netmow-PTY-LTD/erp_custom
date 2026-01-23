"use client";

import { useState } from "react";
import { Search as SearchIcon, DollarSign, ArrowDownRight, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useGetProductProfitLossQuery } from "@/store/features/accounting/accoutntingApiService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAppSelector } from "@/store/store";

export default function ProfitByItem() {
    const [searchQuery, setSearchQuery] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date()
    });

    const currency = useAppSelector((state) => state.currency.value);

    // API Query Params
    const queryParams: { from?: string; to?: string } = {
        from: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
        to: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
    };

    const { data: reportResponse, isLoading, isError } = useGetProductProfitLossQuery(queryParams);

    if (isError) {
        toast.error("Failed to fetch profit status data.");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profitData: any[] = reportResponse?.data || [];

    const filteredData = profitData.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate totals for stats cards
    const totalSales = filteredData.reduce((acc, curr) => acc + (Number(curr.salesAmount) || 0), 0);
    const totalCost = filteredData.reduce((acc, curr) => acc + (Number(curr.costAmount) || 0), 0);
    const totalProfit = filteredData.reduce((acc, curr) => acc + (Number(curr.profitAmount) || 0), 0);

    return (
        <div className="bg-white min-h-screen text-slate-900">
            <div className="max-w-[1500px] mx-auto space-y-8">

                {/* Row 1: Header - Title (Left) | Filters (Right) */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900">Profit Status by Item</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">F & Z Global Trade (M) Sdn Bhd</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 group focus-within:border-indigo-500 transition-all">
                            <DateRangePicker
                                dateRange={dateRange}
                                onDateRangeChange={setDateRange}
                                className="border-none shadow-none focus-visible:ring-0 h-9 text-xs font-bold text-slate-700 w-[240px] bg-transparent"
                            />
                        </div>
                        <div className="relative group lg:w-72">
                            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Search products..."
                                className="w-full h-11 pl-11 bg-slate-50 border-slate-200 rounded-xl text-sm font-medium focus-visible:ring-1 focus-visible:ring-indigo-100 placeholder:text-slate-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Row 2: Colorful Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sales Card */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-500 p-6 shadow-xl shadow-blue-200 group hover:scale-[1.02] transition-transform duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <DollarSign className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between gap-4 text-white">
                            <div className="p-2.5 bg-white/20 rounded-xl w-fit">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-white/70">Total Sales Analytics</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-1">{currency} {totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Cost Card */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 to-amber-500 p-6 shadow-xl shadow-amber-200 group hover:scale-[1.02] transition-transform duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <ArrowDownRight className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between gap-4 text-white">
                            <div className="p-2.5 bg-white/20 rounded-xl w-fit">
                                <ArrowDownRight className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-white/70">Total Expenditure</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-1">{currency} {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Profit Card */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-6 shadow-xl shadow-emerald-200 group hover:scale-[1.02] transition-transform duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between gap-4 text-white">
                            <div className="p-2.5 bg-white/20 rounded-xl w-fit">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-white/70">Net Profit Engine</p>
                                <h3 className="text-3xl font-black tracking-tighter mt-1">{currency} {totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 3: Table with decreased padding-block */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200">
                                    <th rowSpan={2} className="px-6 py-4 border-r border-slate-100 text-center w-[120px]">SKU</th>
                                    <th rowSpan={2} className="px-6 py-4 border-r border-slate-100 text-left">Product / Specification</th>
                                    <th colSpan={3} className="py-3 border-r border-slate-100 text-center text-blue-700 bg-blue-50/20">Sales</th>
                                    <th colSpan={2} className="py-3 border-r border-slate-100 text-center text-amber-700 bg-amber-50/20">Cost</th>
                                    <th colSpan={2} className="py-3 border-r border-slate-100 text-center text-emerald-700 bg-emerald-50/20">Profit</th>
                                    <th rowSpan={2} className="px-6 py-4 text-center w-[100px]">Margin %</th>
                                </tr>
                                <tr className="bg-slate-50/50 text-[9px] font-bold uppercase text-slate-400 border-b border-slate-100">
                                    <th className="px-3 py-2 border-r border-slate-100 text-center">Qty</th>
                                    <th className="px-4 py-2 border-r border-slate-100 text-center">Price</th>
                                    <th className="px-5 py-2 border-r border-slate-100 text-right">Total</th>
                                    <th className="px-4 py-2 border-r border-slate-100 text-center">Price</th>
                                    <th className="px-5 py-2 border-r border-slate-100 text-right">Total</th>
                                    <th className="px-4 py-2 border-r border-slate-100 text-center">Price</th>
                                    <th className="px-5 py-2 border-r border-slate-100 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="text-[12.5px] font-medium text-slate-600">
                                {isLoading ? (
                                    Array.from({ length: 12 }).map((_, i) => (
                                        <tr key={i} className="border-b border-slate-50">
                                            <td colSpan={10} className="px-6 py-2"><Skeleton className="h-5 w-full rounded" /></td>
                                        </tr>
                                    ))
                                ) : filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-2.5 text-center font-mono text-slate-400 border-r border-slate-50/50 group-hover:text-indigo-600 transition-colors uppercase whitespace-nowrap">{item.sku}</td>
                                            <td className="px-6 py-2.5 text-left font-bold text-slate-800 leading-tight border-r border-slate-50/50 uppercase whitespace-nowrap">{item.name}</td>
                                            <td className="px-3 py-2.5 text-center border-r border-slate-50/50 tabular-nums whitespace-nowrap">{Number(item.qty).toLocaleString()}</td>
                                            <td className="px-4 py-2.5 text-right border-r border-slate-50/50 tabular-nums whitespace-nowrap">{Number(item.salesPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="px-5 py-2.5 text-right border-r border-slate-50/50 tabular-nums font-black text-slate-900 bg-blue-50/10 group-hover:bg-transparent transition-colors uppercase whitespace-nowrap">{Number(item.salesAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-2.5 text-right border-r border-slate-50/50 tabular-nums text-slate-500 uppercase whitespace-nowrap">{Number(item.costPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="px-5 py-2.5 text-right border-r border-slate-50/50 tabular-nums font-semibold text-slate-500 uppercase whitespace-nowrap">{Number(item.costAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-2.5 text-right border-r border-slate-50/50 tabular-nums font-bold text-emerald-600 uppercase whitespace-nowrap">{Number(item.profitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="px-5 py-2.5 text-right border-r border-slate-50/50 tabular-nums font-black text-slate-900 bg-emerald-50/10 group-hover:bg-transparent transition-colors uppercase whitespace-nowrap">{Number(item.profitAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="px-6 py-2.5 text-center whitespace-nowrap">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black border transition-all ${parseFloat(item.profitRatio) > 25 ? 'bg-emerald-500 text-white border-emerald-400' :
                                                    parseFloat(item.profitRatio) > 10 ? 'bg-indigo-500 text-white border-indigo-400' :
                                                        parseFloat(item.profitRatio) > 0 ? 'bg-amber-500 text-white border-amber-400' :
                                                            'bg-rose-500 text-white border-rose-400'
                                                    }`}>
                                                    {item.profitRatio}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={10} className="px-6 py-24 text-center bg-slate-50/20">
                                            <div className="flex flex-col items-center gap-2 opacity-30 grayscale translate-y-4 animate-in fade-in duration-700">
                                                <div className="p-6 bg-white rounded-3xl shadow-xl border border-slate-100 ring-1 ring-slate-200">
                                                    <SearchIcon className="w-12 h-12 text-slate-400" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xl font-bold text-slate-900 uppercase tracking-tighter">Inventory Data Not Found</p>
                                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing with real-time operations...</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Footer Info */}
                    <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
                        <div className="flex flex-col gap-1">
                            <b className="font-bold block">Note:</b>
                            <div>1. This is a profit report generated based on the current inventory data.</div>
                            <div>2. All prices are in the default currency.</div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="bg-indigo-600 px-3 py-1 rounded text-white flex items-center gap-2 shadow-sm font-medium">
                                <span>Total Products:</span>
                                <span className="font-bold">{filteredData.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}