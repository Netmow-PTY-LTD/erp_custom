"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Search, Calendar as CalendarIcon, Filter, X } from "lucide-react";
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

import { useAddTransactionMutation, useGetTransactionsQuery } from "@/store/features/accounting/accoutntingApiService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { CreateTransactionInput } from "@/types/accounting.types";

// Dummy Data removed



export default function Transactions() {
    const [isOpen, setIsOpen] = useState(false);
    const [filterDate, setFilterDate] = useState<Date | undefined>();

    const { data: transactionsData, isLoading } = useGetTransactionsQuery({
        page: 1,
        limit: 10,
        date: filterDate ? format(filterDate, 'yyyy-MM-dd') : undefined
    });
    const transactions = transactionsData?.data || [];
    const [addTransaction, { isLoading: isAdding }] = useAddTransactionMutation();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateTransactionInput>({
        defaultValues: {
            type: undefined,
            amount: undefined,
            payment_mode: undefined,
            date: format(new Date(), "yyyy-MM-dd"),
            description: "",
        },
    });

    const onSubmit = async (data: CreateTransactionInput) => {
        console.log(data);
        try {
            await addTransaction(data).unwrap();
            toast.success("Transaction created successfully");
            setIsOpen(false);
            reset({
                type: undefined,
                amount: undefined,
                payment_mode: undefined,
                date: format(new Date(), "yyyy-MM-dd"),
                description: "",
            });
            // Reset main date picker if needed, but it's now controlled by form
        } catch (error) {
            toast.error("Failed to create transaction");
            console.error(error);
        }
    };


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
                        {/* <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Plus className="mr-2 h-4 w-4" /> New Transaction
                        </Button> */}
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create New Transaction</DialogTitle>
                            <DialogDescription>
                                Enter the details of the transaction below.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Transaction Type <span className="text-red-500">*</span></Label>
                                        <Controller
                                            name="type"
                                            control={control}
                                            rules={{ required: "Type is required" }}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className={cn(errors.type && "border-red-500")}>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="SALES">Sales</SelectItem>
                                                        <SelectItem value="PURCHASE">Purchase</SelectItem>
                                                        <SelectItem value="EXPENSE">Expense</SelectItem>
                                                        <SelectItem value="INCOME">Income</SelectItem>
                                                        <SelectItem value="JOURNAL">Journal</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
                                        <p className="text-[0.8rem] text-muted-foreground">
                                            Sales: Dr Cash / Cr Sales
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date <span className="text-red-500">*</span></Label>
                                        <Controller
                                            name="date"
                                            control={control}
                                            rules={{ required: "Date is required" }}
                                            render={({ field }) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground",
                                                                errors.date && "border-red-500"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <CalendarComponent
                                                            mode="single"
                                                            selected={field.value ? new Date(field.value) : undefined}
                                                            onSelect={(d) => field.onChange(d ? format(d, "yyyy-MM-dd") : "")}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                        {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Amount <span className="text-red-500">*</span></Label>
                                        <Controller
                                            name="amount"
                                            control={control}
                                            rules={{ required: "Amount is required", min: { value: 0.01, message: "Amount must be greater than 0" } }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="0.00"
                                                    className={cn(errors.amount && "border-red-500")}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                />
                                            )}
                                        />
                                        {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Payment Mode <span className="text-red-500">*</span></Label>
                                        <Controller
                                            name="payment_mode"
                                            control={control}
                                            rules={{ required: "Mode is required" }}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className={cn(errors.payment_mode && "border-red-500")}>
                                                        <SelectValue placeholder="Select mode" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="CASH">Cash</SelectItem>
                                                        <SelectItem value="BANK">Bank</SelectItem>
                                                        <SelectItem value="DUE">Due</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.payment_mode && <p className="text-red-500 text-xs">{errors.payment_mode.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description <span className="text-red-500">*</span></Label>
                                    <Controller
                                        name="description"
                                        control={control}
                                        rules={{ required: "Description is required" }}
                                        render={({ field }) => (
                                            <Textarea
                                                {...field}
                                                placeholder="Enter transaction details..."
                                                className={cn(errors.description && "border-red-500")}
                                            />
                                        )}
                                    />
                                    {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsOpen(false)} type="button">Cancel</Button>
                                <Button type="submit" disabled={isAdding}>
                                    {isAdding ? "Saving..." : "Save Transaction"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters & Search */}
            <div className="flex gap-2 items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search transactions..." className="pl-8" />
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "justify-start text-left font-normal",
                                !filterDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filterDate ? format(filterDate, "PPP") : <span>Filter by Date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <CalendarComponent
                            mode="single"
                            selected={filterDate}
                            onSelect={setFilterDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {filterDate && (
                    <Button variant="ghost" size="icon" onClick={() => setFilterDate(undefined)}>
                        <X className="h-4 w-4" />
                    </Button>
                )}

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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Skeleton className="h-8 w-full" />
                                        <Skeleton className="h-8 w-full" />
                                        <Skeleton className="h-8 w-full" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No transactions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((tx) => (
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
                                        {Number(tx.amount).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
