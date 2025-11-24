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
];

export default function StockManagement() {
  const [openEditStockForm, setOpenEditStockForm] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [openAddStockForm, setOpenAddStockForm] = useState<boolean>(false);

  const pageSize = 10;

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
              <DropdownMenuItem onClick={() => setOpenEditStockForm(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteStock(item?.sku)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="flex">
        <h1 className="text-2xl font-bold">Stocks Management</h1>
        <div className="ml-auto">
          <AddStockForm open={openAddStockForm} setOpen={setOpenAddStockForm} />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={stocks}
        totalCount={stocks.length}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={setPageIndex}
      />
      <EditStockForm open={openEditStockForm} setOpen={setOpenEditStockForm} />
    </div>
  );
}
