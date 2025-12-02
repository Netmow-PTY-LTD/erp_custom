"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/dashboard/components/DataTable";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function Payslips() {
  const [selectedRun, setSelectedRun] = useState("PR-2025-01");

  // --- Payroll Runs for dropdown ---
  const payrollRuns = [
    { value: "PR-2025-01", label: "PR-2025-01 (Jan 2025)" },
    { value: "PR-2025-02", label: "PR-2025-02 (Feb 2025)" },
  ];

  // --- Payslip data ---
  const payslipData = [
    {
      empCode: "EMP-001",
      employee: "Md. Abdullah",
      gross: "8,500.00",
      net: "6,750.00",
    },
    {
      empCode: "EMP-002",
      employee: "Nur Aisyah",
      gross: "7,200.00",
      net: "5,850.00",
    },
  ];

  const columns = [
    { accessorKey: "empCode", header: "Emp Code" },
    { accessorKey: "employee", header: "Employee" },
    { accessorKey: "gross", header: "Gross" },
    { accessorKey: "net", header: "Net" },
    {
      accessorKey: "payslip",
      header: "Payslip",
      cell: () => (
        <Button size="sm" className="bg-gray-800 hover:bg-gray-900 text-white rounded-sm">
          PDF
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: () => (
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm">
          Send
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <Card className="rounded-sm border border-gray-300 dark:border-gray-700 shadow-sm">
        <CardHeader className="flex justify-between items-center border-b dark:border-gray-700 pb-3">
          <CardTitle className="text-lg font-semibold">Payslips</CardTitle>
          <Button className="bg-gray-800 hover:bg-gray-900 text-white rounded-sm">
            Bulk Download PDF
          </Button>
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

          {/* Payslip Table */}
          <DataTable columns={columns} data={payslipData} pageSize={10} />

          <p className="text-xs text-gray-400 mt-2">
            Payslip headers stored in <code>payslips</code>, breakdown in <code>payslip_lines</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
