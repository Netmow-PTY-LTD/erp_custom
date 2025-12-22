import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import AddNewRoleForm from "@/components/roles/AddRoleForm";
import { useState } from "react";
import EditRoleForm from "@/components/roles/EditRoleForm";
import { useGetAllRolesQuery } from "@/store/features/role/roleApiService";
import { Link } from "react-router";

interface Role {
  id: number;
  name: string;
  displayName: string;
  description: string;
  status: string;
}

const roles: Role[] = [
  {
    id: 1,
    name: "Admin",
    displayName: "System Administrator",
    description: "Full system access",
    status: "Active",
  },
  {
    id: 2,
    name: "Sales",
    displayName: "Sales Executive",
    description: "Manage sales",
    status: "Active",
  },
  {
    id: 3,
    name: "Store",
    displayName: "Store keeper",
    description: "Store access",
    status: "Active",
  },
];

export default function Roles() {
  const [open, setOpen] = useState<boolean>(false);
  const [openEditForm, setOpenEditForm] = useState<boolean>(false);
  const { data } = useGetAllRolesQuery();

  console.log('data of roles ==>', data)



  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("id")}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Role",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "displayName",
      header: "Display Name",
      cell: ({ row }) => (
        <div>
          <div className="">{row.getValue("displayName")}</div>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div className="">{row.getValue("description")}</div>,
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        const color =
          status.toLowerCase() === "active"
            ? "bg-green-400"
            : status.toLowerCase() === "inactive"
              ? "bg-blue-500"
              : "bg-gray-500";

        return <Badge className={`${color} capitalize`}>{status}</Badge>;
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const route = row.original;
        return (
          <div className="flex items-center gap-2">
            {/* <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setOpenEditForm(true);
              }}
            >
              Edit
            </Button> */}
            <Link to={`/dashboard/permissions/${route.id}/edit`} >
              <Button
                size="sm"
                variant="outline"
              >
                Edit
              </Button>
            </Link>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                alert(route.id);
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Existing Roles</h1>
        <AddNewRoleForm open={open} setOpen={setOpen} />
      </div>

      {/* Roles List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={roles} />
        </CardContent>
      </Card>
      <EditRoleForm open={openEditForm} setOpen={setOpenEditForm} />
    </div>
  );
}
