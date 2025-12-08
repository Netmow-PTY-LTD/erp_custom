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
import type { Product } from "@/types/types";
import { useGetAllProductsQuery } from "@/store/features/admin/productsApiService";
import { Link } from "react-router";

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
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");
    const limit = 10;
  
    const {
      data: fetchedProducts,
      isFetching,
      refetch: refetchProducts,
    } = useGetAllProductsQuery({ page, limit, search });
  
    const products: Product[] = fetchedProducts?.data || [];
    console.log("Fetched Products: ", fetchedProducts);
    console.log("Fetched Products Length: ", fetchedProducts?.data?.length);

    const pagination = fetchedProducts?.pagination ?? {
      total: 0,
      page: 1,
      limit: 10,
      totalPage: 1,
    };

  const handleDeleteStock = (sku: string) => {
    // Handle stock deletion logic here
    console.log(`Deleting stock with SKU: ${sku}`);
  };

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
      accessorKey: "thumb_url",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={row.original.thumb_url}
          alt={row.original.name}
          className="w-10 h-10 rounded-full"
        />
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => row?.original?.category?.name
    },
    {
      accessorKey: "cost",
      header: "Cost Price (RM)",
      cell: ({ row }) => row.original.cost,
    },
    {
      accessorKey: "price",
      header: "Selling Price (RM)",
      cell: ({ row }) => row.original.price,
    },
    // {
    //   accessorKey: "unit",
    //   header: "Unit",
    //   cell: ({ row }) =>
    //     `${row.original.unit.name} (${row.original.unit.symbol})`,
    // },
    {
      accessorKey: "stock_quantity",
      header: "Stock",
      cell: ({ row }) => row.original.stock_quantity,
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.is_active;
        const bgColor = status ? "bg-green-500" : "bg-red-500";
        return (
          <span
            className={`py-1 px-2 rounded-full text-xs text-white font-medium ${bgColor}`}
          >
            {status ? "Active" : "Inactive"}
          </span>
        );
      },
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
              <DropdownMenuItem>
                <Link
                  to={`/dashboard/products/${product.id}/edit`}
                  className="w-full"
                >
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  to={`/dashboard/products/${product.id}`}
                  className="w-full"
                >
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => alert(product.id)}
                className="cursor-pointer"
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  to={`/dashboard/products/${product.id}/stock`}
                  className="w-full"
                >
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
    <div className="space-y-8">
      <div className="flex">
        <h1 className="text-2xl font-bold">Stocks Management</h1>
        <div className="ml-auto">
          <AddStockForm open={openAddStockForm} setOpen={setOpenAddStockForm} />
        </div>
      </div>

      <DataTable
        columns={productColumns}
        data={products}
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
      <EditStockForm open={openEditStockForm} setOpen={setOpenEditStockForm} />
    </div>
  );
}
