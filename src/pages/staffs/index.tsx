import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { staffs } from "@/data/data";
import type { Staff } from "@/types/types";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarX2, Clock, PlusCircle, Users, XCircle } from "lucide-react";
import { Link } from "react-router";

const stats = [
  {
    label: "Total Staffs",
    value: 16,
    color: "bg-blue-600",
    icon: <Users className="w-10 h-10 opacity-80" />,
  },
  {
    label: "Active Staffs",
    value: 15,
    color: "bg-green-600",
    icon: <Clock className="w-10 h-10 opacity-80" />,
  },
  {
    label: "On Leave",
    value: 8,
    color: "bg-yellow-400",
    icon: <CalendarX2 className="w-10 h-10 opacity-80" />,
  },
  {
    label: "Inactive Staffs",
    value: 0,
    color: "bg-red-500",
    icon: <XCircle className="w-10 h-10 opacity-80" />,
  },
];
export default function Staffs() {
  const staffColumns: ColumnDef<Staff>[] = [
    {
      accessorKey: "employeeId",
      header: "Employee ID #",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("employeeId")}</span>
      ),
    },

    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-semibold">{row.getValue("name")}</div>
      ),
    },

    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
    },

    {
      accessorKey: "department",
      header: "Department",
    },

    {
      accessorKey: "position",
      header: "Position",
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        const color =
          status === "Active"
            ? "bg-green-600"
            : status === "Pending"
            ? "bg-yellow-600"
            : status === "Confirmed"
            ? "bg-blue-600"
            : status === "Processing"
            ? "bg-orange-600"
            : status === "Shipped"
            ? "bg-purple-600"
            : "bg-gray-500";

        return <Badge className={`${color} text-white`}>{status}</Badge>;
      },
    },

    {
      accessorKey: "hireDate",
      header: "Hire Date",
      cell: ({ row }) => <div className="">{row.getValue("hireDate")}</div>,
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex gap-2">
            <Link to={`/dashboard/staffs/${item.id}`}>
              <Button size="sm" variant="outline-info">
                View
              </Button>
            </Link>
            <Link to={`/dashboard/staffs/${item.id}/edit`}>
              <Button size="sm" variant="outline-neutral">
                Edit
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-5 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Staffs Management</h1>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/dashboard/staffs/add">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-500">
              <PlusCircle size={18} />
              Add Staff
            </button>
          </Link>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
      <Card>
        <CardHeader>
          <CardTitle>All Staffs</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={staffColumns} data={staffs} />
        </CardContent>
      </Card>
    </div>
  );
}
