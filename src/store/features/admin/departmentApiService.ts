import { baseApi } from "@/store/baseApi";
import type { Department } from "@/types/types";

type DepartmentResponse = {
  status: boolean;
  message: string;
  data: Department[];
};

export const departmentApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addDepartment: builder.mutation({
      query: (body) => ({
        url: "/departments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["department"],
    }),
    getAllDepartments: builder.query<DepartmentResponse, void>({
      query: () => ({
        url: "/departments",
        method: "GET",
      }),
      providesTags: ["department"],
    }),
    getDepartmentById: builder.query<DepartmentResponse, number>({
      query: (id) => ({
        url: `/departments/${id}`,
        method: "GET",
      }),
      providesTags: ["department"],
    }),
  }),
});

export const {
  useAddDepartmentMutation,
  useGetAllDepartmentsQuery,
  useGetDepartmentByIdQuery,
} = departmentApiService;
