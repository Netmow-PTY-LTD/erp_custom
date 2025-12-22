/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function HRPayrollEmployeeMaster() {
  const [search, setSearch] = useState("");

  const employees = [
    {
      empCode: "EMP-001",
      name: "Md. Abdullah",
      department: "Sales",
      designation: "Head of Sales",
      joinDate: "2021-01-16",
      status: "ACTIVE",
    },
  ];

  const columns = [
    { accessorKey: "empCode", header: "Emp Code" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "department", header: "Department" },
    { accessorKey: "designation", header: "Designation" },
    { accessorKey: "joinDate", header: "Join Date" },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const value = row.getValue("status");
        return (
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${
              value === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {value}
          </span>
        );
      },
    },

    {
      accessorKey: "actions",
      header: "Actions",
      cell: () => (
        <Button
          variant="outline"
          size="sm"
          className="rounded-sm border-gray-300 dark:border-gray-700"
        >
          View Payroll
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-6">

      {/* HR Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Employees */}
        <Card className="rounded-sm border shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Employees</p>
            <p className="text-2xl font-bold mt-1">58</p>
          </CardContent>
        </Card>

        {/* Payroll Cost */}
        <Card className="rounded-sm border shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Payroll Cost (This Month)</p>
            <p className="text-2xl font-bold mt-1">95,200.00</p>
          </CardContent>
        </Card>

        {/* Pending Leave Requests */}
        <Card className="rounded-sm border shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Pending Leave Requests</p>
            <p className="text-2xl font-bold mt-1">7</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Master */}
      <Card className="rounded-sm border border-gray-300 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-3 border-b dark:border-gray-700 flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Employee Master</CardTitle>
          <Button className="rounded-sm bg-gray-800 hover:bg-gray-900 text-white">
            + New Employee
          </Button>
        </CardHeader>

        <CardContent className="pt-4 space-y-5">

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Search Employee</label>
              <Input
                placeholder="Name / code / email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Status</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Department</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Tech">Tech</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Data Table */}
          <DataTable columns={columns} data={employees} pageSize={10} />

          <p className="text-xs text-gray-400 mt-2">
            Employee personal & contact details stored in <code>employees</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
