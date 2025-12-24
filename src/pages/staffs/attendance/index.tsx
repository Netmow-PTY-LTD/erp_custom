import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useGetAllStaffsQuery } from "@/store/features/staffs/staffApiService";
import type { Staff } from "@/types/staff.types";
import {
  useCheckInMutation,
  useCheckOutMutation,
  useGetAllAttendanceQuery,
} from "@/store/features/attendence/attendenceApiService";
import { toast } from "sonner";
import type { Attendance } from "@/types/Attendence.types";

export default function AttendancePage() {
  //const [isChecked, setIsChecked] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [staff, setStaff] = useState<Staff | null>(null);
  const [page, setPage] = useState<number>(1);
  const [search] = useState<string>("");
  const [limit] = useState(10);
  const { data: staffsData } = useGetAllStaffsQuery({ page, limit, search });

  //console.log("staffsData", staffsData);

  const staffsList = staffsData?.data as Staff[] | [];
  const totalCount: number = staffsData?.pagination?.total || 0;
  const totalPages: number = staffsData?.pagination?.totalPage || 1;
  const pageSize: number = staffsData?.pagination?.limit || 10;
  const pageIndex = page - 1;

  const {data: attendancesData} = useGetAllAttendanceQuery({page, limit, search});

  const attendances = attendancesData?.data as Attendance[] | [];

  console.log("attendances", attendances);


  const staffAttendance = attendances?.find(item => item.staff_id === staff?.id);

  console.log("staffAttendance", staffAttendance);

  // useEffect(() => {
  //   if (staffAttendance) {
  //     setCheckInTime(staffAttendance?.check_in);
  //     setCheckOutTime(staffAttendance?.check_out);
  //   }
  // }, [staffAttendance]);

  const [checkIn, { isLoading: isCheckingIn }] = useCheckInMutation();
  const [checkOut, { isLoading: isCheckingOut }] = useCheckOutMutation();

  const handleCheckIn = async (staff: Staff) => {
    setStaff(staff);

    const now = new Date().toLocaleTimeString("en-GB"); // HH:MM:SS
    try {
      const res = await checkIn({
        staff_id: staff.id,
        date: new Date().toISOString().split("T")[0],
        check_in: now,
        status: "present",
      }).unwrap();
      console.log("Check-in successful", res);
      if (res) {
        // setIsChecked(true);
        toast.success("Check-in successful");
      }
    } catch (err) {
      console.error("Check-in failed:", err);
      // setIsChecked(false);
      setCheckInTime(null);
      //toast.error(err.data?.message || "Check-in failed");
    }
  };

  const handleCheckOut = async (staff: Staff) => {
    setStaff(staff);

    const now = new Date().toLocaleTimeString("en-GB");
    setCheckOutTime(now);

    try {
      await checkOut({
        staff_id: staff.id,
        date: new Date().toISOString().split("T")[0],
        check_out: now,
        status: "present",
      });
    } catch (err) {
      console.error("Check-out failed:", err);
      //toast.error(err?.data?.message || "Check-out failed");
    }
  };

  console.log("staff", staff);

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Today's Attendance</h1>

        <Link to="/dashboard/staffs">
          <Button variant="outline">
            <ArrowLeft />
            Back to Staffs
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* CHECKED-IN SECTION */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>All Staffs</CardTitle>
          </CardHeader>
          <CardContent>
            {staffsList?.length === 0 ? (
              <p className="text-gray-500">No check-ins yet today.</p>
            ) : (
              <ul className="space-y-4">
                {staffsList?.map((staff) => {
                  return (
                    <li
                      key={staff.id}
                      className="flex justify-between p-4 border rounded-lg items-center"
                    >
                      <div>
                        <p className="font-semibold">
                          {staff.first_name} {staff.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {staff.department?.name || "N/A"}
                        </p>
                        {staffAttendance?.id && (
                          <div className="mt-1 text-xs text-gray-600 space-y-1">
                            {checkInTime && (
                              <p className="text-green-600">
                                ✔ Checked In: {checkInTime}
                              </p>
                            )}
                            {checkOutTime && (
                              <p className="text-blue-600">
                                ✔ Checked Out: {checkOutTime}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 mt-4">
                        <Button
                          onClick={() => handleCheckIn(staff)}
                          disabled={!staff.id || isCheckingIn}
                        >
                          Check In
                        </Button>

                        <Button
                          onClick={() => handleCheckOut(staff)}
                          variant="outline"
                          disabled={!staff.id || isCheckingOut}
                        >
                          Check Out
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* ABSENT SECTION */}
        {/* <Card className="h-full">
          <CardHeader>
            <CardTitle>Absent (No Check-in)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {absent.map((staff, idx) => (
                <li
                  key={idx}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{staff.name}</p>
                    <p className="text-sm text-gray-500">
                      {staff.id} · {staff.dept}
                    </p>
                  </div>

                  <Button variant="secondary" className="bg-gray-200">
                    Absent
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card> */}
        <div className="flex items-center justify-between py-4">
          <div className="text-sm">
            Showing {pageIndex * pageSize + 1}–
            {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount}{" "}
            results
          </div>

          <div className="space-x-2 flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1 text-sm">
              <span>Page</span>
              <select
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  )
                )}
              </select>
              <span>of {totalPages}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
