"use client";

import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

export type Income = {
    id: string;
    date: string;
    description: string;
    category: string;
    amount: number;
    receivedVia: string;
    reference: string;
    status: string;
};

const incomes: Income[] = [
    {
        id: "INC001",
        date: "2025-11-22",
        description: "Product Sales Payment",
        category: "Sales",
        amount: 1500,
        receivedVia: "Bank Transfer",
        reference: "INV-2025-1122",
        status: "Received",
    },
    {
        id: "INC002",
        date: "2025-11-23",
        description: "Service Fee",
        category: "Service",
        amount: 300,
        receivedVia: "Cash",
        reference: "SRV-1123",
        status: "Pending",
    },
];

export default function IncomePage() {
    const [pageIndex, setPageIndex] = useState(0);

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
            <h2 className="text-2xl font-semibold mb-4">All Income</h2>
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
