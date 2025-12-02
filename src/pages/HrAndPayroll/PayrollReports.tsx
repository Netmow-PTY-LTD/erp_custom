"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/dashboard/components/DataTable";

export default function PayrollReports() {
  const [reportType, setReportType] = useState("byMonth");
  const [period, setPeriod] = useState("Jan 2025");

  // --- Payroll report data ---
  const reportData = [
    {
      dimension: "Sales Department",
      gross: "35,000.00",
      net: "27,800.00",
      employerContributions: "5,600.00",
    },
    {
      dimension: "HR Department",
      gross: "12,500.00",
      net: "10,200.00",
      employerContributions: "1,800.00",
    },
  ];

  const columns = [
    { accessorKey: "dimension", header: "Dimension" },
    { accessorKey: "gross", header: "Gross" },
    { accessorKey: "net", header: "Net" },
    { accessorKey: "employerContributions", header: "Employer Contributions" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6">
      <Card className="rounded-sm border border-gray-300 dark:border-gray-700 shadow-sm">
        <CardHeader className="flex justify-between items-center border-b dark:border-gray-700 pb-3">
          <CardTitle className="text-lg font-semibold">Payroll Reports</CardTitle>
        </CardHeader>

        <CardContent className="pt-4 space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Report Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Report Type
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-full rounded-sm">
                  <SelectValue placeholder="Select Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="byMonth">By Month</SelectItem>
                  <SelectItem value="byEmployee">By Employee</SelectItem>
                  <SelectItem value="byDepartment">By Department</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Period */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Period
              </label>
              <Input
                type="text"
                placeholder="e.g. Jan 2025"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full rounded-sm"
              />
            </div>
          </div>

          {/* Table */}
          <DataTable columns={columns} data={reportData} pageSize={10} />

          <p className="text-xs text-gray-400 mt-2">
            Reports aggregated from <code>payroll_run_items</code>, grouped by month, employee, or department.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
