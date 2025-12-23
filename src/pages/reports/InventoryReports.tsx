"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useGetInventoryLowStockListQuery,
  useGetInventoryStatusQuery,
  useGetInventoryValuationQuery,
} from "@/store/features/reports/reportApiService";
import { useState } from "react";

export type LowStockRow = {
  sku: string;
  product: string;
  stock: number;
  minLevel: number;
};

export default function InventoryReports() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { data: inventoryValuation } = useGetInventoryValuationQuery();

  const totalValuation = inventoryValuation?.data?.total_Valuation || 0;
  const totalUnits = inventoryValuation?.data?.total_units || 0;

  const { data: lowStockReport } = useGetInventoryStatusQuery();

  const lowStockCount = lowStockReport?.data?.low_stock_count || 0;

  const { data: lowStockItems, isFetching: lowStockItemsIsFetching } =
    useGetInventoryLowStockListQuery({
      page,
      limit,
      search,
    });
  console.log("Low Stock Items:", lowStockItems);

  const columns: ColumnDef<LowStockRow>[] = [
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "product", header: "Product" },
    { accessorKey: "stock", header: "Stock" },
    { accessorKey: "minLevel", header: "Min Level" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold">Inventory Reports</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <CardTitle className="text-sm text-gray-500">
            Stock Valuation
          </CardTitle>
          <CardContent className="p-0 mt-2">
            <p className="text-2xl font-bold">RM {totalValuation}</p>
            <p className="text-gray-500 text-sm">Total Units: {totalUnits}</p>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardTitle className="text-sm text-gray-500">
            Low Stock Items
          </CardTitle>
          <CardContent className="p-0 mt-2">
            <p className="text-2xl font-bold">{lowStockCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock List Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Low Stock List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={lowStockItems?.data || []}
            pageIndex={page - 1}
            pageSize={limit}
            totalCount={lowStockItems?.pagination?.total || 0}
            onPageChange={(newPage) => setPage(newPage + 1)}
            onSearch={(val) => {
              setSearch(val);
              setPage(1);
            }}
            isFetching={lowStockItemsIsFetching}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import type { ColumnDef } from "@tanstack/react-table";
// import { DataTable } from "@/components/dashboard/components/DataTable";
// import { Card,  CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";

// export type InventoryRow = {
//   item: string;
//   onHand: number;
//   reserved: number;
//   available: number;
//   avgCost: number;
//   valuation: number;
//   status: "ok" | "low";
// };

// const inventoryData: InventoryRow[] = [
//   {
//     item: "Cleanroom Gloves – Size M",
//     onHand: 3200,
//     reserved: 200,
//     available: 3000,
//     avgCost: 1.8,
//     valuation: 5760,
//     status: "ok",
//   },
//   {
//     item: "Safety Helmet – White",
//     onHand: 45,
//     reserved: 10,
//     available: 35,
//     avgCost: 12.5,
//     valuation: 562.5,
//     status: "low",
//   },
// ];

// export default function InventoryReports() {
//   const [asOfDate, setAsOfDate] = useState("");
//   const [pageIndex, setPageIndex] = useState(0);

//   const columns: ColumnDef<InventoryRow>[] = [
//     { accessorKey: "item", header: "Item / Category" },
//     { accessorKey: "onHand", header: "On Hand" },
//     { accessorKey: "reserved", header: "Reserved" },
//     { accessorKey: "available", header: "Available" },
//     { accessorKey: "avgCost", header: "Avg Cost" },
//     { accessorKey: "valuation", header: "Valuation" },
//     {
//       accessorKey: "status",
//       header: "Status",
//       cell: ({ row }) => {
//         const value = row.getValue("status") as string;
//         return (
//           <span
//             className={`px-2 py-1 rounded-full text-xs font-medium ${
//               value === "ok"
//                 ? "bg-green-100 text-green-700"
//                 : "bg-yellow-100 text-yellow-700"
//             }`}
//           >
//             {value === "ok" ? "OK" : "Low"}
//           </span>
//         );
//       },
//     },
//   ];

//   return (
//     <Card className="rounded-2xl shadow-sm p-6 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <CardTitle className="text-xl font-semibold">
//           Inventory Reports
//         </CardTitle>
//         <Button variant="outline" className="px-5">
//           Export
//         </Button>
//       </div>

//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* As of Date */}
//         <div className="flex flex-col gap-2">
//           <label className="text-sm font-medium">As Of Date</label>
//           <Input
//             type="date"
//             value={asOfDate}
//             onChange={(e) => setAsOfDate(e.target.value)}
//             className="h-10"
//           />
//         </div>

//         {/* Warehouse */}
//         <div className="flex flex-col gap-2">
//           <label className="text-sm font-medium">Warehouse</label>
//           <Select defaultValue="all">
//             <SelectTrigger className="h-10">
//               <SelectValue placeholder="All Warehouses" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Warehouses</SelectItem>
//               <SelectItem value="dhaka">Dhaka Warehouse</SelectItem>
//               <SelectItem value="ctg">Chattogram Warehouse</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Report Type */}
//         <div className="flex flex-col gap-2 md:col-span-1">
//           <label className="text-sm font-medium">Report Type</label>
//           <Select defaultValue="summary">
//             <SelectTrigger className="h-10">
//               <SelectValue placeholder="Stock Summary" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="summary">Stock Summary</SelectItem>
//               <SelectItem value="movement">Movement</SelectItem>
//               <SelectItem value="aging">Aging</SelectItem>
//               <SelectItem value="lowstock">Low Stock</SelectItem>
//               <SelectItem value="valuation">Valuation</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Table */}
//       <CardContent className="p-0">
//         <DataTable
//           columns={columns}
//           data={inventoryData}
//           pageIndex={pageIndex}
//           pageSize={10}
//           onPageChange={setPageIndex}
//         />

//         <p className="text-gray-500 text-xs mt-4">
//           Uses stock transactions from inventory tables for stock summary,
//           movement, aging, low stock and valuation.
//         </p>
//       </CardContent>
//     </Card>
//   );
// }
