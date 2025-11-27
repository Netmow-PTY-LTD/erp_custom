import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddDepartmentForm from "@/components/departments/AddDepartmentForm";
import EditDepartmentForm from "@/components/departments/EditDepartmentForm";

import { z } from "zod";
import { Link } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/components/DataTable";

export const DepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  description: z.string().min(1, "Description is required"),
});

export type DepartmentFormValues = z.infer<typeof DepartmentSchema>;

export interface Department {
  id: number;
  name: string;
  description: string;
  staffCount: number;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: "Finance",
      description: "Accounting and financial management",
      staffCount: 1,
    },
    {
      id: 2,
      name: "IT",
      description: "Information technology and systems",
      staffCount: 1,
    },
    {
      id: 3,
      name: "Management",
      description: "Administration and oversight",
      staffCount: 2,
    },
    {
      id: 4,
      name: "Operations",
      description: "Order processing and fulfillment",
      staffCount: 2,
    },
    {
      id: 5,
      name: "Sales",
      description: "Sales and customer relations team",
      staffCount: 3,
    },
    {
      id: 6,
      name: "Test",
      description: "This is Test Department",
      staffCount: 0,
    },
    {
      id: 7,
      name: "Warehouse",
      description: "Inventory and logistics",
      staffCount: 2,
    },
  ]);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );

  const deleteDepartment = (id: number) => {
    setDepartments(departments.filter((d) => d.id !== id));
  };

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
      accessorKey: "staffCount",
      header: "Staff Count",
      cell: ({ row }) => (
        <span className="text-sm bg-gray-600 text-white px-2 py-1 rounded">
          {row.getValue("staffCount")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setEditingDepartment(row.original);
              setEditOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteDepartment(row.original.id)}
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
          <Link to="/dashboard/staffs/add">
            <Button variant="outline">+ Add Staff</Button>
          </Link>
        </div>
      </div>

             <DataTable columns={columns} data={departments} />


      {/* Add Sheet */}
      <AddDepartmentForm
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={(data) => {
          setDepartments([
            ...departments,
            { id: departments.length + 1, ...data, staffCount: 0 },
          ]);
        }}
      />

      {/* Edit Sheet */}
      <EditDepartmentForm
        open={editOpen}
        onOpenChange={setEditOpen}
        department={editingDepartment}
        onSave={(updated) =>
          setDepartments(
            departments.map((d) => (d.id === updated.id ? updated : d))
          )
        }
      />
    </div>
  );
}
