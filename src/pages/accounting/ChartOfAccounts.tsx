"use client";

import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddDebitHeadForm from "./AddDebitHead";
import CreateIncomeHeadForm from "./CreateIncomehead";

// Dummy Data
const initialAccounts = [
    { id: 1, code: "1000", name: "Assets", type: "Asset", parent: null, level: 0 },
    { id: 2, code: "1001", name: "Current Assets", type: "Asset", parent: 1, level: 1 },
    { id: 3, code: "1002", name: "Cash in Hand", type: "Asset", parent: 2, level: 2 },
    { id: 4, code: "1003", name: "Bank Accounts", type: "Asset", parent: 2, level: 2 },
    { id: 5, code: "2000", name: "Liabilities", type: "Liability", parent: null, level: 0 },
    { id: 6, code: "2001", name: "Accounts Payable", type: "Liability", parent: 5, level: 1 },
    { id: 7, code: "3000", name: "Equity", type: "Equity", parent: null, level: 0 },
    { id: 8, code: "4000", name: "Income", type: "Income", parent: null, level: 0 },
    { id: 9, code: "5000", name: "Expenses", type: "Expense", parent: null, level: 0 },
    { id: 10, code: "5001", name: "Office Rent", type: "Expense", parent: 9, level: 1 },
];

export default function ChartOfAccounts() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Chart of Accounts</h2>
                    <p className="text-muted-foreground">Manage your financial head hierarchy.</p>
                </div>
                <div className="flex gap-2">
                    <CreateIncomeHeadForm />
                    <AddDebitHeadForm />
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-violet-500/40 active:translate-y-0 active:shadow-none">
                                <Plus className="mr-2 h-4 w-4" /> Add Account
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Account</DialogTitle>
                                <DialogDescription>
                                    Create a new account head.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Account Name</Label>
                                    <Input id="name" placeholder="e.g. Petrol Expense" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="code">Code</Label>
                                        <Input id="code" placeholder="e.g. 5201" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Type</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Asset">Asset</SelectItem>
                                                <SelectItem value="Liability">Liability</SelectItem>
                                                <SelectItem value="Equity">Equity</SelectItem>
                                                <SelectItem value="Income">Income</SelectItem>
                                                <SelectItem value="Expense">Expense</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Parent Account (Optional)</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select parent account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Assets</SelectItem>
                                            <SelectItem value="9">Expenses</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                                <Button type="submit">Create Account</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="py-6">
                <CardHeader>
                    <CardTitle>Accounts List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Account Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialAccounts.map((account) => (
                                <TableRow key={account.id} className="hover:bg-muted/50">
                                    <TableCell className="font-mono text-xs text-muted-foreground">{account.code}</TableCell>
                                    <TableCell>
                                        <div style={{ paddingLeft: `${account.level * 20}px` }} className="flex items-center">
                                            {account.level > 0 && <span className="text-muted-foreground mr-2">└─</span>}
                                            <span className={account.level === 0 ? "font-semibold" : ""}>{account.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{account.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
