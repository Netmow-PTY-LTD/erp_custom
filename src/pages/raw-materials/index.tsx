import { DataTable } from "@/components/dashboard/components/DataTable";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import {
    AlertTriangle,
    Boxes,
    MoreHorizontal,
    PackagePlus,
    Truck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useState } from "react";
import { Link } from "react-router";
// import type { Product } from "@/types/types"; // Define RawMaterial type locally for now

type RawMaterial = {
    id: number;
    name: string;
    category: string;
    stock_quantity: number;
    unit: string;
    cost: number;
    supplier: string;
    status: "Active" | "Inactive";
};

const dummyRawMaterials: RawMaterial[] = [
    { id: 1, name: "Cotton Fabric", category: "Fabric", stock_quantity: 500, unit: "Meters", cost: 120, supplier: "Textile Corp", status: "Active" },
    { id: 2, name: "Polyester Thread", category: "Thread", stock_quantity: 200, unit: "Spools", cost: 5, supplier: "Thread Masters", status: "Active" },
    { id: 3, name: "Buttons (Plastic)", category: "Accessories", stock_quantity: 1000, unit: "Pcs", cost: 0.5, supplier: "Button World", status: "Active" },
    { id: 4, name: "Zippers", category: "Accessories", stock_quantity: 50, unit: "Pcs", cost: 2, supplier: "Zip It", status: "Inactive" },
];

export default function RawMaterials() {
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const limit = 10;

    const [materials, setMaterials] = useState<RawMaterial[]>(dummyRawMaterials);

    // Filter materials based on search
    const filteredMaterials = materials.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedMaterials = filteredMaterials.slice((page - 1) * limit, page * limit);

    // Mock stats
    const stats = [
        {
            label: "Total Materials",
            value: materials.length,
            color: "bg-blue-600",
            icon: <Boxes className="w-10 h-10 opacity-80" />,
        },
        {
            label: "Low Stock",
            value: materials.filter(m => m.stock_quantity < 100).length,
            color: "bg-red-600",
            icon: <AlertTriangle className="w-10 h-10 opacity-80" />,
        },
        {
            label: "Active Suppliers",
            value: new Set(materials.map(m => m.supplier)).size,
            color: "bg-green-700",
            icon: <Truck className="w-10 h-10 opacity-80" />,
        },
    ];

    const handleDelete = (id: number) => {
        setMaterials(prev => prev.filter(item => item.id !== id));
    };


    const columns: ColumnDef<RawMaterial>[] = [
        {
            accessorKey: "name",
            header: "Material Name",
        },
        {
            accessorKey: "category",
            header: "Category",
        },
        {
            accessorKey: "stock_quantity",
            header: "Stock Level",
            cell: ({ row }) => `${row.original.stock_quantity} ${row.original.unit}`,
        },
        {
            accessorKey: "cost",
            header: "Cost Price",
            cell: ({ row }) => <span>${row.original.cost.toFixed(2)}</span>,
        },
        {
            accessorKey: "supplier",
            header: "Supplier",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status === "Active";
                const bgColor = status ? "bg-green-500" : "bg-red-500";
                return (
                    <span
                        className={`py-1 px-2 rounded-full text-xs text-white font-medium ${bgColor}`}
                    >
                        {row.original.status}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link to={`/dashboard/raw-materials/${row.original.id}/edit`} className="w-full">Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to="#" className="w-full">Ordered History</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(row.original.id)} className="text-red-600 focus:text-red-600">
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <div className="w-full">
            <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold">Raw Material Management</h2>

                <div className="flex flex-wrap items-center gap-4">
                    <Link to="/dashboard/raw-materials/create">
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-500">
                            <PackagePlus size={18} />
                            Add Material
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {stats.map((item, idx) => (
                    <div
                        key={idx}
                        className={`${item.color} text-white rounded-xl p-5 flex justify-between items-center shadow`}
                    >
                        <div>
                            <h3 className="text-3xl font-bold">{item.value}</h3>
                            <p className="text-sm mt-1 opacity-90">{item.label}</p>
                        </div>
                        {item.icon}
                    </div>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Raw Materials Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={paginatedMaterials}
                        pageIndex={page - 1}
                        pageSize={limit}
                        totalCount={filteredMaterials.length}
                        onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
                        onSearch={(value) => {
                            setSearch(value);
                            setPage(1);
                        }}
                        isFetching={false}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
