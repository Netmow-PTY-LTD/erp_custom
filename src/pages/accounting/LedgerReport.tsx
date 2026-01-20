"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";
import {
    useGetAccountingAccountsQuery,
    useGetLedgerReportQuery
} from "@/store/features/accounting/accoutntingApiService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown, CornerDownRight } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// Dummy Data removed

export default function LedgerReport() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [openAccount, setOpenAccount] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState<string>("");

    // State for API params
    const [queryParams, setQueryParams] = useState<{ id: string; from?: string; to?: string } | null>(null);

    const { data: accountsData } = useGetAccountingAccountsQuery({ limit: 1000 });
    const accounts = accountsData?.data || [];

    // Ledger Query
    const { data: reportResponse, isLoading: isReportLoading } = useGetLedgerReportQuery(
        queryParams!,
        { skip: !queryParams }
    );

    const reportData = reportResponse?.data;
    const transactions = reportData?.transactions || [];

    const selectedAccount = accounts.find(acc => String(acc.id) === selectedAccountId);

    const handleGenerateReport = () => {
        if (!selectedAccountId) {
            toast.error("Please select an account first");
            return;
        }
        setQueryParams({
            id: selectedAccountId,
            from: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
            to: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
        });
    };

    // Calculate totals
    const totalDebit = transactions.reduce((sum, tx) => sum + Number(tx.debit || 0), 0);
    const totalCredit = transactions.reduce((sum, tx) => sum + Number(tx.credit || 0), 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Ledger Report</h2>
                    <p className="text-muted-foreground">View detailed transaction history for a specific account.</p>
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-medium inline-block">Select Account</label>
                            <Popover open={openAccount} onOpenChange={setOpenAccount}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openAccount}
                                        className="w-full justify-between font-normal"
                                    >
                                        {selectedAccount ? selectedAccount.name : "Select account..."}
                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search account..." className="h-9" />
                                        <CommandList className="max-h-[300px] overflow-y-auto">
                                            <CommandEmpty>No account found.</CommandEmpty>
                                            <CommandGroup>
                                                {accounts.map((acc) => {
                                                    const level = acc.level || 0;
                                                    return (
                                                        <CommandItem
                                                            key={acc.id}
                                                            value={`${acc.name}-${acc.id}`}
                                                            onSelect={() => {
                                                                setSelectedAccountId(String(acc.id));
                                                                setOpenAccount(false);
                                                            }}
                                                            className="flex items-center gap-2"
                                                            style={{ paddingLeft: `${level === 0 ? 12 : (level * 20) + 12}px` }}
                                                        >
                                                            <div className="flex items-center flex-1 gap-1">
                                                                {level > 0 && (
                                                                    <CornerDownRight className="h-3 w-3 text-muted-foreground stroke-[1.5]" />
                                                                )}
                                                                <div className="flex flex-col">
                                                                    <span className={cn(
                                                                        level === 0 ? "font-semibold text-foreground" : "text-muted-foreground"
                                                                    )}>
                                                                        {acc.name}
                                                                    </span>
                                                                    <span className="text-[10px] text-muted-foreground/70">{acc.code}</span>
                                                                </div>
                                                            </div>
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    selectedAccountId === String(acc.id) ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    );
                                                })}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium inline-block">Date Range</label>
                            <DateRangePicker
                                dateRange={dateRange}
                                onDateRangeChange={setDateRange}
                                placeholder="Pick a date range"
                                className="w-full"
                                numberOfMonths={2}
                            />
                        </div>
                        <Button
                            variant="success"
                            onClick={handleGenerateReport}
                            disabled={isReportLoading}
                        >
                            {isReportLoading ? "Generating..." : "Generate Report"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="py-6">
                    <CardHeader className="pb-2">
                        <CardDescription>Opening Balance</CardDescription>
                        <CardTitle className="text-2xl">
                            {isReportLoading ? <Skeleton className="h-8 w-24" /> : Number(reportData?.opening_balance || 0).toFixed(2)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="py-6">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Debit</CardDescription>
                        <CardTitle className="text-2xl text-emerald-600">
                            {isReportLoading ? <Skeleton className="h-8 w-24" /> : totalDebit.toFixed(2)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="py-6">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Credit</CardDescription>
                        <CardTitle className="text-2xl text-red-600">
                            {isReportLoading ? <Skeleton className="h-8 w-24" /> : totalCredit.toFixed(2)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="py-6 bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardDescription>Closing Balance</CardDescription>
                        <CardTitle className="text-2xl text-primary">
                            {isReportLoading ? <Skeleton className="h-8 w-24" /> : Number(reportData?.closing_balance || 0).toFixed(2)}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card className="py-6">
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Particulars</TableHead>
                                <TableHead className="text-right text-emerald-600">Debit</TableHead>
                                <TableHead className="text-right text-red-600">Credit</TableHead>
                                <TableHead className="text-right font-bold">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isReportLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic">
                                        {queryParams ? "No transactions found for the selected criteria." : "Select an account and click generate."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.narration}</TableCell>
                                        <TableCell className="text-right">
                                            {Number(row.debit) > 0 ? Number(row.debit).toFixed(2) : "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {Number(row.credit) > 0 ? Number(row.credit).toFixed(2) : "-"}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {Number(row.balance).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
