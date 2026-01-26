/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/store/baseApi";
import type { Attendance } from "@/types/Attendence.types";

type AttendanceResponse = {
  status: boolean;
  message: string;
  data: Attendance | Attendance[];
};

type StaffAttendanceResponse = {
  status: boolean;
  message: string;
  data: Attendance[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
};

type AttendanceStatsResponse = {
  status: boolean;
  message: string;
  data: {
    total: number;
    present: number;
    late: number;
    absent: number;
    on_leave: number;
  };
};

export const attendanceApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CHECK-IN
    checkIn: builder.mutation<AttendanceResponse, any>({
      query: (body) => ({
        url: `/staff-attendance/staff/${body.staff_id}`,
        method: "POST",
        body: body.data,
      }),
      invalidatesTags: ["Attendance"],
    }),

    // CHECK-OUT
    checkOut: builder.mutation<AttendanceResponse, any>({
      query: (body) => ({
        url: "/staff-attendance/check-out",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Attendance"],
    }),

    // GET ALL ATTENDANCE
    getAllAttendance: builder.query<
      AttendanceResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: () => ({
        url: "/staff-attendance",
        method: "GET",
      }),
      providesTags: ["Attendance"],
    }),

    // GET SINGLE ATTENDANCE BY ID
    getAttendanceById: builder.query<AttendanceResponse, number>({
      query: (id) => ({
        url: `/staff-attendance/${id}`,
        method: "GET",
      }),
      providesTags: ["Attendance"],
    }),

    // GET SINGLE ATTENDANCE BY ID
    getStaffAttendanceById: builder.query<
      StaffAttendanceResponse,
      {
        staffId: number;
        page?: number;
        limit?: number;
        search?: string;
        month?: string;
        status?: string;
        start_date?: string;
        end_date?: string;
      }
    >({
      query: ({ staffId, page = 1, limit = 10, search = "", month, status, start_date, end_date }) => ({
        url: `/staff-attendance/staff/${staffId}`,
        method: "GET",
        params: {
          page,
          limit,
          search,
          month,
          status,
          start_date,
          end_date,
        },
      }),
      providesTags: ["Attendance"],
    }),

    // UPDATE ATTENDANCE
    updateAttendance: builder.mutation<
      AttendanceResponse,
      { id: number; body: any }
    >({
      query: ({ id, body }) => ({
        url: `/staff-attendance/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Attendance"],
    }),

    // DELETE ATTENDANCE
    deleteAttendance: builder.mutation<AttendanceResponse, number>({
      query: (id) => ({
        url: `/staff-attendance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attendance"],
    }),

    staffWiseFullDayLeaveApplication: builder.mutation<any, { staff_id: number; body: any }>({
      query: ({ staff_id, body }) => ({
        url: `/staff-attendance/staff/${staff_id}/leave/full-day`,
        method: "POST",
        body,
      }),
    }),
    staffWiseShortLeaveApplication: builder.mutation<any, { staff_id: number; body: any }>({
      query: ({ staff_id, body }) => ({
        url: `/staff-attendance/staff/${staff_id}/leave/short`,
        method: "POST",
        body,
      }),
    }),

    // GET STAFF ATTENDANCE STATS
    getStaffAttendanceStats: builder.query<
      AttendanceStatsResponse,
      { staffId: string | number; month?: string }
    >({
      query: ({ staffId, month }) => ({
        url: `/staff-attendance/staff/${staffId}/stats`,
        method: "GET",
        params: { month },
      }),
      providesTags: ["Attendance"],
    }),
  }),
});

export const {
  useCheckInMutation,
  useCheckOutMutation,
  useGetAllAttendanceQuery,
  useGetAttendanceByIdQuery,
  useGetStaffAttendanceByIdQuery,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
  useStaffWiseFullDayLeaveApplicationMutation,
  useStaffWiseShortLeaveApplicationMutation,
  useGetStaffAttendanceStatsQuery,
} = attendanceApiService;
