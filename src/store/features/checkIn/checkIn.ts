import { baseApi } from "@/store/baseApi";

// Types for attendance API
export type AttendanceItem = {
  id: number;
  staff_id: number;
  customer_id?: number;
  date: string;
  check_in: string | null;
  check_out?: string | null;
  status?: string | null;
  notes?: string | null;
  latitude?: number;
  longitude?: number;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  total_hours?: number;
  staff?: {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
  };
  customer?: {
    id: number;
    name: string;
    location: string;
    phone?: string;
    email?: string;
  };
};

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
};

export type CheckinListResponse = {
  success: boolean;
  message?: string;
  pagination?: Pagination;
  data: AttendanceItem[];
};

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCheckinList: builder.query<CheckinListResponse, { staff_id?: string | number; date?: string; page?: number; limit?: number } | void>({
      query: (params) => {

        return {
          url: `/staff-attendance/checkin-list`,
          method: 'GET',
          params: params || undefined
        };
      },
      providesTags: ['Attendance'],
    }),
  }),
});

export const { useGetCheckinListQuery } = attendanceApi;

