import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetStaffAttendanceByIdQuery } from "@/store/features/attendence/attendenceApiService";
import type { Staff } from "@/types/staff.types";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AttendanceRecord {
  date: string;
  check_in: string | null;
  check_out: string | null;
  notes: string;
  status: "present" | "absent" | "late" | "leave" | string;
}

export default function AttendanceDetailsModal({
  modalOpen,
  setModalOpen,
  staff,
}: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  staff: Staff | null;
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const limit = 10;

  const { data: attendanceByStaff, isFetching: isFetchingAttendance } =
    useGetStaffAttendanceByIdQuery({
      staffId: Number(staff?.id),
      page,
      limit,
      search,
      start_date: startDate,
      end_date: endDate
    });

  const attendanceData: AttendanceRecord[] = attendanceByStaff?.data || [];
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

        return (
          <Badge className={`${color} text-white`}>
            {formatStatusLabel(rawStatus)}
          </Badge>
        );
      },
    },
  ];

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="sm:max-w-[800px] w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Attendances - {staff?.first_name || ""} {staff?.last_name || ""}
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-end mt-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">From Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="w-[160px]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">To Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="w-[160px]"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setPage(1);
            }}
          >
            Clear Filter
          </Button>
        </div>

        <div className="space-y-6 mt-5 max-h-[400px] sm:max-h-[600px] overflow-auto">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
