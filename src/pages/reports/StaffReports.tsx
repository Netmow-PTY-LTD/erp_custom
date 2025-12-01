import { useState } from "react";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ColumnDef } from "@tanstack/react-table";

/* ---------------------------------------------------------------------- */
/*                              SAMPLE DATA                               */
/* ---------------------------------------------------------------------- */

const staffSales = [
  { staff: "Ahmad Hassan", orders: 0, sales: 0.0 },
  { staff: "Siti Nurhaliza", orders: 0, sales: 0.0 },
  { staff: "Raj Kumar", orders: 0, sales: 0.0 },
  { staff: "Lim Wei Ming", orders: 0, sales: 0.0 },
  { staff: "Fatimah Ali", orders: 0, sales: 0.0 },
  { staff: "David Tan", orders: 0, sales: 0.0 },
  { staff: "Priya Nair", orders: 0, sales: 0.0 },
  { staff: "Wong Kai Jun", orders: 0, sales: 0.0 },
  { staff: "Aisha Rahman", orders: 0, sales: 0.0 },
  { staff: "Hassan Ibrahim", orders: 0, sales: 0.0 },
  { staff: "Test User", orders: 0, sales: 0.0 },
  { staff: "Test User", orders: 0, sales: 0.0 },
  { staff: "Jawa Gara", orders: 0, sales: 0.0 },
  { staff: "Maksudul Haque", orders: 0, sales: 0.0 },
  { staff: "Sales Staff", orders: 0, sales: 0.0 },
  { staff: "Sales Person", orders: 0, sales: 0.0 },
];

const attendance = staffSales.map((s) => ({
  staff: s.staff,
  hours: 0.0,
  present: 0,
  late: 0,
}));

/* ---------------------------------------------------------------------- */
/*                      SALES BY STAFF COLUMNS                            */
/* ---------------------------------------------------------------------- */

interface StaffSales {
  staff: string;
  orders: number;
  sales: number;
}

const staffSalesColumns: ColumnDef<StaffSales>[] = [
  {
    accessorKey: "staff",
    header: "Staff",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("staff")}</span>
    ),
  },
  {
    accessorKey: "orders",
    header: "Orders",
  },
  {
    accessorKey: "sales",
    header: "Sales (RM)",
    cell: ({ row }) => {
      const val = row.getValue("sales") as number;
      return <span>RM {val.toFixed(2)}</span>;
    },
  },
];

/* ---------------------------------------------------------------------- */
/*                        ATTENDANCE COLUMNS                              */
/* ---------------------------------------------------------------------- */

interface Attendance {
  staff: string;
  hours: number;
  present: number;
  late: number;
}

const attendanceColumns: ColumnDef<Attendance>[] = [
  {
    accessorKey: "staff",
    header: "Staff",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("staff")}</span>
    ),
  },
  {
    accessorKey: "hours",
    header: "Hours",
    cell: ({ row }) => <span>{(row.getValue("hours") as number).toFixed(2)}</span>,
  },
  {
    accessorKey: "present",
    header: "Present Days",
  },
  {
    accessorKey: "late",
    header: "Late Days",
    cell: ({ row }) => {
      const late = row.getValue("late") as number;
      return (
        <Badge className={late > 0 ? "bg-yellow-500" : "bg-green-600"}>
          {late}
        </Badge>
      );
    },
  },
];

/* ---------------------------------------------------------------------- */
/*                                PAGE UI                                 */
/* ---------------------------------------------------------------------- */

export default function StaffReports() {
  const [start, setStart] = useState("2025-11-01");
  const [end, setEnd] = useState("2025-11-26");

  return (
    <div className="w-full space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Staff Reports</h1>
      </div>

      {/* ---------------- FILTER BAR ---------------- */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div>
          <label className="text-sm font-medium">Start Date</label>
          <Input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">End Date</label>
          <Input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>

        <Button color="info" className="mt-6">
          Apply Filter
        </Button>
      </div>

      {/* ---------------- SALES BY STAFF ---------------- */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Orders & Sales by Staff</h2>
        <DataTable columns={staffSalesColumns} data={staffSales} />
      </div>

      {/* ---------------- ATTENDANCE SUMMARY ---------------- */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Attendance Summary</h2>
        <DataTable columns={attendanceColumns} data={attendance} />
      </div>
    </div>
  );
}
