import { DataTable } from "@/components/dashboard/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

type Payment = {
    id: string;
    invoiceRef: string;
    supplier: string;
    date: string;
    amount: number;
    method: "Bank Transfer" | "Cash" | "Cheque";
};

const dummyPayments: Payment[] = [
    { id: "PAY-001", invoiceRef: "INV-2024-002", supplier: "Thread Masters", date: "2024-03-21", amount: 12000, method: "Bank Transfer" },
];

export default function SupplierPaymentList() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const filteredData = dummyPayments.filter(p => p.supplier.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()));

    const columns: ColumnDef<Payment>[] = [
        { accessorKey: "id", header: "Payment ID" },
        { accessorKey: "invoiceRef", header: "Invoice Ref" },
        { accessorKey: "supplier", header: "Supplier" },
        { accessorKey: "date", header: "Payment Date" },
        {
            accessorKey: "amount",
            header: "Amount Paid",
            cell: ({ row }) => <span className="font-bold text-green-600">${row.original.amount.toLocaleString()}</span>
        },
        { accessorKey: "method", header: "Method" },
    ];

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold">Supplier Payments</h2>
                <Link to="/dashboard/raw-materials/payments/create">
                    <Button className="bg-blue-600 hover:bg-blue-500">
                        <PlusCircle className="mr-2 h-4 w-4" /> Make Payment
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
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
