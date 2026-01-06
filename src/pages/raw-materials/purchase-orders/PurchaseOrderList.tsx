import { DataTable } from "@/components/dashboard/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

type PurchaseOrder = {
    id: string;
    supplier: string;
    date: string;
    items: number;
    totalAmount: number;
    status: "Pending" | "Received" | "Ordered";
};

const dummyPOs: PurchaseOrder[] = [
    { id: "PO-RM-1001", supplier: "Textile Corp", date: "2024-03-20", items: 2, totalAmount: 50000, status: "Ordered" },
    { id: "PO-RM-1002", supplier: "Thread Masters", date: "2024-03-22", items: 5, totalAmount: 1500, status: "Pending" },
];

export default function RMPurchaseOrderList() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const filteredData = dummyPOs.filter(p => p.id.toLowerCase().includes(search.toLowerCase()) || p.supplier.toLowerCase().includes(search.toLowerCase()));

    const columns: ColumnDef<PurchaseOrder>[] = [
        { accessorKey: "id", header: "PO Number" },
        { accessorKey: "supplier", header: "Supplier" },
        { accessorKey: "date", header: "Order Date" },
        { accessorKey: "items", header: "Items Count" },
        {
            accessorKey: "totalAmount",
            header: "Total Amount",
            cell: ({ row }) => <span>${row.original.totalAmount.toLocaleString()}</span>
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const colors = {
                    Pending: "bg-orange-500",
                    Received: "bg-green-500",
                    Ordered: "bg-blue-500"
                };
                return <Badge className={colors[row.original.status]}>{row.original.status}</Badge>;
            }
        },
    ];

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold">Purchase Orders (Raw Materials)</h2>
                <Link to="/dashboard/raw-materials/purchase-orders/create">
                    <Button className="bg-blue-600 hover:bg-blue-500">
                        <PlusCircle className="mr-2 h-4 w-4" /> Create PO
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>PO List</CardTitle>
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
