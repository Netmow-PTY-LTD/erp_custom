import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, Check, MoreHorizontal, X } from "lucide-react";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type LeaveRequest = {
  id: number;
  employeeName: string;
  employeeId: string;
  type: "vacation" | "sick" | "personal";
  startDate: string; // ISO string or YYYY-MM-DD
  endDate: string; // ISO string or YYYY-MM-DD
  status: "Approved" | "Pending";
  approvedBy: string | null;
  reason: string;
};

const leaveRequests: LeaveRequest[] = [
  {
    id: 1,
    employeeName: "Aisha Rahman",
    employeeId: "EMP009",
    type: "vacation",
    startDate: "2025-10-05",
    endDate: "2025-10-12",
    status: "Approved",
    approvedBy: "Siti Nurhaliza",
    reason: "Family vacation to Langkawi",
  },
  {
    id: 2,
    employeeName: "Raj Kumar",
    employeeId: "EMP003",
    type: "sick",
    startDate: "2025-10-01",
    endDate: "2025-10-03",
    status: "Approved",
    approvedBy: "Siti Nurhaliza",
    reason: "Fever and flu symptoms",
  },
  {
    id: 3,
    employeeName: "Fatimah Ali",
    employeeId: "EMP005",
    type: "personal",
    startDate: "2025-10-15",
    endDate: "2025-10-15",
    status: "Pending",
    approvedBy: null,
    reason: "Personal appointment",
  },
  {
    id: 4,
    employeeName: "Priya Nair",
    employeeId: "EMP007",
    type: "vacation",
    startDate: "2025-10-20",
    endDate: "2025-10-25",
    status: "Pending",
    approvedBy: null,
    reason: "Hari Raya holidays",
  },
];

export default function LeavesManagement() {
  const leaveRequestsColumns: ColumnDef<LeaveRequest>[] = [
    {
      accessorKey: "employeeName",
      header: "Employee #",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold">{row.getValue("employeeName")}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.employeeId}
          </div>
        </div>
      ),
    },

    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="font-semibold">{row.getValue("type")}</div>
      ),
    },

    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => <div className="">{row.getValue("startDate")}</div>,
    },

    {
      accessorKey: "endDate",
      header: "End Date",
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        const color =
          status.toLowerCase() === "approved"
            ? "bg-green-600"
            : status.toLowerCase() === "pending"
            ? "bg-yellow-600"
            : status.toLowerCase() === "rejected"
            ? "bg-purple-600"
            : "bg-gray-500";

        return <Badge className={`${color} text-white`}>{status}</Badge>;
      },
    },

    {
      accessorKey: "approvedBy",
      header: "Approved By",
      cell: ({ row }) => <div className="">{row.getValue("approvedBy")}</div>,
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => <div className="">{row.getValue("reason")}</div>,
    },

     {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => alert(`Approved with id ${item.id}`)}
              >
                <Check className="h-4 w-4" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-1 cursor-pointer" onClick={() => alert(`Rejected with id ${item.id}`)}>
                <X className="h-4 w-4" />
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-5 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Leaves Management</h1>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/dashboard/staffs">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Back to Staffs
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardContent>
          <DataTable columns={leaveRequestsColumns} data={leaveRequests} />
        </CardContent>
      </Card>
    </div>
  );
}
