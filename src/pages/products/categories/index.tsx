"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/components/DataTable";

import AddProductCategoryForm from "@/components/products/AddProductCategoryForm";
import EditProductCategoryForm from "@/components/products/EditProductCategoryForm";

type Category = {
  name: string;
  status: string;
};

// Sample initial categories
const initialCategories: Category[] = [
  { name: "Office Supplies", status: "Active" },
  { name: "Electronics", status: "Active" },
  { name: "Furniture", status: "Active" },
  { name: "Clothing", status: "Active" },
  { name: "Home Decor", status: "Active" },
  { name: "Books", status: "Active" },
  { name: "Toys", status: "Active" },
  { name: "Sports Equipment", status: "Active" },
  { name: "Health and Beauty", status: "Active" },
  { name: "Jewelry", status: "Active" },
];

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [openEditForm, setOpenEditForm] = useState<boolean>(false);

  // Define columns for DataTable
  const categoryColumns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Category",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="success"
              size="sm"
              onClick={() => setOpenEditForm(true)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                setCategories((prev) =>
                  prev.filter((c) => c.name !== row.original.name)
                )
              }
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header and Add Category Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Categories</h1>
        {/* Add Category form */}
        <AddProductCategoryForm open={sheetOpen} setOpen={setSheetOpen} />
      </div>

      {/* ShadCN DataTable */}
      <DataTable
        columns={categoryColumns}
        data={categories}
        pageIndex={pageIndex}
        pageSize={10}
        onPageChange={setPageIndex}
      />
      {/* Edit category form */}
     <EditProductCategoryForm open={openEditForm} setOpen={setOpenEditForm} />
    </div>
  );
}
