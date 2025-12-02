"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DataTable } from "@/components/dashboard/components/DataTable";

export default function StatutoryContributions() {
  const [selectedRun, setSelectedRun] = useState("PR-2025-01");

  // --- Payroll Runs for dropdown ---
  const payrollRuns = [
    { value: "PR-2025-01", label: "PR-2025-01 (Jan 2025)" },
    { value: "PR-2025-02", label: "PR-2025-02 (Feb 2025)" },
  ];

  // --- Statutory contributions data ---
  const contributionsData = [
    {
      scheme: "EPF",
      employeeAmount: "7,200.00",
      employerAmount: "8,400.00",
      total: "15,600.00",
      status: "PENDING",
    },
    {
      scheme: "SOCSO",
      employeeAmount: "1,100.00",
      employerAmount: "1,500.00",
      total: "2,600.00",
      status: "PENDING",
    },
  ];

  const columns = [
    { accessorKey: "scheme", header: "Scheme" },
    { accessorKey: "employeeAmount", header: "Employee Amount" },
    { accessorKey: "employerAmount", header: "Employer Amount" },
    { accessorKey: "total", header: "Total" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const value = row.getValue("status");
        return (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              value === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : value === "PAID"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {value}
          </span>
        );
      },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <Card className="rounded-sm border border-gray-300 dark:border-gray-700 shadow-sm">
        <CardHeader className="flex justify-between items-center border-b dark:border-gray-700 pb-3">
          <CardTitle className="text-lg font-semibold">Statutory Contributions</CardTitle>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Payroll Run Selector */}
          <div className="max-w-xs">
            <Select value={selectedRun} onValueChange={setSelectedRun}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Payroll Run" />
              </SelectTrigger>
              <SelectContent>
                {payrollRuns.map((run) => (
                  <SelectItem key={run.value} value={run.value}>
                    {run.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contributions Table */}
          <DataTable columns={columns} data={contributionsData} pageSize={10} />

          <p className="text-xs text-gray-400 mt-2">
            Schemes stored in <code>statutory_schemes</code>, employee contributions per run in <code>payroll_statutory_contributions</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
