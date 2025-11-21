import { DataTable } from "@/components/dashboard/components/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

export type Product = {
  sku: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  stockStatus: string;
  status: string;
};

const products: Product[] = [
  {
    sku: "abc01",
    name: "Pran Chini Gura Chal",
    category: "Office Supplies",
    price: "RM 100.00",
    stock: "120 pcs",
    stockStatus: "High Stock",
    status: "Active",
  },
  {
    sku: "SKU001",
    name: "Wireless Mouse",
    category: "Electronics",
    price: "RM 45.00",
    stock: "347 pcs",
    stockStatus: "High Stock",
    status: "Active",
  },
  {
    sku: "SKU002",
    name: "Office Chair",
    category: "Furniture",
    price: "RM 299.00",
    stock: "55 pcs",
    stockStatus: "Normal",
    status: "Active",
  },
  {
    sku: "SKU003",
    name: "Power Drill",
    category: "Industrial Tools",
    price: "RM 125.00",
    stock: "30 pcs",
    stockStatus: "Normal",
    status: "Active",
  },
  {
    sku: "SKU004",
    name: "Laptop Computer",
    category: "Computer Hardware",
    price: "RM 2850.00",
    stock: "-16 pcs",
    stockStatus: "Low Stock",
    status: "Active",
  },
  {
    sku: "SKU005",
    name: "A4 Paper",
    category: "Office Supplies",
    price: "RM 12.50",
    stock: "529 ream",
    stockStatus: "Normal",
    status: "Active",
  },
  {
    sku: "SKU006",
    name: "Network Switch",
    category: "Networking",
    price: "RM 450.00",
    stock: "13 pcs",
    stockStatus: "Normal",
    status: "Active",
  },
  {
    sku: "SKU007",
    name: "Desk Lamp",
    category: "Electronics",
    price: "RM 75.00",
    stock: "176 pcs",
    stockStatus: "High Stock",
    status: "Active",
  },
  {
    sku: "SKU008",
    name: "Printer Ink",
    category: "Office Supplies",
    price: "RM 35.00",
    stock: "194 pcs",
    stockStatus: "Normal",
    status: "Active",
  },
  {
    sku: "SKU009",
    name: "Whiteboard",
    category: "Office Supplies",
    price: "RM 180.00",
    stock: "28 pcs",
    stockStatus: "Normal",
    status: "Active",
  },
  {
    sku: "SKU010",
    name: "Cable Management",
    category: "Office Supplies",
    price: "RM 25.00",
    stock: "0 pcs",
    stockStatus: "Low Stock",
    status: "Active",
  },
];

export default function Products() {
  const [pageIndex, setPageIndex] = useState(0);

  const productColumns: ColumnDef<Product>[] = [
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
      const payment = row.original
 
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.sku)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>
      <DataTable
        columns={productColumns}
        data={products}
        totalCount={products.length}
        pageIndex={pageIndex}
        pageSize={10}
        onPageChange={setPageIndex}
      />
    </div>
  );
}
