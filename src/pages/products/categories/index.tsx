"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/components/DataTable";

import AddProductCategoryForm from "@/components/products/AddProductCategoryForm";
import EditProductCategoryForm from "@/components/products/EditProductCategoryForm";
import type { Category } from "@/types/types";
import { useGetAllCategoriesQuery } from "@/store/features/admin/productsApiService";


export default function CategoryPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openEditForm, setOpenEditForm] = useState<boolean>(false);

  const { data: fetchedCategories } = useGetAllCategoriesQuery();

  console.log("Fetched Categories: ", fetchedCategories);

  const categories: Category[] = fetchedCategories?.data || [];

  // Define columns for DataTable
  const categoryColumns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Category",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => {
          const isActive = row.original.is_active;
          const bgColor = isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
          return <span className={bgColor+" px-2 py-1 text-xs rounded-full font-medium"}>{isActive ? "Active" : "Inactive"}</span>;
        },
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const categoryId = row.original.id;
          return (
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
              onClick={() => alert("Delete category with ID:" + categoryId)}
            >
              Delete
            </Button>
          </div>
        );
        },
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
      />
      {/* Edit category form */}
     <EditProductCategoryForm open={openEditForm} setOpen={setOpenEditForm} />
    </div>
  );
}
