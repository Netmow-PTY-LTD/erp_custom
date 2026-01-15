"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, Plus, Trash2 } from "lucide-react";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Dummy Data mimicking a Journal Entry response
const journalEntries = [
    {
        id: "TXN-001",
        date: "2024-03-10",
        narration: "Cash Sales of Product A",
        details: [
            { account: "Cash", debit: 1500.00, credit: 0 },
            { account: "Sales", debit: 0, credit: 1500.00 },
        ]
    },
    {
        id: "TXN-002",
        date: "2024-03-09",
        narration: "Office Rent Payment",
        details: [
            { account: "Rent Expense", debit: 2000.00, credit: 0 },
            { account: "Bank", debit: 0, credit: 2000.00 },
        ]
    }
];

export default function JournalReport() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);

    // New Entry Form State
    const [entryDate, setEntryDate] = useState<Date | undefined>(new Date());
    const [narration, setNarration] = useState("");
    const [rows, setRows] = useState([
        { account: "", debit: 0, credit: 0 },
        { account: "", debit: 0, credit: 0 },
    ]);

    const handleAddRow = () => {
        setRows([...rows, { account: "", debit: 0, credit: 0 }]);
    };

    const handleRemoveRow = (index: number) => {
        if (rows.length > 2) {
            const newRows = [...rows];
            newRows.splice(index, 1);
            setRows(newRows);
        }
    };

    const handleRowChange = (index: number, field: string, value: any) => {
        const newRows = [...rows];
        // @ts-ignore
        newRows[index][field] = value;
        setRows(newRows);
    };

    const totalDebit = rows.reduce((sum, row) => sum + Number(row.debit), 0);
    const totalCredit = rows.reduce((sum, row) => sum + Number(row.credit), 0);
    const isBalanced = totalDebit === totalCredit && totalDebit > 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Journal Report</h2>
                    <p className="text-muted-foreground">Chronological record of all financial transactions.</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Add New Entry Button */}
                    <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                <Plus className="mr-2 h-4 w-4" /> New Journal Entry
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px]">
                            <DialogHeader>
                                <DialogTitle>Create New Journal Entry</DialogTitle>
                                <DialogDescription>
                                    Record a manual journal entry. Ensure Total Debit equals Total Credit.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !entryDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {entryDate ? format(entryDate, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={entryDate}
                                                    onSelect={setEntryDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Narration / Reference</Label>
                                        <Input
                                            placeholder="e.g. Adjustment for depreciation"
                                            value={narration}
                                            onChange={(e) => setNarration(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="border rounded-md p-4 bg-muted/20 space-y-4">
                                    <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground mb-2">
                                        <div className="col-span-5">Account</div>
                                        <div className="col-span-3 text-right">Debit</div>
                                        <div className="col-span-3 text-right">Credit</div>
                                        <div className="col-span-1"></div>
                                    </div>

                                    {rows.map((row, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                            <div className="col-span-5">
                                                <Select
                                                    value={row.account}
                                                    onValueChange={(val) => handleRowChange(index, "account", val)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Account" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Cash">Cash</SelectItem>
                                                        <SelectItem value="Bank">Bank</SelectItem>
                                                        <SelectItem value="Sales">Sales</SelectItem>
                                                        <SelectItem value="Rent Expense">Rent Expense</SelectItem>
                                                        <SelectItem value="Utility Bill">Utility Bill</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="col-span-3">
                                                <Input
                                                    type="number"
                                                    className="text-right"
                                                    placeholder="0.00"
                                                    value={row.debit === 0 ? '' : row.debit}
                                                    onChange={(e) => handleRowChange(index, "debit", Number(e.target.value))}
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <Input
                                                    type="number"
                                                    className="text-right"
                                                    placeholder="0.00"
                                                    value={row.credit === 0 ? '' : row.credit}
                                                    onChange={(e) => handleRowChange(index, "credit", Number(e.target.value))}
                                                />
                                            </div>
                                            <div className="col-span-1 flex justify-center">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => handleRemoveRow(index)}
                                                    disabled={rows.length <= 2}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    <Button variant="outline" size="sm" onClick={handleAddRow} className="mt-2">
                                        <Plus className="mr-2 h-3.5 w-3.5" /> Add Row
                                    </Button>
                                </div>

                                <div className="flex justify-end gap-6 px-4 font-semibold text-sm">
                                    <div className="flex gap-2">
                                        <span className="text-muted-foreground">Total Debit:</span>
                                        <span>{totalDebit.toFixed(2)}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-muted-foreground">Total Credit:</span>
                                        <span>{totalCredit.toFixed(2)}</span>
                                    </div>
                                    <div className={cn("flex gap-2", isBalanced ? "text-emerald-600" : "text-destructive")}>
                                        <span>Difference:</span>
                                        <span>{(totalDebit - totalCredit).toFixed(2)}</span>
                                    </div>
                                </div>

                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsNewEntryOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={!isBalanced}>
                                    Save Entry
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Date Filter */}
                    <div className="flex items-center gap-2">
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
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {journalEntries.map((entry) => (
                    <Card key={entry.id}>
                        <CardHeader className="py-4 bg-muted/30">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm text-muted-foreground">{entry.date}</span>
                                    <span className="font-bold">{entry.narration}</span>
                                </div>
                                <Badge variant="outline">{entry.id}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50%]">Account Name</TableHead>
                                        <TableHead className="text-right">Debit</TableHead>
                                        <TableHead className="text-right">Credit</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {entry.details.map((row, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="font-medium">{row.account}</TableCell>
                                            <TableCell className="text-right">{row.debit > 0 ? row.debit.toFixed(2) : "-"}</TableCell>
                                            <TableCell className="text-right">{row.credit > 0 ? row.credit.toFixed(2) : "-"}</TableCell>
                                        </TableRow>
                                    ))}
                                    {/* Footer for Check */}
                                    <TableRow className="bg-muted/50 font-semibold">
                                        <TableCell>Total</TableCell>
                                        <TableCell className="text-right">
                                            {entry.details.reduce((sum, item) => sum + item.debit, 0).toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {entry.details.reduce((sum, item) => sum + item.credit, 0).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
