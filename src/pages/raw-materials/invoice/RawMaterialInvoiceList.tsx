import { DataTable } from "@/components/dashboard/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

type Invoice = {
    id: string;
    poNumber: string;
    supplier: string;
    date: string;
    amount: number;
    status: "Paid" | "Unpaid" | "Partial";
};

const dummyInvoices: Invoice[] = [
    { id: "INV-2024-001", poNumber: "PO-RM-1001", supplier: "Textile Corp", date: "2024-03-25", amount: 50000, status: "Unpaid" },
    { id: "INV-2024-002", poNumber: "PO-RM-998", supplier: "Thread Masters", date: "2024-03-20", amount: 12000, status: "Paid" },
];

export default function RMInvoiceList() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const filteredData = dummyInvoices.filter(i => i.id.toLowerCase().includes(search.toLowerCase()) || i.supplier.toLowerCase().includes(search.toLowerCase()));

    const columns: ColumnDef<Invoice>[] = [
        { accessorKey: "id", header: "Invoice #" },
        { accessorKey: "poNumber", header: "PO Reference" },
        { accessorKey: "supplier", header: "Supplier" },
        { accessorKey: "date", header: "Date" },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => <span className="font-medium">${row.original.amount.toLocaleString()}</span>
        },
        {
            accessorKey: "status",
            header: "Payment Status",
            cell: ({ row }) => {
                const colors = {
                    Paid: "bg-green-500",
                    Unpaid: "bg-red-500",
                    Partial: "bg-yellow-500"
                };
                return <Badge className={colors[row.original.status]}>{row.original.status}</Badge>;
            }
        },
    ];

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold">Invoices & GRN</h2>
                <Link to="/dashboard/raw-materials/invoices/create">
                    <Button className="bg-blue-600 hover:bg-blue-500">
                        <PlusCircle className="mr-2 h-4 w-4" /> Record Invoice
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Invoice History</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        totalCount={filteredData.length}
                        pageIndex={page - 1}
                        pageSize={10}
                        onPageChange={p => setPage(p + 1)}
                        onSearch={setSearch}
                        isFetching={false}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
