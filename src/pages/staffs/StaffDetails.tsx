import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { Link } from "react-router";

// =========================
//        TYPES
// =========================

interface AttendanceRecord {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: "Present" | "Absent" | "Late";
}

interface LeaveRequest {
  date: string;
  type: string;
  status: "Approved" | "Pending" | "Rejected";
}

const attendanceStatusColor: Record<AttendanceRecord["status"], string> = {
  Present: "bg-green-600",
  Absent: "bg-red-600",
  Late: "bg-yellow-500",
};


export default function StaffDetails() {
   const attendance: AttendanceRecord[] = [
    { date: "2025-11-23", checkIn: "09:02 AM", checkOut: "05:48 PM", status: "Present" },
    { date: "2025-11-22", checkIn: "09:10 AM", checkOut: "05:50 PM", status: "Late" },
    { date: "2025-11-21", checkIn: null, checkOut: null, status: "Absent" },
  ];

  // Dummy Leave Requests
  const leaveRequests: LeaveRequest[] = [
    { date: "2025-11-18", type: "Annual Leave", status: "Approved" },
    { date: "2025-11-10", type: "Medical Leave", status: "Rejected" },
    { date: "2025-11-05", type: "Emergency Leave", status: "Pending" },
  ];


  const leaveStatusColor = {
    Approved: "bg-green-600",
    Pending: "bg-yellow-500",
    Rejected: "bg-red-600",
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Staff: Sales Person</h1>

        <div className="flex gap-3">
          <Link to="/dashboard/staffs">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to staffs
            </Button>
          </Link>

         <Link to="/dashboard/staffs/:staffId/edit">
             <Button className="flex items-center gap-2">
            <Pencil className="w-4 h-4" /> Edit
          </Button>
         </Link>
        </div>
      </div>

      {/* Layout */}
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ==========================
            LEFT COLUMN — PROFILE CARD
        =========================== */}
        <Card className="col-span-1 shadow-md border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Profile Overview
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm space-y-4 text-gray-700">
            <div className="text-xl font-medium text-gray-900">
              Sales Person
            </div>
            <div className="text-gray-600">Employee ID: EMP-SALES-001</div>

            <Separator />

            <div className="space-y-1.5">
              <div>
                <span className="font-medium text-gray-900">Email:</span>{" "}
                <a
                  href="mailto:sales@example.com"
                  className="text-blue-600 underline"
                >
                  sales@example.com
                </a>
              </div>

              <div>
                <span className="font-medium text-gray-900">Phone:</span>{" "}
                0123456789
              </div>

              <div>
                <span className="font-medium text-gray-900">Department:</span> —
              </div>

              <div>
                <span className="font-medium text-gray-900">Position:</span>{" "}
                Sales Representative
              </div>

              <div>
                <span className="font-medium text-gray-900">Hire Date:</span>{" "}
                2025-11-21
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="font-medium text-gray-900">Status:</span>
                <Badge className="bg-green-600 px-2.5 py-0.5 rounded-md text-white">
                  Active
                </Badge>
              </div>

              <div>
                <span className="font-medium text-gray-900">Salary:</span> RM
                0.00
              </div>
            </div>

            <Separator />

            <div>
              <div className="font-medium text-gray-900 mb-1">Address</div>
              <div className="text-gray-500 italic">No address provided</div>
            </div>
          </CardContent>
        </Card>

        {/* ==========================
              RIGHT COLUMN
        =========================== */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          {/* Attendance Card */}
         <Card className="shadow-md border border-gray-200 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Attendance (Last 30 Days)
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {attendance.map((row, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 border transition"
                >
                  <div className="w-1/4 font-medium text-gray-800">{row.date}</div>

                  <div className="w-1/4 text-gray-700">
                    {row.checkIn ?? <span className="text-gray-400">—</span>}
                  </div>

                  <div className="w-1/4 text-gray-700">
                    {row.checkOut ?? <span className="text-gray-400">—</span>}
                  </div>

                  <div className="w-1/4 flex justify-end">
                    <Badge className={`${attendanceStatusColor[row.status]} text-white`}>
                      {row.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* LEAVE REQUESTS CARD */}
          <Card className="shadow-md border border-gray-200 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Leave Requests
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {leaveRequests.map((req, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 border transition"
                >
                  <div className="w-1/3 font-medium text-gray-800">{req.date}</div>

                  <div className="w-1/3 text-gray-700">{req.type}</div>

                  <div className="w-1/3 flex justify-end">
                    <Badge className={`${leaveStatusColor[req.status]} text-white`}>
                      {req.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
