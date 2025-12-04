
"use client";

import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetIncomesQuery } from "@/store/features/accounting/accoutntingApiService";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

// Map API response to this type
export type Income = {
    id: number;
    date: string;
    description: string;
    category: string;
    amount: number;
    receivedVia: string | null;
    reference: string | null;
    status: string;
};

export default function IncomePage() {
    const [pageIndex, setPageIndex] = useState(0);

    const { data, isLoading, isError } = useGetIncomesQuery();
    const fetchedIncomes = data?.data || [];

    // Map API data to Income type for table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const incomes: Income[] = fetchedIncomes.map((item: any) => ({
        id: item.id,
        date: item.income_date || item.created_at,
        description: item.description || "N/A",
        category: item.category || "N/A",
        amount: Number(item.amount),
        receivedVia: item.payment_method || "N/A",
        reference: item.reference_number || "N/A",
        status: "Received", // Default status, or you can add a field in API if exists
    }));

    const incomeColumns: ColumnDef<Income>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "date", header: "Date" },
        { accessorKey: "description", header: "Description" },
        { accessorKey: "category", header: "Category" },
        { accessorKey: "amount", header: "Amount (RM)" },
        { accessorKey: "receivedVia", header: "Received Via" },
        { accessorKey: "reference", header: "Reference" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                const variant =
                    status === "Received"
                        ? "success"
                        : status === "Pending"
                            ? "secondary"
                            : "destructive";

                return <Badge variant={variant}>{status}</Badge>;
            },
        },
    ];

    if (isLoading) return <p>Loading incomes...</p>;
    if (isError) return <p>Error loading incomes</p>;

    return (
        <div>

            <div className="flex justify-between">
                <h2 className="text-2xl font-semibold mb-4">All Income</h2>

                <div className="flex gap-2">
                    <Link to={'/dashboard/accounting/add-income'} >
                        <Button variant="outline-info">
                            <Plus className="h-4 w-4" /> Add Income
                        </Button>
                    </Link>
                </div>
            </div>
            <DataTable
                columns={incomeColumns}
                data={incomes}
                pageIndex={pageIndex}
                pageSize={10}
                onPageChange={setPageIndex}
            />
        </div>
    );
}
