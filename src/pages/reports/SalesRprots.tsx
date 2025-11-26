"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type CustomerSales = {
  customer: string;
  sales: number;
};

type ProductSales = {
  sku: string;
  product: string;
  qty: number;
  sales: number;
};

const topCustomers: CustomerSales[] = [
  { customer: "Modern Enterprises", sales: 4300 },
  { customer: "Arif R.", sales: 487.5 },
];

const topProducts: ProductSales[] = [
  { sku: "SKU002", product: "Office Chair", qty: 5, sales: 1495 },
  { sku: "SKU001", product: "Wireless Mouse", qty: 20, sales: 810 },
  { sku: "SKU007", product: "Desk Lamp", qty: 2, sales: 150 },
  { sku: "SKU010", product: "Cable Management", qty: 2, sales: 50 },
  { sku: "SKU005", product: "A4 Paper", qty: 1, sales: 12.5 },
];

export default function SalesReports() {
  const [start, setStart] = useState("2025-11-01");
  const [end, setEnd] = useState("2025-11-26");

  const productColumns: ColumnDef<ProductSales>[] = [
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "product", header: "Product" },
    { accessorKey: "qty", header: "Qty" },
    {
      accessorKey: "sales",
      header: "Sales (RM)",
      cell: ({ row }) => <span>RM {(row.getValue("sales") as number).toFixed(2)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Sales Reports</h2>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div>
          <label className="text-sm font-medium">Start Date</label>
          <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium">End Date</label>
          <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>

        <Button className="mt-6">Filter</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl shadow-sm">
          <CardContent>
            <p className="text-xs text-gray-500">Orders</p>
            <p className="text-2xl font-semibold">2</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent>
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-2xl font-semibold">RM 4,787.50</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent>
            <p className="text-xs text-gray-500">Tax</p>
            <p className="text-2xl font-semibold">RM 0.00</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent>
            <p className="text-xs text-gray-500">Discounts</p>
            <p className="text-2xl font-semibold">RM 45.00</p>
          </CardContent>
        </Card>
      </div>


      <div className="grid lg:grid-cols-2 gap-4">

        {/* Revenue Chart */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Revenue by Day</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ date: "2025-11-21", revenue: 4787.5 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (RM)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Sales (RM)</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c) => (
                  <tr key={c.customer} className="border-b">
                    <td className="p-3">{c.customer}</td>
                    <td className="p-3">RM {c.sales.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>



      </div>

      {/* Top Products */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={productColumns} data={topProducts} pageSize={5} />
        </CardContent>
      </Card>
    </div>
  );
}
