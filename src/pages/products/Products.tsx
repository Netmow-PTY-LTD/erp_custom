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
  id: number;
  sku: string;
  name: string;
  category: string;
  brand_name: string;
  unit: string;
  cost_price: number;
  selling_price: number;
  stock: string;
  stockStatus: string;
  status: string;
};

const products: Product[] = [
  {
    id: 1,
    sku: "abc01",
    name: "Pran Chini Gura Chal",
    category: "Office Supplies",
    brand_name: "Pran Chini Gura Chal",
    unit: "pcs",
    cost_price: 10.0,
    selling_price: 100.0,
    stock: "120 pcs",
    stockStatus: "High Stock",
    status: "Active",
  },
  {
    id: 2,
    sku: "SKU001",
    name: "Wireless Mouse",
    category: "Electronics",
    brand_name: "Wireless Mouse",
    unit: "pcs",
    cost_price: 45.0,
    selling_price: 45.0,
    stock: "347 pcs",
    stockStatus: "High Stock",
    status: "Active",
  },
  {
    id: 3,
    sku: "SKU002",
    name: "Office Chair",
    category: "Furniture",
    brand_name: "Office Chair",
    unit: "pcs",
    cost_price: 299.0,
    selling_price: 299.0,
    stock: "55 pcs",
    stockStatus: "Normal",
    status: "Active",
  },
  {
    id: 4,
    sku: "SKU003",
    name: "Power Drill",
    category: "Industrial Tools",
    brand_name: "Power Drill",
    unit: "pcs",
    cost_price: 125.0,
    selling_price: 125.0,
    stock: "30 pcs",
    stockStatus: "Normal",
    status: "Active",
  },
  {
    id: 5,
    sku: "SKU004",
    name: "Laptop Computer",
    category: "Computer Hardware",
    brand_name: "Laptop Computer",
    unit: "pcs",
    cost_price: 2850.0,
    selling_price: 2850.0,
    stock: "16 pcs",
    stockStatus: "Low Stock",
    status: "Active",
  },
  {
    id: 6,
    sku: "SKU005",
    name: "A4 Paper",
    category: "Office Supplies",
    brand_name: "A4 Paper",
    unit: "ream",
    cost_price: 12.5,
    selling_price: 12.5,
    stock: "529 ream",
    stockStatus: "Normal",
    status: "Active",
  },
  {
    id: 7,
    sku: "SKU006",
    name: "Network Switch",
    category: "Networking",
    brand_name: "Network Switch",
    unit: "pcs",
    cost_price: 450.0,
    selling_price: 450.0,
    stock: "13 pcs",
    stockStatus: "Normal",
    status: "Active",
  },
  {
    id: 8,
    sku: "SKU007",
    name: "Desk Lamp",
    category: "Electronics",
    brand_name: "Desk Lamp",
    unit: "pcs",
    cost_price: 75.0,
    selling_price: 75.0,
    stock: "176 pcs",
    stockStatus: "High Stock",
    status: "Active",
  },
  {
    id: 9,
    sku: "SKU008",
    name: "Printer Ink",
    category: "Office Supplies",
    brand_name: "Printer Ink",
    unit: "pcs",
    cost_price: 35.0,
    selling_price: 35.0,
    stock: "194 pcs",
    stockStatus: "Normal",
    status: "Active",
  },
  {
    id: 10,
    sku: "SKU009",
    name: "Whiteboard",
    category: "Office Supplies",
    brand_name: "Whiteboard",
    unit: "pcs",
    cost_price: 180.0,
    selling_price: 180.0,
    stock: "28 pcs",
    stockStatus: "Normal",
    status: "Active",
  },
  {
    id: 11,
    sku: "SKU010",
    name: "Cable Management",
    category: "Office Supplies",
    brand_name: "Cable Management",
    unit: "pcs",
    cost_price: 25.0,
    selling_price: 25.0,
    stock: "0 pcs",
    stockStatus: "Low Stock",
    status: "Active",
  },
  {
    id: 12,
    sku: "SKU011",
    name: "Cable Management",
    category: "Office Supplies",
    brand_name: "Cable Management",
    unit: "pcs",
    cost_price: 25.0,
    selling_price: 25.0,
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
      header: "Product Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "brand_name",
      header: "Brand",
    },
    {
      accessorKey: "unit",
      header: "Base UoM",
    },
    {
      accessorKey: "cost_price",
      header: "Cost Price (RM)",
    },
    {
      accessorKey: "selling_price",
      header: "Selling Price (RM)",
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
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const bgColor = status.toLowerCase() === "active" ? "bg-green-500" : "bg-red-500";
        return <span className={`py-1 px-2 rounded-full text-xs text-white font-medium ${bgColor}`}>{status}</span>;
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;

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
              >
                <Link to={`/dashboard/products/${product.id}/edit`} className="w-full">
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`/dashboard/products/${product.id}`} className="w-full">
                  View
                </Link>
              </DropdownMenuItem>
               <DropdownMenuSeparator />
              <DropdownMenuItem onClick={()=> alert(`Product with id ${product.id} has been deleted successfully.`)} className="cursor-pointer">
                Delete
              </DropdownMenuItem>
                <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`/dashboard/products/${product.id}`} className="w-full">
                  Stock
                </Link>
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
