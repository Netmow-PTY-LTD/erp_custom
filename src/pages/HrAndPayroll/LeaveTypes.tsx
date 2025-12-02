"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/dashboard/components/DataTable";

export default function LeaveTypes() {
  const [searchLeave, setSearchLeave] = useState("");

  // --- Leave Types data ---
  const leaveTypes = [
    { name: "Annual Leave", code: "AL", annualDays: 14, carryForward: "Yes", status: "ACTIVE" },
    { name: "Sick Leave", code: "SL", annualDays: 10, carryForward: "No", status: "ACTIVE" },
  ];

  const leaveColumns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "code", header: "Code" },
    { accessorKey: "annualDays", header: "Annual Days" },
    { accessorKey: "carryForward", header: "Carry Forward" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const value = row.getValue("status");
        return (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              value === "ACTIVE"
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
          <CardTitle className="text-lg font-semibold">Leave Types</CardTitle>
          <Button className="bg-gray-800 hover:bg-gray-900 text-white rounded-sm">
            + New Leave Type
          </Button>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Search Bar */}
          <div>
            <Input
              placeholder="Search leave type"
              value={searchLeave}
              onChange={(e) => setSearchLeave(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {/* Table */}
          <DataTable columns={leaveColumns} data={leaveTypes} pageSize={10} />

          <p className="text-xs text-gray-400 mt-2">
            Leave types stored in <code>leave_types</code> with rules for carry forward and annual days.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
