"use client";

import { useState } from "react";
import { Plus, Search, Calendar, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Dummy Data
const initialTransactions = [
    { id: 1, date: "2024-03-10", type: "Sales", amount: 1500.00, mode: "Cash", description: "Product Sales" },
    { id: 2, date: "2024-03-09", type: "Expense", amount: 200.00, mode: "Bank", description: "Office Supplies" },
    { id: 3, date: "2024-03-08", type: "Purchase", amount: 3500.00, mode: "Due", description: "Raw Materials" },
    { id: 4, date: "2024-03-08", type: "Income", amount: 500.00, mode: "Bank", description: "Consulting Fee" },
    { id: 5, date: "2024-03-07", type: "Journal", amount: 0.00, mode: "-", description: "Adjustment Entry" },
];

export default function Transactions() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
                    <p className="text-muted-foreground">Manage your daily financial transactions.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Plus className="mr-2 h-4 w-4" /> New Transaction
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create New Transaction</DialogTitle>
                            <DialogDescription>
                                Enter the details of the transaction below.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Transaction Type</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Sales">Sales</SelectItem>
                                            <SelectItem value="Purchase">Purchase</SelectItem>
                                            <SelectItem value="Expense">Expense</SelectItem>
                                            <SelectItem value="Income">Income</SelectItem>
                                            <SelectItem value="Journal">Journal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        Sales: Dr Cash / Cr Sales
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <CalendarComponent
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Amount</Label>
                                    <Input type="number" placeholder="0.00" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Payment Mode</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select mode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="Bank">Bank</SelectItem>
                                            <SelectItem value="Due">Due</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea placeholder="Enter transaction details..." />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Transaction</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters & Search */}
            <div className="flex gap-2 items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search transactions..." className="pl-8" />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            {/* Data Table */}
            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Mode</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialTransactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell>{tx.date}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            tx.type === "Sales" ? "default" :
                                                tx.type === "Purchase" ? "secondary" :
                                                    tx.type === "Expense" ? "destructive" : "outline"
                                        }
                                        className={
                                            tx.type === "Sales" ? "bg-emerald-600 hover:bg-emerald-700" :
                                                tx.type === "Income" ? "bg-blue-600 hover:bg-blue-700 text-white border-0" : ""
                                        }
                                    >
                                        {tx.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>{tx.description}</TableCell>
                                <TableCell>{tx.mode}</TableCell>
                                <TableCell className="text-right font-medium">
                                    {tx.amount.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
