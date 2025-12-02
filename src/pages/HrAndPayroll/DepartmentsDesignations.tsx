import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/dashboard/components/DataTable";

export default function DepartmentsDesignations() {
  const [searchDept, setSearchDept] = useState("");

  // --- Departments data ---
  const departments = [
    {
      department: "Sales",
      head: "Md. Abdullah",
      employees: 12,
      status: "ACTIVE",
    },
    {
      department: "HR",
      head: "Nur Aisyah",
      employees: 4,
      status: "ACTIVE",
    },
  ];

  const departmentColumns = [
    { accessorKey: "department", header: "Department" },
    { accessorKey: "head", header: "Head" },
    {
      accessorKey: "employees",
      header: "Employees",
      cell: ({ row }: { row: any }) => (
        <span>{row.getValue("employees")}</span>
      ),
    },
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

  // --- Designations data ---
  const designations = [
    {
      designation: "Head of Sales",
      department: "Sales",
      grade: "M5",
      status: "ACTIVE",
    },
    {
      designation: "Sales Executive",
      department: "Sales",
      grade: "E2",
      status: "ACTIVE",
    },
  ];

  const designationColumns = [
    { accessorKey: "designation", header: "Designation" },
    { accessorKey: "department", header: "Department" },
    { accessorKey: "grade", header: "Grade" },
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

      {/* Departments */}
      <Card className="rounded-sm border border-gray-300 dark:border-gray-700 shadow-sm">
        <CardHeader className="flex justify-between items-center border-b dark:border-gray-700 pb-3">
          <CardTitle className="text-lg font-semibold">
            Departments
          </CardTitle>
          <Button className="bg-gray-800 hover:bg-gray-900 text-white rounded-sm">
            + New Department
          </Button>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Search Bar */}
          <div>
            <Input
              placeholder="Search department"
              value={searchDept}
              onChange={(e) => setSearchDept(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {/* Table */}
          <DataTable
            columns={departmentColumns}
            data={departments}
            pageSize={10}
          />

          <p className="text-xs text-gray-400">
            Departments stored in <code>departments</code>.
          </p>
        </CardContent>
      </Card>

      {/* Designations */}
      <Card className="rounded-sm border border-gray-300 dark:border-gray-700 shadow-sm">
        <CardHeader className="border-b dark:border-gray-700 pb-3">
          <CardTitle className="text-lg font-semibold">
            Designations
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-4">
          <DataTable
            columns={designationColumns}
            data={designations}
            pageSize={10}
          />

          <p className="text-xs text-gray-400 mt-2">
            Designations stored in <code>designations</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
