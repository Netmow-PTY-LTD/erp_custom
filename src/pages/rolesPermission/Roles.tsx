"use client";

import { useState } from "react";
import { Link } from "react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import AddNewRoleForm from "@/components/roles/AddRoleForm";
import { useDeleteRoleMutation, useGetAllRolesQuery } from "@/store/features/role/roleApiService";
import type { Role } from "@/types/users.types";
import { toast } from "sonner";
import { useAppSelector } from "@/store/store";
import { RolePermission } from "@/config/permissions";


// Simple confirmation modal
function ConfirmModal({
  open,
  onClose,
  onConfirm,
  message,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl w-96">
        <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}





export default function Roles() {
  // Form modal states
  const [open, setOpen] = useState<boolean>(false);
  // const [openEditForm, setOpenEditForm] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectRoleId, setSelectRoleId] = useState<string | number | null>(null);
  // Pagination & Search states
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const limit = 10;


  const userPermissions = useAppSelector((state) => state.auth.user?.role.permissions || []);
  const canDeleteRole = userPermissions.includes(RolePermission.DELETE_ROLES);




  // Fetch roles from backend using RTK Query
  const { data, isFetching } = useGetAllRolesQuery({
    page,
    limit,
    search,
  });

  // Safe fallback
  const rolelist = data?.data || [];
  const pagination = data?.pagination || {
    total: 0,
    page: 1,
    limit,
    totalPage: 1,
  };

  const [deleteRole] = useDeleteRoleMutation()




  const handleDeleteClick = (id: string | number) => {
    setSelectRoleId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!canDeleteRole) {
      toast.error("You don't have permission to delete roles.");
      setModalOpen(false);
      return;
    }
    if (!selectRoleId) return;

    try {
      await deleteRole(selectRoleId).unwrap();
      toast.success("Supplier deleted successfully");
    } catch (error) {
      toast.error("Failed to delete supplier");
      console.error(error);
    } finally {
      setModalOpen(false);
      setSelectRoleId(null);
    }
  };








  // Columns for TanStack Table
  const roleColumns: ColumnDef<Role>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span className="font-medium">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <span className="font-medium">{row.getValue("role")}</span>,
    },
    {
      accessorKey: "display_name",
      header: "Display Name",
      cell: ({ row }) => <div>{row.getValue("display_name")}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div>{row.getValue("description")}</div>,
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
        const role = row.original;
        return (
          <div className="flex items-center gap-2">
            <Link to={`/dashboard/permissions/${role.id}/edit`}>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </Link>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeleteClick(role.id)}
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
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Existing Roles</h1>
        <AddNewRoleForm open={open} setOpen={setOpen} />
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Available Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={roleColumns}
            data={rolelist}
            pageIndex={page - 1}
            pageSize={limit}
            totalCount={pagination.total}
            onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
            onSearch={(value) => {
              setSearch(value);
              setPage(1);
            }}
            isFetching={isFetching}
          />
        </CardContent>
      </Card>



      {/* Delete confirmation modal */}
      <ConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this Role? This action cannot be undone."
      />
      {/* Edit Role Modal */}
      {/* <EditRoleForm open={openEditForm} setOpen={setOpenEditForm} /> */}


    </div>
  );
}
