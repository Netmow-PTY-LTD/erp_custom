"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Dummy Data
const trialBalanceData = [
    { code: "1001", name: "Cash in Hand", debit: 5300.00, credit: 0 },
    { code: "1002", name: "Bank Accounts", debit: 12500.00, credit: 0 },
    { code: "2001", name: "Accounts Payable", debit: 0, credit: 2500.00 },
    { code: "3001", name: "Capital", debit: 0, credit: 15300.00 },
];

export default function TrialBalance() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const totalDebit = trialBalanceData.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = trialBalanceData.reduce((sum, item) => sum + item.credit, 0);
    const isBalanced = totalDebit === totalCredit;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Trial Balance</h2>
                    <p className="text-muted-foreground">Summary of all ledger account balances.</p>
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

            <Card className="py-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Account Balances</CardTitle>
                    {isBalanced ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> BALANCED
                        </Badge>
                    ) : (
                        <Badge variant="destructive">
                            <AlertCircle className="w-3 h-3 mr-1" /> UNBALANCED
                        </Badge>
                    )}
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Code</TableHead>
                                <TableHead>Account Name</TableHead>
                                <TableHead className="text-right">Debit Balance</TableHead>
                                <TableHead className="text-right">Credit Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trialBalanceData.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-mono text-xs">{row.code}</TableCell>
                                    <TableCell className="font-medium">{row.name}</TableCell>
                                    <TableCell className="text-right">{row.debit > 0 ? row.debit.toFixed(2) : "-"}</TableCell>
                                    <TableCell className="text-right">{row.credit > 0 ? row.credit.toFixed(2) : "-"}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="bg-muted/50 font-bold text-base">
                                <TableCell colSpan={2} className="text-right">Totals</TableCell>
                                <TableCell className="text-right text-emerald-600 border-t-2 border-emerald-600">{totalDebit.toFixed(2)}</TableCell>
                                <TableCell className="text-right text-emerald-600 border-t-2 border-emerald-600">{totalCredit.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
