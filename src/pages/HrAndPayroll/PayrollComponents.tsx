"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function PayrollComponents() {
  const [searchComponent, setSearchComponent] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // --- Payroll Components Data ---
  const payrollComponents = [
    {
      name: "Basic Salary",
      code: "BASIC",
      type: "ALLOWANCE",
      calculation: "Fixed",
      taxable: "Yes",
      status: "ACTIVE",
    },
    {
      name: "EPF Employee",
      code: "EPF_EE",
      type: "DEDUCTION",
      calculation: "% of BASIC",
      taxable: "No",
      status: "ACTIVE",
    },
  ];

  const payrollColumns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "code", header: "Code" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "calculation", header: "Calculation" },
    { accessorKey: "taxable", header: "Taxable" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const value = row.getValue("status");
        const color =
          value === "ACTIVE"
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-700";
        return <span className={`px-2 py-1 text-xs rounded-full ${color}`}>{value}</span>;
      },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <Card className="rounded-sm border border-gray-300 dark:border-gray-700 shadow-sm">
        <CardHeader className="flex justify-between items-center border-b dark:border-gray-700 pb-3">
          <CardTitle className="text-lg font-semibold">Payroll Components</CardTitle>
          <Button className="bg-gray-800 hover:bg-gray-900 text-white rounded-sm">
            + New Component
          </Button>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div>
              <Input
                placeholder="Search Component"
                value={searchComponent}
                onChange={(e) => setSearchComponent(e.target.value)}
                className="max-w-xs"
              />
            </div>

            <div>
              <Select defaultValue="all" onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="ALLOWANCE">ALLOWANCE</SelectItem>
                  <SelectItem value="DEDUCTION">DEDUCTION</SelectItem>
                  <SelectItem value="CONTRIBUTION">CONTRIBUTION</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <DataTable columns={payrollColumns} data={payrollComponents} pageSize={10} />

          <p className="text-xs text-gray-400 mt-2">
            Payroll components stored in <code>payroll_components</code> (allowances, deductions, contributions).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
