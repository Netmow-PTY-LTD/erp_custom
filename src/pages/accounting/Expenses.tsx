"use client";

import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { useGetExpensesQuery } from "@/store/features/accounting/accoutntingApiService";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

export type Expense = {
    id: number;
    date: string;
    description: string;
    category: string;
    amount: number;
    paidVia: string;
    reference: string;
    status: string;
};

export default function ExpensesPage() {
    const [pageIndex, setPageIndex] = useState(0);

    const { data, isLoading, isError } = useGetExpensesQuery();
    const fetchedExpenses = data?.data || [];

    // Map API response to Expense type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expenses: Expense[] = fetchedExpenses.map((item: any) => ({
        id: item.id,
        date: item.expense_date || item.created_at,
        description: item.description || item.title || "N/A",
        category: item.category || "N/A",
        amount: Number(item.amount),
        paidVia: item.payment_method || "N/A",
        reference: item.reference_number || "N/A",
        status: "Paid", // Default, update if your API provides status
    }));

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
                    status === "Paid"
                        ? "success"
                        : status === "Pending"
                        ? "secondary"
                        : "destructive";

                return <Badge variant={variant}>{status}</Badge>;
            },
        },
    ];

    if (isLoading) return <p>Loading expenses...</p>;
    if (isError) return <p>Error loading expenses</p>;

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
