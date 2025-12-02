"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function SalaryStructures() {
  const [searchStructure, setSearchStructure] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState("all");

  // --- Salary Structures Data ---
  const salaryStructures = [
    {
      structure: "Standard Staff",
      frequency: "MONTHLY",
      components: "BASIC, EPF_EE, EPF_ER, SOCSO, ALLOW_TRANSPORT",
      employees: 32,
    },
    {
      structure: "Manager Grade",
      frequency: "MONTHLY",
      components: "BASIC, EPF_EE, EPF_ER, SOCSO, BONUS",
      employees: 10,
    },
  ];

  const columns = [
    { accessorKey: "structure", header: "Structure" },
    { accessorKey: "frequency", header: "Frequency" },
    { accessorKey: "components", header: "Components" },
    {
      accessorKey: "employees",
      header: "Employees",
      cell: ({ row }: { row: any }) => <span>{row.getValue("employees")}</span>,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <Card className="rounded-sm border border-gray-300 dark:border-gray-700 shadow-sm">
        <CardHeader className="flex justify-between items-center border-b dark:border-gray-700 pb-3">
          <CardTitle className="text-lg font-semibold">Salary Structures</CardTitle>
          <Button className="bg-gray-800 hover:bg-gray-900 text-white rounded-sm">
            + New Structure
          </Button>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div>
              <Input
                placeholder="Search structure"
                value={searchStructure}
                onChange={(e) => setSearchStructure(e.target.value)}
                className="max-w-xs"
              />
            </div>

            <div>
              <Select defaultValue="all" onValueChange={setFrequencyFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="MONTHLY">MONTHLY</SelectItem>
                  <SelectItem value="WEEKLY">WEEKLY</SelectItem>
                  <SelectItem value="DAILY">DAILY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <DataTable columns={columns} data={salaryStructures} pageSize={10} />

          <p className="text-xs text-gray-400 mt-2">
            Structures stored in <code>salary_structures</code>, components linked via <code>salary_structure_components</code> and employees via <code>employee_salary_structures</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
