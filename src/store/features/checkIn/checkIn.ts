import { baseApi } from "@/store/baseApi";

// Attendance endpoints
export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCheckinList: builder.query<unknown, { staff_id?: string | number; date?: string } | void>({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params) {
          if (params.staff_id !== undefined && params.staff_id !== null && params.staff_id !== "") {
            qs.set('staff_id', String(params.staff_id));
          }
          if (params.date) {
            qs.set('date', params.date);
          }
        }
        const queryString = qs.toString();
        return {
          url: `/attendance/checkin-list${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Attendance'],
    }),
  }),
});

export const { useGetCheckinListQuery } = attendanceApi;
