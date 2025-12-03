import { baseApi } from "@/store/baseApi";
import type { Department } from "@/types/types";

type DepartmentResponse = {
  status: boolean;
  message: string;
  data: Department[];
};

type DepartmentByIdResponse = {
  status: boolean;
  message: string;
  data: Department;
};

export const departmentApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addDepartment: builder.mutation({
      query: (body) => ({
        url: "/departments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Departments"],
    }),
    getAllDepartments: builder.query<DepartmentResponse, void>({
      query: () => ({
        url: "/departments",
        method: "GET",
      }),
      providesTags: ["Departments"],
    }),
    getDepartmentById: builder.query<DepartmentByIdResponse, number>({
      query: (id) => ({
        url: `/departments/${id}`,
        method: "GET",
      }),
      providesTags: ["Departments"],
    }),
    updateDepartment: builder.mutation<
      DepartmentResponse,
      { id: number; body: Partial<Department> }
    >({
      query: (body) => ({
        url: `/departments/${body.id}`,
        method: "PUT",
        body: body.body,
      }),
      invalidatesTags: ["Departments"],
    }),
    deleteDepartment: builder.mutation<DepartmentResponse, number>({
      query: (id) => ({
        url: `/departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Departments"],
    }),
  }),
});

export const {
  useAddDepartmentMutation,
  useGetAllDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApiService;
