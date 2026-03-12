/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, type JSX } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { format, isToday } from "date-fns";
import CheckInLocationModal from "./CheckInLocationModal";
import { useGetAllStaffAttendanceQuery, type StaffAttendance } from "@/store/features/checkIn/checkIn";
import { useGetAllStaffsQuery } from "@/store/features/staffs/staffApiService";
import ClenderButton from "./ClenderButton";
import { MapPin, Car, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ================= COMPONENT ================= */

export default function CheckInList(): JSX.Element {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [locationItem, setLocationItem] = useState<StaffAttendance | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedStaffId, setSelectedStaffId] = useState<string>("all");

  // Fetch staff list for filter dropdown
  const { data: staffResponse } = useGetAllStaffsQuery({ limit: 1000, status: 'active' });
  const staffList = useMemo(() => staffResponse?.data || [], [staffResponse]);

  // Fetch attendance data with filters
  const { data: response, isFetching, isLoading } = useGetAllStaffAttendanceQuery({
    page,
    limit,
    search,
    date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
    staff_id: selectedStaffId === "all" ? undefined : selectedStaffId,
  });

  // Fetch today's attendance for status indicators
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: todayAttendanceResponse } = useGetAllStaffAttendanceQuery({
    date: today,
    limit: 1000,
  });
  const todayCheckIns = useMemo(() => {
    const checkInMap = new Map<number, StaffAttendance[]>();
    todayAttendanceResponse?.data?.forEach((attendance: StaffAttendance) => {
      if (!checkInMap.has(attendance.staff_id)) {
        checkInMap.set(attendance.staff_id, []);
      }
      checkInMap.get(attendance.staff_id)?.push(attendance);
    });
    return checkInMap;
  }, [todayAttendanceResponse]);

  const attendanceItems = useMemo(() => response?.data || [], [response]);
  const totalCount = useMemo(() => response?.pagination?.total || 0, [response]);

  /* ================= TABLE COLUMNS ================= */

  const columns = useMemo<ColumnDef<StaffAttendance>[]>(
    () => [
      {
        accessorKey: "staff",
        header: "Checked-in User",
        cell: ({ row }) => {
          const staff = row.original.staff;
          const staffId = row.original.staff_id;
          const hasCheckedInToday = todayCheckIns.has(staffId) && todayCheckIns.get(staffId)!.length > 0;
          const isTodaySelected = selectedDate && isToday(selectedDate);

          return (
            <div className="flex items-center gap-2">
              <span>{staff?.first_name ? `${staff.first_name} ${staff.last_name}` : staff?.name || "N/A"}</span>
              {isTodaySelected && hasCheckedInToday && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </div>
          );
        },
      },
      {
        id: "customer",
        header: "Customer & Company",
        cell: ({ row }) => {
          const customer = row.original.customer;
          return (
            <div className="flex flex-col gap-0.5">
              {customer.company && <span className="font-semibold text-gray-900">{customer.company}</span>}
              <span className={customer.company ? "text-xs text-muted-foreground" : "font-medium text-gray-900"}>
                {customer.name}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "check_in_time",
        header: "Check-in Time",
        cell: ({ row }) => {
          const date = new Date(row.original.check_in_time);
          return isNaN(date.getTime()) ? row.original.check_in_time : date.toLocaleString();
        },
      },
      {
        accessorKey: "distance_meters",
        header: "Distance (m)",
        cell: ({ row }) => `${row.original.distance_meters}m`,
      },
      {
        id: "location",
        header: "Location",
        cell: ({ row }) => {
          const { latitude, longitude, customer } = row.original;
          const hasLocation = (latitude && longitude) || customer?.address;

          const handleWazeClick = () => {
            let url = "";
            if (latitude && longitude) {
              url = `https://www.waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
            } else if (customer?.address) {
              url = `https://www.waze.com/ul?q=${encodeURIComponent(customer.address)}`;
            }
            if (url) window.open(url, "_blank");
          };

          if (!hasLocation) return <span className="text-muted-foreground text-xs">—</span>;

          return (
            <div className="flex items-center gap-1.5">
              <Button
                size="icon"
                className="h-8 w-8 bg-blue-50 text-blue-600 hover:bg-blue-100 border-none shadow-none rounded-lg"
                onClick={() => setLocationItem(row.original)}
                title="View Map"
              >
                <MapPin className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                className="h-8 w-8 bg-orange-50 text-orange-500 hover:bg-orange-100 border-none shadow-none rounded-lg"
                onClick={handleWazeClick}
                title="Open in Waze"
              >
                <Car className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  /* ================= UI ================= */

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Check In List</h1>
        <div className="flex items-center gap-3">
          <Select value={selectedStaffId} onValueChange={(value) => {
            setSelectedStaffId(value || "all");
            setPage(1);
          }}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {staffList.map((staff: any) => (
                <SelectItem key={staff.id} value={staff.id.toString()}>
                  {staff.first_name} {staff.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ClenderButton selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </div>
      </div>

      <div className="bg-white">
        <DataTable
          columns={columns}
          data={attendanceItems}
          pageIndex={page - 1}
          pageSize={limit}
          totalCount={totalCount}
          onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
          isFetching={isFetching || isLoading}
        />
      </div>

      {locationItem && (
        <CheckInLocationModal
          attendance={locationItem}
          onClose={() => setLocationItem(null)}
        />
      )}
    </div>
  );
}
