"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DataTable } from "@/components/dashboard/components/DataTable";

export default function LeaveRequests() {
  const [searchEmployee, setSearchEmployee] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // --- Leave Requests Data ---
  const leaveRequests = [
    {
      reqNo: "LR-2025-015",
      employee: "John Lim",
      type: "AL",
      from: "2025-01-20",
      to: "2025-01-22",
      days: 3,
      status: "PENDING",
    },
    {
      reqNo: "LR-2025-016",
      employee: "Md. Abdullah",
      type: "SL",
      from: "2025-01-18",
      to: "2025-01-18",
      days: 1,
      status: "APPROVED",
    },
  ];

  const leaveColumns = [
    { accessorKey: "reqNo", header: "Req No" },
    { accessorKey: "employee", header: "Employee" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "from", header: "From" },
    { accessorKey: "to", header: "To" },
    { accessorKey: "days", header: "Days" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const value = row.getValue("status");
        const color =
          value === "PENDING"
            ? "bg-yellow-100 text-yellow-700"
            : value === "APPROVED"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700";
        return <span className={`px-2 py-1 text-xs rounded-full ${color}`}>{value}</span>;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        row.getValue("status") === "PENDING" ? (
          <div className="flex gap-2">
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Approve</Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">Reject</Button>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">N/A</span>
        )
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <Card className="rounded-sm border border-gray-300 dark:border-gray-700 shadow-sm">
        <CardHeader className="flex justify-between items-center border-b dark:border-gray-700 pb-3">
          <CardTitle className="text-lg font-semibold">Leave Requests</CardTitle>
          <Button className="bg-gray-800 hover:bg-gray-900 text-white rounded-sm">
            + New Leave Request
          </Button>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div>
              <Input
                placeholder="Search Employee"
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
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
                  <SelectItem value="APPROVED">APPROVED</SelectItem>
                  <SelectItem value="REJECTED">REJECTED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <DataTable columns={leaveColumns} data={leaveRequests} pageSize={10} />

          <p className="text-xs text-gray-400 mt-2">
            Leave requests stored in <code>leave_requests</code> with approval workflow.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
