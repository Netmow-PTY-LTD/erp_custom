"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  status: z.string().min(1, "Status is required"),
});

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

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [openEditForm, setOpenEditForm] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      status: "Active",
    },
  });

  const handleAddCategory = (values: z.infer<typeof categorySchema>) => {
   console.log(values);
  };

  //console.log(categories);

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
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button>Add Category</Button>
          </SheetTrigger>

          <SheetContent side="right" className="max-w-[400px] w-full">
            <SheetHeader>
              <SheetTitle>Add Category</SheetTitle>
            </SheetHeader>
            <div className="px-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAddCategory)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Add Category</Button>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ShadCN DataTable */}
      <DataTable
        columns={categoryColumns}
        data={categories}
        totalCount={categories.length}
        pageIndex={pageIndex}
        pageSize={10}
        onPageChange={setPageIndex}
      />
      {/* Edit category form */}
       <Sheet open={openEditForm} onOpenChange={setOpenEditForm}>

          <SheetContent side="right" className="max-w-[400px] w-full">
            <SheetHeader>
              <SheetTitle>Update Category</SheetTitle>
            </SheetHeader>
            <div className="px-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAddCategory)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Update Category</Button>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
    </div>
  );
}
