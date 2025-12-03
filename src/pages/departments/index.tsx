import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddDepartmentForm from "@/components/departments/AddDepartmentForm";
import EditDepartmentForm from "@/components/departments/EditDepartmentForm";

import { z } from "zod";
//import { Link } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { useGetAllDepartmentsQuery } from "@/store/features/admin/departmentApiService";
import type { Department } from "@/types/types";

export const DepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  description: z.string().min(1, "Description is required"),
});

export type DepartmentFormValues = z.infer<typeof DepartmentSchema>;

export default function DepartmentsPage() {

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [departmentId, setDepartmentId] = useState<number | null>(null);

  const {data: fetchedDepartments} = useGetAllDepartmentsQuery();

  console.log("Fetched Departments: ", fetchedDepartments);

  const departments = fetchedDepartments?.data || [];

  const columns: ColumnDef<Department>[] = [
    {
      accessorKey: "name",
      header: "Department",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setDepartmentId(row.original.id);
              setEditOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => alert(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Departments</h1>

        <div className="flex gap-4">
          <Button onClick={() => setAddOpen(true)}>+ Add Department</Button>
          {/* <Link to="/dashboard/staffs/add">
            <Button variant="outline">+ Add Staff</Button>
          </Link> */}
        </div>
      </div>

      <DataTable columns={columns} data={departments} />

      {/* Add Sheet */}
      <AddDepartmentForm
        open={addOpen}
        onOpenChange={setAddOpen}
      />

      {/* Edit Sheet */}
      <EditDepartmentForm
        open={editOpen}
        onOpenChange={setEditOpen}
        departmentId={departmentId}
      />
    </div>
  );
}
