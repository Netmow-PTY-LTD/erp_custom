import { DataTable } from "@/components/dashboard/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router"; // Use router-dom for now to be safe, or just router
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

type Supplier = {
    id: number;
    name: string;
    contact: string;
    email: string;
    address: string;
    status: "Active" | "Inactive";
};

const dummySuppliers: Supplier[] = [
    { id: 1, name: "Textile Corp", contact: "+8801711223344", email: "sales@textilecorp.com", address: "Dhaka, Bangladesh", status: "Active" },
    { id: 2, name: "Thread Masters", contact: "+8801911223344", email: "info@threadmasters.com", address: "Gazipur, Bangladesh", status: "Active" },
    { id: 3, name: "Button World", contact: "+8801811223344", email: "orders@buttonworld.com", address: "Narayanganj, Bangladesh", status: "Active" },
];

export default function RMSupplierList() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const filteredData = dummySuppliers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    const columns: ColumnDef<Supplier>[] = [
        { accessorKey: "name", header: "Supplier Name" },
        { accessorKey: "contact", header: "Contact" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "address", header: "Address" },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded text-xs text-white ${row.original.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {row.original.status}
                </span>
            )
        },
    ];

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold">Raw Material Suppliers</h2>
                <Link to="/dashboard/raw-materials/suppliers/create">
                    <Button className="bg-blue-600 hover:bg-blue-500">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Supplier
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Supplier List</CardTitle>
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
