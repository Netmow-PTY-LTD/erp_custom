import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

interface Staff {
  name: string;
  id: string;
  dept: string;
  time?: string; // Optional for checked-in only
}

export default function AttendancePage() {
  // Dummy checked-in data
  const checkedIn: Staff[] = [
    { name: "John Doe", id: "EMP099", dept: "IT", time: "9:05 AM" },
    { name: "Alice Lee", id: "EMP120", dept: "HR", time: "9:12 AM" },
  ];

  // Dummy absent data
  const absent: Staff[] = [
    { name: "Ahmad Hassan", id: "EMP001", dept: "Management" },
    { name: "David Tan", id: "EMP006", dept: "Warehouse" },
    { name: "Fatimah Ali", id: "EMP005", dept: "Operations" },
    { name: "Hassan Ibrahim", id: "EMP010", dept: "Warehouse" },
    { name: "Jawa Gara", id: "EMP013", dept: "-" },
    { name: "Lim Wei Ming", id: "EMP004", dept: "Operations" },
    { name: "Maksudul Haque", id: "EMP014", dept: "Management" },
    { name: "Priya Nair", id: "EMP007", dept: "Finance" },
    { name: "Raj Kumar", id: "EMP003", dept: "Sales" },
    { name: "Sales Person", id: "EMP-SALES-001", dept: "-" },
    { name: "Sales Staff", id: "EMP015", dept: "-" },
    { name: "Siti Nurhaliza", id: "EMP002", dept: "Sales" },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CHECKED-IN SECTION */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Checked-in</CardTitle>
          </CardHeader>
          <CardContent>
            {checkedIn.length === 0 ? (
              <p className="text-gray-500">No check-ins yet today.</p>
            ) : (
              <ul className="space-y-4">
                {checkedIn.map((staff, idx) => (
                  <li
                    key={idx}
                    className="border rounded-lg p-4 flex justify-between"
                  >
                    <div>
                      <p className="font-semibold">{staff.name}</p>
                      <p className="text-sm text-gray-500">
                        {staff.id} · {staff.dept}
                      </p>
                    </div>
                    {staff.time && (
                      <p className="text-sm text-gray-600">{staff.time}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* ABSENT SECTION */}
        <Card className="h-full">
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
        </Card>
      </div>
    </div>
  );
}
