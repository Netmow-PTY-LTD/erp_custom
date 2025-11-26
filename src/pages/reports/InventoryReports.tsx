"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export type LowStockItem = {
  sku: string;
  product: string;
  stock: number;
  minLevel: number;
};

const lowStockItems: LowStockItem[] = [
  { sku: "SKU004", product: "Laptop Computer", stock: -16, minLevel: 5 },
  { sku: "SKU010", product: "Cable Management", stock: 1, minLevel: 3 },
];

export default function InventoryReports() {
  const [pageIndex, setPageIndex] = useState(0);

  const columns: ColumnDef<LowStockItem>[] = [
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "product", header: "Product" },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        return (
          <span
            className={
              stock <= 0
                ? "text-red-600 font-semibold"
                : stock <= 2
                ? "text-yellow-600 font-semibold"
                : "text-gray-800"
            }
          >
            {stock}
          </span>
        );
      },
    },
    { accessorKey: "minLevel", header: "Min Level" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h2 className="text-2xl font-semibold">Inventory Reports</h2>

      {/* Stock Valuation + Low Stock Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Stock Valuation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-semibold text-blue-600">RM 21,177.00</p>
            <p className="text-gray-600 text-sm">Total Units: 1475</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-red-600">2</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Table */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Low Stock List</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={lowStockItems}
            pageIndex={pageIndex}
            pageSize={10}
            onPageChange={setPageIndex}
          />
        </CardContent>
      </Card>
    </div>
  );
}
