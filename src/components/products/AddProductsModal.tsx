"use client";

import { toast } from "sonner";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetAllProductsQuery, useGetAllCategoriesQuery } from "@/store/features/admin/productsApiService";
import type { Product } from "@/types/types";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

interface AddProductsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (addedProducts: Product[], removedIds: number[]) => void;
    initialSelectedIds?: number[];
}

export function AddProductsModal({
    isOpen,
    onClose,
    onApply,
    initialSelectedIds = [],
}: AddProductsModalProps) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [deselectedIds, setDeselectedIds] = useState<number[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const { data, isFetching } = useGetAllProductsQuery({
        page,
        limit,
        search: search || undefined,
        category_id: selectedCategory === "all" ? undefined : selectedCategory,
    });

    const { data: categoriesData } = useGetAllCategoriesQuery();
    const categories = categoriesData?.data || [];

    const products = Array.isArray(data?.data) ? data.data : [];
    const totalCount = data?.pagination?.total || 0;

    const toggleProductSelection = (product: Product) => {
        const isSelected = (initialSelectedIds.includes(product.id) && !deselectedIds.includes(product.id)) ||
            selectedProducts.some(p => p.id === product.id);

        if (!isSelected && (product.stock_quantity || 0) <= 0) {
            toast.warning("This product is out of stock and cannot be selected.");
            return;
        }

        if (initialSelectedIds.includes(product.id)) {
            setDeselectedIds((prev) =>
                prev.includes(product.id)
                    ? prev.filter((id) => id !== product.id)
                    : [...prev, product.id]
            );
        } else {
            setSelectedProducts((prev) =>
                prev.some((p) => p.id === product.id)
                    ? prev.filter((p) => p.id !== product.id)
                    : [...prev, product]
            );
        }
    };

    const handleApply = () => {
        onApply(selectedProducts, deselectedIds);
        setSelectedProducts([]);
        setDeselectedIds([]);
        onClose();
    };

    const columns: ColumnDef<Product>[] = [
        {
            id: "select",
            header: () => (
                <div className="w-6">#</div>
            ),
            cell: ({ row }) => {
                const product = row.original;
                const isSelected = (initialSelectedIds.includes(product.id) && !deselectedIds.includes(product.id)) ||
                    selectedProducts.some(p => p.id === product.id);
                return (
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleProductSelection(product)}
                        onClick={(e) => e.stopPropagation()}
                    />
                );
            },
        },
        {
            accessorKey: "thumb_url",
            header: "Image",
            meta: { className: "min-w-[90px]" } as any,
            cell: ({ row }) => (
                <img
                    src={row.original.thumb_url || "/placeholder.png"}
                    alt={row.original.name}
                    className="w-16 h-16 rounded-full object-cover border shrink-0"
                />
            ),
        },
        {
            accessorKey: "name",
            header: "Product Name",
            cell: ({ row }) => {
                const product = row.original;
                const isInitiallySelected = initialSelectedIds.includes(product.id);
                return (
                    <div className="font-medium">
                        {product.name} {isInitiallySelected && <span className="text-xs text-blue-500 ml-2">(In Order)</span>}
                    </div>
                );
            },
        },
        // ... remaining columns ...
        {
            accessorKey: "sku",
            header: "SKU",
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => {
                const price = Number(row.original.price);
                return <span>${price.toFixed(2)}</span>;
            },
        },
        {
            accessorKey: "stock_quantity",
            header: "Stock",
            cell: ({ row }) => {
                const stock = row.original.stock_quantity;
                return (
                    <span className={stock > 0 ? "text-green-600" : "text-red-600"}>
                        {stock}
                    </span>
                );
            },
        },
        {
            accessorKey: "category.name",
            header: "Category",
            cell: ({ row }) => row.original.category?.name || "N/A",
        },
        {
            accessorKey: "unit.name",
            header: "Unit",
        },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl w-full max-h-[80vh] h-full flex flex-col">
                <DialogHeader className="flex sm:flex-row flex-col items-start justify-between gap-4 space-y-0 mt-4">
                    <DialogTitle className="text-2xl font-bold">Add Items</DialogTitle>
                    <div className="flex flex-col gap-2 w-full sm:w-auto items-start">
                        <label className="text-sm font-medium whitespace-nowrap">Filter by Category:</label>
                        <select
                            className="w-48 sm:w-64 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="all">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto pt-2">
                    <DataTable
                        columns={columns}
                        data={products}
                        pageIndex={page - 1}
                        pageSize={limit}
                        onPageChange={(p) => setPage(p + 1)}
                        totalCount={totalCount}
                        onSearch={(val) => {
                            setSearch(val);
                            setPage(1);
                        }}
                        isFetching={isFetching}
                        onRowClick={(product) => toggleProductSelection(product)}
                    />
                </div>

                <DialogFooter className="gap-2 border-t pt-4 mt-0">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApply}
                        disabled={selectedProducts.length === 0 && deselectedIds.length === 0}
                        className="bg-primary hover:bg-primary/90"
                    >
                        Apply Changes ({selectedProducts.length + (initialSelectedIds.length - deselectedIds.length)} items)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
