import { baseApi } from "@/store/baseApi";
import type { Staff } from "@/types/staff.types";

export type StaffResponse = {
  status: boolean;
  message: string;
  data: Staff | Staff[];
   pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
};



export type StaffQueryParams = {
  page?: number;         // Page number, default 1
  limit?: number;        // Items per page, default 10
  status?: "active" | "inactive" | "terminated" | "on_leave"; // Status filter
  department?: string;   // Department filter
  search?: string;       // Search by name, email, or position
};





export const staffApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET ALL STAFFS
    getAllStaffs: builder.query<StaffResponse, StaffQueryParams>({
      query: (params) => ({
        url: "/staffs",
        method: "GET",
        params
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
