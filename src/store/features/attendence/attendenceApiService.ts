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

export const attendanceApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CHECK-IN
    checkIn: builder.mutation<AttendanceResponse, any>({
      query: (body) => ({
        url: `/attendance/staff/${body.staff_id}`,
        method: "POST",
        body: body.data,
      }),
      invalidatesTags: ["Attendance"],
    }),

    // CHECK-OUT
    checkOut: builder.mutation<AttendanceResponse, any>({
      query: (body) => ({
        url: "/attendance/check-out",
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
        url: "/attendance",
        method: "GET",
      }),
      providesTags: ["Attendance"],
    }),

    // GET SINGLE ATTENDANCE BY ID
    getAttendanceById: builder.query<AttendanceResponse, number>({
      query: (id) => ({
        url: `/attendance/${id}`,
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
      }
    >({
      query: ({ staffId, page = 1, limit = 10, search = "" }) => ({
        url: `/attendance/staff/${staffId}`,
        method: "GET",
        params: {
          page,
          limit,
          search,
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
        url: `/attendance/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Attendance"],
    }),

    // DELETE ATTENDANCE
    deleteAttendance: builder.mutation<AttendanceResponse, number>({
      query: (id) => ({
        url: `/attendance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attendance"],
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
} = attendanceApiService;
