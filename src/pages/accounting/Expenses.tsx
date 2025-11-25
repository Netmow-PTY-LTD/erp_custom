"use client";

import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

export type Expense = {
    id: string;
    date: string;
    description: string;
    category: string;
    amount: number;
    paidVia: string;
    reference: string;
    status: string;
};

const expenses: Expense[] = [
    {
        id: "EXP001",
        date: "2025-11-20",
        description: "Office Electricity Bill",
        category: "Utilities",
        amount: 250,
        paidVia: "Bank Transfer",
        reference: "BILL-2025-1120",
        status: "Paid",
    },
    {
        id: "EXP002",
        date: "2025-11-21",
        description: "Office Rent",
        category: "Rent",
        amount: 1200,
        paidVia: "Cash",
        reference: "RENT-1121",
        status: "Unpaid",
    },
];

export default function Expenses() {
    const [pageIndex, setPageIndex] = useState(0);

    const expenseColumns: ColumnDef<Expense>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "date", header: "Date" },
        { accessorKey: "description", header: "Description" },
        { accessorKey: "category", header: "Category" },
        { accessorKey: "amount", header: "Amount (RM)" },
        { accessorKey: "paidVia", header: "Paid Via" },
        { accessorKey: "reference", header: "Reference" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                const variant =
                    status === "Active"
                        ? "success"
                        : status === "Pending"
                            ? "secondary"
                            : "destructive";


                return <Badge variant={variant}>{status}</Badge>;
            },
        },
    ];

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">All Expenses</h2>
            <DataTable
                columns={expenseColumns}
                data={expenses}
                pageIndex={pageIndex}
                pageSize={10}
                onPageChange={setPageIndex}
            />
        </div>
    );
}
