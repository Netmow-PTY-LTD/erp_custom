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
import AddStockForm from "@/components/products/AddStockForm";
import type { Product } from "@/types/types";
import { useGetAllProductsQuery } from "@/store/features/admin/productsApiService";
import { Link } from "react-router";
import { useAppSelector } from "@/store/store";
// import { ProductPermission } from "@/config/permissions";

export default function StockManagement() {
  const [openAddStockForm, setOpenAddStockForm] = useState<boolean>(false);
  //const [productId, setProductId] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const limit = 10;
//   const userPermissions = useAppSelector((state) => state.auth.user?.role.permissions || []);

// const canDeleteStock = userPermissions.includes(ProductPermission.DELETE_STOCK);



  const {
    data: fetchedProducts,
    isFetching,
    refetch: refetchProducts,
  } = useGetAllProductsQuery({ page, limit, search });

  const products: Product[] = fetchedProducts?.data || [];

  const pagination = fetchedProducts?.pagination ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPage: 1,
  };

  // const handleDeleteStock = (sku: string) => {
  //   // Handle stock deletion logic here
  //   console.log(`Deleting stock with SKU: ${sku}`);
  // };

  const currency = useAppSelector((state) => state.currency.value);

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
      cell: ({ row }) => row?.original?.category?.name,
    },
    {
      accessorKey: "cost",
      header: `Cost Price (${currency})`,
      cell: ({ row }) => row.original.cost,
    },
    {
      accessorKey: "price",
      header: `Selling Price (${currency})`,
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
                  to={`/dashboard/products/${product.id}`}
                  className="w-full"
                >
                  View Stock
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
        <h1 className="text-2xl font-bold">Stock Management</h1>
        <div className="ml-auto">
         <AddStockForm open={openAddStockForm} setOpen={setOpenAddStockForm} products={products} search={search} setSearch={setSearch} refetchProducts={refetchProducts} />
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
    </div>
  );
}
