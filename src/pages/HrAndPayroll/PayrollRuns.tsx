"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function PayrollRuns() {
  const [searchPeriod, setSearchPeriod] = useState("");
  const [, setStatusFilter] = useState("all");

  // --- Payroll Runs Data ---
  const payrollRuns = [
    {
      runCode: "PR-2025-01",
      period: "Jan 2025",
      employees: 58,
      gross: "98,500.00",
      net: "79,200.00",
      status: "CALCULATED",
    },
    {
      runCode: "PR-2025-02",
      period: "Feb 2025",
      employees: 60,
      gross: "102,000.00",
      net: "82,500.00",
      status: "PENDING",
    },
  ];

  const columns = [
    { accessorKey: "runCode", header: "Run Code" },
    { accessorKey: "period", header: "Period" },
    { accessorKey: "employees", header: "Employees" },
    { accessorKey: "gross", header: "Gross" },
    { accessorKey: "net", header: "Net" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const value = row.getValue("status");
        const color =
          value === "CALCULATED"
            ? "bg-green-100 text-green-700"
            : value === "PENDING"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-200 text-gray-700";
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${color}`}>{value}</span>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: () => (
        <div className="flex gap-2">
          <Button size="sm" className="bg-gray-800 hover:bg-gray-900 text-white rounded-sm">
            Review
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm">
            Approve
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <Card className="rounded-sm border border-gray-300 dark:border-gray-700 shadow-sm">
        <CardHeader className="flex justify-between items-center border-b dark:border-gray-700 pb-3">
          <CardTitle className="text-lg font-semibold">Payroll Runs</CardTitle>
          <Button className="bg-gray-800 hover:bg-gray-900 text-white rounded-sm">
            + New Payroll Run
          </Button>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div>
              <Input
                placeholder="Search period"
                value={searchPeriod}
                onChange={(e) => setSearchPeriod(e.target.value)}
                className="max-w-xs"
              />
            </div>

            <div>
              <Select defaultValue="all" onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="CALCULATED">CALCULATED</SelectItem>
                  <SelectItem value="APPROVED">APPROVED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <DataTable columns={columns} data={payrollRuns} pageSize={10} />

          <p className="text-xs text-gray-400 mt-2">
            Payroll runs stored in <code>payroll_runs</code>, employee-level amounts in <code>payroll_run_items</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
