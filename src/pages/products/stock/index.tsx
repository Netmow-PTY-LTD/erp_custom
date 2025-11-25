import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/components/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import AddStockForm from "@/components/products/AddStockForm";
import EditStockForm from "@/components/products/EditStockForm";

type Stock = {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  stockStatus: "High Stock" | "Normal" | "Low Stock";
  status: "Active" | "Inactive";
};

const stocks: Stock[] = [
  {
    sku: "123",
    name: "Product 1",
    category: "Category 1",
    price: 100,
    stock: 10,
    stockStatus: "High Stock",
    status: "Active",
  },
  {
    sku: "456",
    name: "Product 2",
    category: "Category 2",
    price: 200,
    stock: 5,
    stockStatus: "Low Stock",
    status: "Inactive",
  },
  {
    sku: "789",
    name: "Product 3",
    category: "Category 3",
    price: 300,
    stock: 0,
    stockStatus: "Low Stock",
    status: "Active",
  },
  {
    sku: "101112",
    name: "Product 4",
    category: "Category 4",
    price: 400,
    stock: 15,
    stockStatus: "Normal",
    status: "Inactive",
  },
  {
    sku: "131415",
    name: "Product 5",
    category: "Category 5",
    price: 500,
    stock: 20,
    stockStatus: "High Stock",
    status: "Active",
  },
  {
    sku: "161718",
    name: "Product 6",
    category: "Category 6",
    price: 600,
    stock: 10,
    stockStatus: "Normal",
    status: "Inactive",
  },
  {
    sku: "192021",
    name: "Product 7",
    category: "Category 7",
    price: 700,
    stock: 5,
    stockStatus: "Low Stock",
    status: "Active",
  },
  {
    sku: "222324",
    name: "Product 8",
    category: "Category 8",
    price: 800,
    stock: 0,
    stockStatus: "Low Stock",
    status: "Inactive",
  },
  {
    sku: "252627",
    name: "Product 9",
    category: "Category 9",
    price: 900,
    stock: 15,
    stockStatus: "Normal",
    status: "Active",
  },
  {
    sku: "282930",
    name: "Product 10",
    category: "Category 10",
    price: 1000,
    stock: 20,
    stockStatus: "High Stock",
    status: "Inactive",
  },
  {
    sku: "313233",
    name: "Product 11",
    category: "Category 11",
    price: 1100,
    stock: 10,
    stockStatus: "Normal",
    status: "Active",
  },
  {
    sku: "343536",
    name: "Product 12",
    category: "Category 12",
    price: 1200,
    stock: 5,
    stockStatus: "Low Stock",
    status: "Inactive",
  },
];

export default function StockManagement() {
  const [openEditStockForm, setOpenEditStockForm] = useState<boolean>(false);
  const [openAddStockForm, setOpenAddStockForm] = useState<boolean>(false);

  const handleDeleteStock = (sku: string) => {
    // Handle stock deletion logic here
    console.log(`Deleting stock with SKU: ${sku}`);
  };

  const columns: ColumnDef<Stock>[] = [
    {
      accessorKey: "sku",
      header: "SKU",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      accessorKey: "stockStatus",
      header: "Stock Status",
      cell: ({ row }) => {
        const status = row.getValue("stockStatus") as string;

        return (
          <Badge
            variant={
              status === "High Stock"
                ? "success"
                : status === "Low Stock"
                ? "destructive"
                : "secondary"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;

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
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setOpenEditStockForm(true)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">View</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => handleDeleteStock(item?.sku)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex">
        <h1 className="text-2xl font-bold">Stocks Management</h1>
        <div className="ml-auto">
          <AddStockForm open={openAddStockForm} setOpen={setOpenAddStockForm} />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={stocks}
      />
      <EditStockForm open={openEditStockForm} setOpen={setOpenEditStockForm} />
    </div>
  );
}
