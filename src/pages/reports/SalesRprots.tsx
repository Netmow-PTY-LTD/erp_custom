import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { ReportRangeButtons } from "@/components/reports/ReportRangeButtons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ---------------------- MOCK DATA (Designed like screenshot) ----------------------

const salesByDate = [
  { key: "2025-01-01", invoices: 12, amount: 18500, returns: 1200, net: 17300, margin: "32.4%" },
  { key: "2025-01-02", invoices: 9, amount: 12900, returns: 0, net: 12900, margin: "29.1%" },
];

const purchasesBySupplier = [
  { key: "ABC Supplier", bills: 8, amount: 28000, returns: 1500, net: 26500 },
  { key: "XYZ Trading", bills: 5, amount: 14750, returns: 0, net: 14750 },
];

// -----------------------------------------------------------------------------------

export default function ReportsAnalytics() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const salesColumns: ColumnDef<any>[] = [
    { accessorKey: "key", header: "Key" },
    { accessorKey: "invoices", header: "Invoices" },
    { accessorKey: "amount", header: "Sales Amount" },
    { accessorKey: "returns", header: "Returns" },
    { accessorKey: "net", header: "Net Sales" },
    { accessorKey: "margin", header: "Margin %" },
  ];

  const purchaseColumns: ColumnDef<any>[] = [
    { accessorKey: "key", header: "Key" },
    { accessorKey: "bills", header: "Bills" },
    { accessorKey: "amount", header: "Purchase Amount" },
    { accessorKey: "returns", header: "Returns" },
    { accessorKey: "net", header: "Net Purchases" },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <h2 className="text-3xl font-bold">Sales Reports & Analytics</h2>
      <p className="text-gray-500 mb-4 max-w-3xl">
        Analyze sales, purchases, inventory, accounting, HR & payroll, CRM and projects with flexible filters
        and export options.
      </p>

      {/* BUSINESS SNAPSHOT */}
      <Card className="rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Business Snapshot</h2>
          <ReportRangeButtons />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <p className="text-gray-500 text-sm">Total Sales</p>
            <p className="text-3xl font-semibold">245,320.00</p>
            <p className="text-xs text-gray-400">From sales invoices within selected period.</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Gross Profit</p>
            <p className="text-3xl font-semibold">72,480.00</p>
            <p className="text-xs text-gray-400">Sales – cost of goods sold.</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Total Purchases</p>
            <p className="text-3xl font-semibold">158,900.00</p>
            <p className="text-xs text-gray-400">From purchase invoices within selected period.</p>
          </div>
        </div>
      </Card>

      {/* SALES REPORTS */}
      <Card className="rounded-2xl shadow-sm p-6">
        <CardHeader className="px-0 flex  justify-between items-center ">
          <CardTitle>Sales Reports</CardTitle>
          <Button className="h-10 mt-6">Export</Button>
        </CardHeader>



        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* DATE RANGE */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Date Range</label>
            <div className="flex gap-2">
              <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
              <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>

          {/* GROUP BY */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Group By</label>
            <Select defaultValue="date">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">By Date</SelectItem>
                <SelectItem value="product">By Product</SelectItem>
                <SelectItem value="customer">By Customer</SelectItem>
                <SelectItem value="category">By Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* BRANCH */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Branch</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="dhaka">Dhaka</SelectItem>
                <SelectItem value="ctg">Chattogram</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>




        {/* Table */}
        <div className="mt-6">
          <DataTable data={salesByDate} columns={salesColumns} pageSize={5} />
        </div>

        <p className="text-gray-400 text-xs mt-4">
          Supports: Sales by Date / Period, Sales by Customer, Product, Category, Salesperson, Sales Return Summary,
          Profitability.
        </p>
      </Card>

      {/* PURCHASE REPORTS */}
      <Card className="rounded-2xl shadow-sm p-6">


        <CardHeader className="px-0 flex  justify-between items-center ">
          <CardTitle>Purchase Reports</CardTitle>
          <Button className="h-10 mt-6">Export</Button>
        </CardHeader>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* DATE RANGE */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Date Range</label>
            <div className="flex gap-2">
              <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
              <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>

          {/* GROUP BY */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Group By</label>
            <Select defaultValue="date">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">By Date</SelectItem>
                <SelectItem value="product">By Product</SelectItem>
                <SelectItem value="customer">By Customer</SelectItem>
                <SelectItem value="category">By Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* BRANCH */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Branch</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="dhaka">Dhaka</SelectItem>
                <SelectItem value="ctg">Chattogram</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <DataTable data={purchasesBySupplier} columns={purchaseColumns} pageSize={5} />
        </div>

        <p className="text-gray-400 text-xs mt-4">
          Supports: Purchase by Date / Period, Supplier, Product / Category, Purchase Returns.
        </p>
      </Card>
    </div>
  );
}
