import { baseApi } from "@/store/baseApi";
import type { Staff } from "@/types/staff.types";

export type StaffResponse = {
  status: boolean;
  message: string;
  data: Staff | Staff[];
};

export const staffApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET ALL STAFFS
    getAllStaffs: builder.query<StaffResponse, void>({
      query: () => ({
        url: "/staffs",
        method: "GET",
      }),
      providesTags: ["Staffs"],
    }),

    // ADD STAFF
    addStaff: builder.mutation<StaffResponse, Partial<Staff>>({
      query: (body) => ({
        url: "/staffs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Staffs"],
    }),

    // GET SINGLE STAFF BY ID
    getStaffById: builder.query<StaffResponse, string | number>({
      query: (id) => ({
        url: `/staffs/${id}`,
        method: "GET",
      }),
      providesTags: ["Staffs"],
    }),

    // UPDATE STAFF
    updateStaff: builder.mutation<StaffResponse, { id: string | number; body: Partial<Staff> }>({
      query: ({ id, body }) => ({
        url: `/staffs/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Staffs"],
    }),

    // DELETE STAFF
    deleteStaff: builder.mutation<StaffResponse, string | number>({
      query: (id) => ({
        url: `/staffs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Staffs"],
    }),

  }),
});

export const {
  useGetAllStaffsQuery,
  useAddStaffMutation,
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = staffApiService;
