"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetProfitLossQuery } from "@/store/features/accounting/accoutntingApiService";

export default function ProfitAndLoss() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const formattedDate = date ? format(date, "yyyy-MM-dd") : undefined;

    // Fetch data using the query hook
    // We pass the date as a parameter; handling logic: if no date selected, maybe fetch all time or current month? 
    // Assuming backend handles date filtering or lack thereof.
    const { data: reportData, isLoading } = useGetProfitLossQuery(
        { from: formattedDate }, // Adjust parameters based on backend expectation, usually start/end date or a single 'as of' date
        { skip: !formattedDate }
    );

    const incomeData = reportData?.data?.incomes || [];
    const expenseData = reportData?.data?.expenses || [];
    const totalIncome = reportData?.data?.total_income || 0;
    const totalExpense = reportData?.data?.total_expense || 0;
    const netProfit = reportData?.data?.net_profit || 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Profit & Loss</h2>
                    <p className="text-muted-foreground">Income Statement (Revenue vs Expense).</p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">As of:</span>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* INCOME COLUMN */}
                <Card className="border-emerald-200 bg-emerald-50/10 py-6">
                    <CardHeader>
                        <CardTitle className="text-emerald-700">Income</CardTitle>
                        <CardDescription>Revenue generated during the period</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            <div className="space-y-2">
                                <div className="h-4 w-3/4 bg-emerald-100 animate-pulse rounded" />
                                <div className="h-4 w-1/2 bg-emerald-100 animate-pulse rounded" />
                            </div>
                        ) : incomeData.length > 0 ? (
                            incomeData.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <span>{item.account}</span>
                                    <span className="font-medium">{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-muted-foreground italic">No income recorded.</div>
                        )}
                        <Separator className="bg-emerald-200" />
                        <div className="flex justify-between items-center text-lg font-bold text-emerald-800">
                            <span>Total Income</span>
                            <span>{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* EXPENSE COLUMN */}
                <Card className="border-red-200 bg-red-50/10 py-6">
                    <CardHeader>
                        <CardTitle className="text-red-700">Expenses</CardTitle>
                        <CardDescription>Costs incurred during the period</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            <div className="space-y-2">
                                <div className="h-4 w-3/4 bg-red-100 animate-pulse rounded" />
                                <div className="h-4 w-1/2 bg-red-100 animate-pulse rounded" />
                            </div>
                        ) : expenseData.length > 0 ? (
                            expenseData.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <span>{item.account}</span>
                                    <span className="font-medium">{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-muted-foreground italic">No expenses recorded.</div>
                        )}
                        <Separator className="bg-red-200" />
                        <div className="flex justify-between items-center text-lg font-bold text-red-800">
                            <span>Total Expense</span>
                            <span>{totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* NET PROFIT SUMMARY */}
            <Card className={cn("border-2", netProfit >= 0 ? "border-emerald-500 bg-emerald-50" : "border-red-500 bg-red-50")}>
                <CardContent className="p-8 text-center space-y-2">
                    <h3 className="text-lg font-medium text-muted-foreground uppercase tracking-widest">Net Profit / (Loss)</h3>
                    <div className={cn("text-5xl font-extrabold", netProfit >= 0 ? "text-emerald-600" : "text-red-600")}>
                        {isLoading ? "..." : netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-sm text-muted-foreground pt-2">
                        Total Income ({totalIncome.toLocaleString()}) - Total Expense ({totalExpense.toLocaleString()})
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
