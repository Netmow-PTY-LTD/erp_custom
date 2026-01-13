import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Pencil, Wallet, Building2, TrendingUp, TrendingDown } from "lucide-react";
import { Link, useParams } from "react-router";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetStaffByIdQuery } from "@/store/features/staffs/staffApiService";
import { BackButton } from "@/components/BackButton";
import { useGetStaffAttendanceByIdQuery } from "@/store/features/attendence/attendenceApiService";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// =========================
//        TYPES
// =========================

interface AttendanceRecord {
  date: string;
  check_in: string | null;
  check_out: string | null;
  notes: string;
  status: "present" | "absent" | "late" | "leave" | string;
}

export type LeaveRequest = {
  date: string;
  type: string;
  status: "approved" | "pending" | "rejected";
};

export default function StaffDetails() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;
  const { staffId } = useParams();
  const { data } = useGetStaffByIdQuery(staffId as string);

  const staff = data?.data;

  const { data: attendanceByStaff, isFetching: isFetchingAttendance } =
    useGetStaffAttendanceByIdQuery({
      staffId: Number(staffId),
      page,
      limit,
      search,
    });

  const attendanceData: AttendanceRecord[] = attendanceByStaff?.data || [];

  const leaveRequests: LeaveRequest[] = attendanceData
    .filter((item) => item.status === "on_leave")
    .map((item) => ({
      date: item.date,
      type: item.notes || "N/A",
      status: "approved", // or "pending" based on backend logic
    }));

  const formatStatusLabel = (status: string) =>
    status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());


  const attendanceColumns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorKey: "date",
      header: "Date #",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("date")}</span>
      ),
    },
    {
      accessorKey: "check_in",
      header: "Check In",
      cell: ({ row }) => (
        <div className="font-semibold">{row.getValue("check_in")}</div>
      ),
    },
    {
      accessorKey: "check_out",
      header: "Check Out",
      cell: ({ row }) => <div>{row.getValue("check_out")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const rawStatus = row.getValue("status") as string;
        const status = rawStatus.toLowerCase();

        const color =
          status === "present"
            ? "bg-green-600"
            : status === "late"
              ? "bg-red-600"
              : status === "absent"
                ? "bg-red-600"
                : status === "on_leave"
                  ? "bg-yellow-600"
                  : status === "half_day"
                    ? "bg-blue-600"
                    : "bg-gray-500";

        return <Badge className={`${color} text-white`}>{formatStatusLabel(rawStatus)}</Badge>;
      },
    },
  ];

  const leaveRequestsColumns: ColumnDef<LeaveRequest>[] = [
    {
      accessorKey: "date",
      header: "Date #",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("date")}</span>
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
                ? "bg-red-600"
                : "bg-gray-500";
        return <Badge className={`${color} text-white`}>{status}</Badge>;
      },
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-5 mb-6">
        <h1 className="text-3xl font-semibold">
          Staff: {staff?.first_name} {staff?.last_name}
        </h1>

        <div className="flex gap-3">
          <BackButton />

          <Link to={`/dashboard/staffs/${staffId}/edit`}>
            <Button className="flex items-center gap-2">
              <Pencil className="w-4 h-4" /> Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN — PROFILE CARD */}
        <div>
          <Card className="col-span-1 shadow-md border border-gray-200 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Profile Overview
              </CardTitle>
            </CardHeader>

            <CardContent className="text-sm space-y-4 text-gray-700">
              <div className="flex justify-center mb-4">
                <img
                  src={staff?.thumb_url || "https://via.placeholder.com/150"}
                  alt="Staff"
                  className="w-32 h-32 rounded-full shadow-md object-cover border-2 border-white"
                />
              </div>

              <div className="text-xl text-gray-900">
                <b>Designation:</b> {staff?.position || "-"}
              </div>
              <div className="text-gray-600">
                <b>Employee ID:</b> {staff?.id || "-"}
              </div>

              <Separator />

              <div className="space-y-1.5">
                <div>
                  <span className="font-medium text-gray-900">Email:</span>{" "}
                  <a
                    href={`mailto:${staff?.email}`}
                    className="text-blue-600 underline"
                  >
                    {staff?.email || "-"}
                  </a>
                </div>

                <div>
                  <span className="font-medium text-gray-900">Phone:</span>{" "}
                  {staff?.phone || "-"}
                </div>

                <div>
                  <span className="font-medium text-gray-900">Department:</span>{" "}
                  {staff?.department?.name || "-"}
                </div>

                <div>
                  <span className="font-medium text-gray-900">Position:</span>{" "}
                  {staff?.position || "-"}
                </div>

                <div>
                  <span className="font-medium text-gray-900">Hire Date:</span>{" "}
                  {staff?.hire_date || "-"}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="font-medium text-gray-900">Status:</span>
                  <Badge
                    className={`px-2.5 py-0.5 rounded-md text-white ${staff?.status === "active"
                        ? "bg-green-600"
                        : "bg-gray-500"
                      }`}
                  >
                    {staff?.status || "-"}
                  </Badge>
                </div>

                <div>
                  <span className="font-medium text-gray-900">Total Salary:</span> RM{" "}
                  {staff?.salary?.toLocaleString() || "0.00"}
                </div>
              </div>

              <Separator />

              <div>
                <div className="font-medium text-gray-900 mb-1">Address</div>
                <div className="text-gray-500 italic">
                  {staff?.address || "No address provided"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN — TABS */}
        <div className="col-span-1 lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="payroll">Payroll & Salary</TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-8">
              {/* Attendance Card */}
              <Card className="shadow-md border border-gray-200 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Attendance (Last 30 Days)
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <DataTable
                    columns={attendanceColumns}
                    data={attendanceData || []}
                    pageIndex={page - 1}
                    pageSize={limit}
                    onPageChange={(newPage) => setPage(newPage + 1)}
                    totalCount={attendanceByStaff?.pagination?.total}
                    onSearch={(val) => {
                      setSearch(val);
                      setPage(1);
                    }}
                    isFetching={isFetchingAttendance}
                  />
                </CardContent>
              </Card>

              {/* Leave Requests Card */}
              <Card className="shadow-md border border-gray-200 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Leave Requests
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <DataTable columns={leaveRequestsColumns} data={leaveRequests} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* PAYROLL TAB */}
            <TabsContent value="payroll" className="space-y-6">
              {/* Salary Info */}
              <Card className="shadow-md border border-gray-200 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-blue-600" /> Salary Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-500 mb-1">Basic Salary</p>
                      <p className="text-2xl font-bold">
                        RM {staff?.basic_salary?.toLocaleString() || (staff?.salary ? (staff.salary * 0.7).toLocaleString() : "0.00")}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">Base pay before allowances</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
                      <p className="text-sm text-blue-600 mb-1">Total Salary (Gross)</p>
                      <p className="text-2xl font-bold text-blue-700">
                        RM {staff?.salary?.toLocaleString() || "0.00"}
                      </p>
                      <p className="text-xs text-blue-400 mt-2">Including all allowances</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bank Details */}
              <Card className="shadow-md border border-gray-200 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" /> Bank Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {staff?.bank_details ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Bank Name</p>
                        <p className="font-medium">{staff.bank_details.bank_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Name</p>
                        <p className="font-medium">{staff.bank_details.account_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Number</p>
                        <p className="font-medium">{staff.bank_details.account_number}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No bank details configured. <Button variant="link" className="p-0 h-auto">Add Bank Details</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Allowances & Deductions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Allowances */}
                <Card className="shadow-sm border border-gray-200 rounded-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" /> Allowances
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {staff?.allowances && staff.allowances.length > 0 ? (
                      <ul className="space-y-2">
                        {staff.allowances.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                            <span>{item.name}</span>
                            <span className="font-medium text-emerald-600">+ RM {item.amount.toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No allowances assigned.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Deductions */}
                <Card className="shadow-sm border border-gray-200 rounded-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-rose-600" /> Deductions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {staff?.deductions && staff.deductions.length > 0 ? (
                      <ul className="space-y-2">
                        {staff.deductions.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                            <span>{item.name}</span>
                            <span className="font-medium text-rose-600">- RM {item.amount.toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No deductions assigned.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
