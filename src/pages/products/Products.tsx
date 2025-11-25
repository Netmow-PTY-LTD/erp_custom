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
import {
  AlertCircle,
  AlertTriangle,
  Boxes,
  CheckCircle,
  MoreHorizontal,
  PackagePlus,
  Tags,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

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

const stats = [
  {
    label: "Total Products",
    value: 11,
    color: "bg-blue-600",
    icon: <Boxes className="w-10 h-10 opacity-80" />,
  },
  {
    label: "Active Products",
    value: 11,
    color: "bg-green-700",
    icon: <CheckCircle className="w-10 h-10 opacity-80" />,
  },
  {
    label: "Low Stock",
    value: 2,
    color: "bg-red-600",
    icon: <AlertTriangle className="w-10 h-10 opacity-80" />,
  },
  {
    label: "Total Stock",
    value: 1449,
    color: "bg-cyan-500",
    icon: <Boxes className="w-10 h-10 opacity-80" />,
  },
];

export default function Products() {

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
        const payment = row.original;

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
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Product Management</h2>

        <div className="flex flex-wrap items-center gap-4">
          <button className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-sm hover:bg-yellow-300">
            <AlertCircle size={18} />
            Stock Alerts
          </button>

          <Link to="/dashboard/products/categories">
            <button className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-cyan-500">
            <Tags size={18} />
            Categories
          </button>
          </Link>

          <Link to="/dashboard/products/create">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-500">
            <PackagePlus size={18} />
            Add Product
          </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={productColumns}
            data={products}
          />
        </CardContent>
      </Card>
    </div>
  );
}
