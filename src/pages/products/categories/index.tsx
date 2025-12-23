"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/components/DataTable";

import AddProductCategoryForm from "@/components/products/AddProductCategoryForm";
import EditProductCategoryForm from "@/components/products/EditProductCategoryForm";
import type { Category } from "@/types/types";
import { useDeleteCategoryMutation, useGetAllCategoriesQuery } from "@/store/features/admin/productsApiService";
import { toast } from "sonner";
import { useAppSelector } from "@/store/store";
import { ProductPermission } from "@/config/permissions";

export default function CategoryPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openEditForm, setOpenEditForm] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const limit = 10;
  const userPermissions = useAppSelector((state) => state.auth.user?.role.permissions || []);
  const canDeleteCategory = userPermissions.includes(ProductPermission.DELETE_CATEGORIES);

  const { data: fetchedCategories, isFetching } = useGetAllCategoriesQuery({
    page,
    limit,
    search,
  });






  const categories: Category[] = fetchedCategories?.data || [];
  const pagination = fetchedCategories?.pagination ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPage: 1,
  };

  const [deleteCategory] = useDeleteCategoryMutation();
  const handleDeleteCategory = async (id: number) => {
    // Ask for confirmation using a simple toast with prompt
    const confirmed = await new Promise<boolean>((resolve) => {
      toast(
        "Are you sure you want to delete this category?",
        {
          action: {
            label: "Delete",
            onClick: () => resolve(true), // user confirmed
          },
          duration: 10000, // auto-dismiss after 5s
        }
      );

      // resolve false if toast disappears automatically
      setTimeout(() => resolve(false), 10000);
    });

    console.log("User confirmed deletion: ", confirmed);

    if (!confirmed) return; // stop if user didn’t confirm

    try {
      const res = await deleteCategory(id).unwrap();
      if (res.status) {
        toast.success("Category deleted successfully");
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category" + (error instanceof Error ? ": " + error.message : ""));
    }
  };


  // Define columns for DataTable
  const categoryColumns: ColumnDef<Category>[] = [
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

        return (
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        );
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
              onClick={() => {
                setCategoryId(categoryId);
                setOpenEditForm(true);
              }}
            >
              Edit
            </Button>


            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteCategory(categoryId)}
            >
              Delete
            </Button>


          </div>
        );
      },
    },
  ];


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
        pageIndex={page - 1}
        pageSize={limit}
        totalCount={pagination.total}
        onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        isFetching={isFetching}
      />
      {/* Edit category form */}
      <EditProductCategoryForm
        open={openEditForm}
        setOpen={setOpenEditForm}
        categoryId={categoryId}
      />
    </div>
  );
}
