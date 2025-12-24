import { DataTable } from "@/components/dashboard/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllUsersQuery } from "@/store/features/users/usersApiService";
import type { User } from "@/types/users.types";

import type { ColumnDef } from "@tanstack/react-table";
import { Users, UserPlus, UserCheck, Eye, Pencil } from "lucide-react";

import { useState } from "react";
import { Link } from "react-router";

export default function UsersList() {
  const [pageIndex, setPageIndex] = useState(0);
  const { data: usersData } = useGetAllUsersQuery();

  const users = (usersData?.data as User[]) || [];

  // -------------------- DYNAMIC STATS --------------------
  const totalUsers = users.length;
  const activeUsers = users.filter(
    (u) => u.status?.toLowerCase() === "active"
  ).length;
  const adminUsers = users.filter(
    (u) => u.role?.display_name === "Admin"
  ).length;

  const stats = [
    {
      label: "Active Users",
      value: activeUsers,
      color: "bg-green-600",
      icon: <UserCheck className="w-10 h-10 opacity-80" />,
    },
    {
      label: "Total Users",
      value: totalUsers,
      color: "bg-blue-600",
      icon: <Users className="w-10 h-10 opacity-80" />,
    },
    {
      label: "Admins",
      value: adminUsers,
      color: "bg-purple-600",
      icon: <UserPlus className="w-10 h-10 opacity-80" />,
    },
  ];

  // -------------------- TABLE COLUMNS --------------------
  const userColumns: ColumnDef<User>[] = [
    { accessorKey: "id", header: "User ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role.name", header: "Role" },

    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => {
    //     const status = row.getValue("status") as string;
    //     const bgColor = status.toLowerCase() === "active" ? "bg-green-500" : "bg-red-500";
    //     return <span className={`py-1 px-2 rounded-full text-xs text-white font-medium ${bgColor}`}>{status}</span>;
    //   },
    // },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id;
        console.log("User ID:", id);

        return (
          <div className="flex items-center gap-2">
            <Link to={`/dashboard/users/${id}`}>
              <Button variant="outline" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>

            <Link to={`/dashboard/users/${id}/edit`}>
              <Button variant="secondary" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">All Users</h2>

        <Link to="/dashboard/users/add">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-500">
            <UserPlus size={18} />
            Add User
          </button>
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className={`${item.color} text-white rounded-xl p-5 flex justify-between items-center shadow`}
          >
            <div>
              <h3 className="text-3xl font-bold">{item.value}</h3>
              <p className="text-sm mt-1 opacity-90">{item.label}</p>
            </div>
            {item.icon}
          </div>
        ))}
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={userColumns}
            data={users}
            pageIndex={pageIndex}
            pageSize={10}
            onPageChange={setPageIndex}
          />
        </CardContent>
      </Card>
    </div>
  );
}
