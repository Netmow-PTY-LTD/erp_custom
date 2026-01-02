import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Link, useParams } from "react-router";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetStaffByIdQuery } from "@/store/features/staffs/staffApiService";
import { BackButton } from "@/components/BackButton";
import { useGetStaffAttendanceByIdQuery } from "@/store/features/attendence/attendenceApiService";
import { useState } from "react";

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
                    className={`px-2.5 py-0.5 rounded-md text-white ${
                      staff?.status === "active"
                        ? "bg-green-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {staff?.status || "-"}
                  </Badge>
                </div>

                <div>
                  <span className="font-medium text-gray-900">Salary:</span> RM{" "}
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

        {/* RIGHT COLUMN */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
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
        </div>
      </div>
    </div>
  );
}

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft, Pencil } from "lucide-react";
// import { Link, useParams } from "react-router";
// import { DataTable } from "@/components/dashboard/components/DataTable";
// import type { ColumnDef } from "@tanstack/react-table";
// import { useGetStaffByIdQuery } from "@/store/features/staffs/staffApiService";

// // =========================
// //        TYPES
// // =========================

// interface AttendanceRecord {
//   date: string;
//   checkIn: string | null;
//   checkOut: string | null;
//   status: "Present" | "Absent" | "Late";
// }

// interface LeaveRequest {
//   date: string;
//   type: string;
//   status: "Approved" | "Pending" | "Rejected";
// }

// const attendance: AttendanceRecord[] = [
//   {
//     date: "2025-11-23",
//     checkIn: "09:02 AM",
//     checkOut: "05:48 PM",
//     status: "Present",
//   },
//   {
//     date: "2025-11-22",
//     checkIn: "09:10 AM",
//     checkOut: "05:50 PM",
//     status: "Late",
//   },
//   { date: "2025-11-21", checkIn: null, checkOut: null, status: "Absent" },
// ];

// // Dummy Leave Requests
// const leaveRequests: LeaveRequest[] = [
//   { date: "2025-11-18", type: "Annual Leave", status: "Approved" },
//   { date: "2025-11-10", type: "Medical Leave", status: "Rejected" },
//   { date: "2025-11-05", type: "Emergency Leave", status: "Pending" },
// ];

// export default function StaffDetails() {
//   const {staffId}=useParams()

//   const {data}=useGetStaffByIdQuery(staffId as string)
//   console.log('data ==>',data)

//   const attendanceColumns: ColumnDef<AttendanceRecord>[] = [
//     {
//       accessorKey: "date",
//       header: "Date #",
//       cell: ({ row }) => (
//         <span className="font-medium">{row.getValue("date")}</span>
//       ),
//     },

//     {
//       accessorKey: "checkIn",
//       header: "Check In",
//       cell: ({ row }) => (
//         <div className="font-semibold">{row.getValue("checkIn")}</div>
//       ),
//     },

//     {
//       accessorKey: "checkOut",
//       header: "Check Out",
//       cell: ({ row }) => <div className="">{row.getValue("checkOut")}</div>,
//     },
//     {
//       accessorKey: "status",
//       header: "Status",
//       cell: ({ row }) => {
//         const status = row.getValue("status") as string;

//         const color =
//           status.toLowerCase() === "present"
//             ? "bg-green-600"
//             : status.toLowerCase() === "late"
//             ? "bg-yellow-600"
//             : status.toLowerCase() === "absent"
//             ? "bg-red-600"
//             : "bg-gray-500";

//         return <Badge className={`${color} text-white`}>{status}</Badge>;
//       },
//     },
//   ];

//   const leaveRequestsColumns: ColumnDef<LeaveRequest>[] = [
//     {
//       accessorKey: "date",
//       header: "Date #",
//       cell: ({ row }) => (
//         <span className="font-medium">{row.getValue("date")}</span>
//       ),
//     },

//     {
//       accessorKey: "type",
//       header: "Check In",
//       cell: ({ row }) => (
//         <div className="font-semibold">{row.getValue("type")}</div>
//       ),
//     },
//     {
//       accessorKey: "status",
//       header: "Status",
//       cell: ({ row }) => {
//         const status = row.getValue("status") as string;

//         const color =
//           status.toLowerCase() === "approved"
//             ? "bg-green-600"
//             : status.toLowerCase() === "pending"
//             ? "bg-yellow-600"
//             : status.toLowerCase() === "rejected"
//             ? "bg-red-600"
//             : "bg-gray-500";

//         return <Badge className={`${color} text-white`}>{status}</Badge>;
//       },
//     },
//   ];
//   return (
//     <div className="w-full">
//       {/* Header */}
//       <div className="flex flex-wrap justify-between items-center gap-5 mb-6">
//         <h1 className="text-3xl font-semibold">Staff: Sales Person</h1>

//         <div className="flex gap-3">
//           <Link to="/dashboard/staffs">
//             <Button variant="outline" className="flex items-center gap-2">
//               <ArrowLeft className="w-4 h-4" /> Back to staffs
//             </Button>
//           </Link>

//           <Link to="/dashboard/staffs/:staffId/edit">
//             <Button className="flex items-center gap-2">
//               <Pencil className="w-4 h-4" /> Edit
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* ==========================
//             LEFT COLUMN — PROFILE CARD
//         =========================== */}
//         <div>
//           <Card className="col-span-1 shadow-md border border-gray-200 rounded-xl">
//             <CardHeader>
//               <CardTitle className="text-lg font-semibold text-gray-800">
//                 Profile Overview
//               </CardTitle>
//             </CardHeader>

//             <CardContent className="text-sm space-y-4 text-gray-700">
//               <div className="flex justify-center mb-4">
//                 <img
//                   src={"https://i.ibb.co.com/YBRMcVkG/testimonial-15.jpg"}
//                   alt="Staff"
//                   className="w-32 h-32 rounded-full shadow-md object-cover border-2 border-white"
//                 />
//               </div>
//               <div className="text-xl text-gray-900">
//                 <b>Designation:</b> Sales Person
//               </div>
//               <div className="text-gray-600"><b>Employee ID:</b> EMP-SALES-001</div>

//               <Separator />

//               <div className="space-y-1.5">
//                 <div>
//                   <span className="font-medium text-gray-900">Email:</span>{" "}
//                   <a
//                     href="mailto:sales@example.com"
//                     className="text-blue-600 underline"
//                   >
//                     sales@example.com
//                   </a>
//                 </div>

//                 <div>
//                   <span className="font-medium text-gray-900">Phone:</span>{" "}
//                   0123456789
//                 </div>

//                 <div>
//                   <span className="font-medium text-gray-900">Department:</span>{" "}
//                   —
//                 </div>

//                 <div>
//                   <span className="font-medium text-gray-900">Position:</span>{" "}
//                   Sales Representative
//                 </div>

//                 <div>
//                   <span className="font-medium text-gray-900">Hire Date:</span>{" "}
//                   2025-11-21
//                 </div>

//                 <div className="flex items-center gap-2 pt-1">
//                   <span className="font-medium text-gray-900">Status:</span>
//                   <Badge className="bg-green-600 px-2.5 py-0.5 rounded-md text-white">
//                     Active
//                   </Badge>
//                 </div>

//                 <div>
//                   <span className="font-medium text-gray-900">Salary:</span> RM
//                   0.00
//                 </div>
//               </div>

//               <Separator />

//               <div>
//                 <div className="font-medium text-gray-900 mb-1">Address</div>
//                 <div className="text-gray-500 italic">No address provided</div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* ==========================
//               RIGHT COLUMN
//         =========================== */}
//         <div className="col-span-1 lg:col-span-2 space-y-8">
//           {/* Attendance Card */}
//           <Card className="shadow-md border border-gray-200 rounded-xl">
//             <CardHeader>
//               <CardTitle className="text-lg font-semibold text-gray-800">
//                 Attendance (Last 30 Days)
//               </CardTitle>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <DataTable columns={attendanceColumns} data={attendance} />
//             </CardContent>
//           </Card>

//           {/* LEAVE REQUESTS CARD */}
//           <Card className="shadow-md border border-gray-200 rounded-xl">
//             <CardHeader>
//               <CardTitle className="text-lg font-semibold text-gray-800">
//                 Leave Requests
//               </CardTitle>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <DataTable columns={leaveRequestsColumns} data={leaveRequests} />
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
