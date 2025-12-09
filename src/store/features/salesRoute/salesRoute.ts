import { baseApi } from "@/store/baseApi";
import type { User } from "@/types/users.types";

export type SalesRouteResponse = {
  status: boolean;
  message: string;
  data: User | User[];
};

export const salesRouteApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET ALL
    getAllSalesRoute: builder.query<SalesRouteResponse, void>({
      query: () => ({
        url: "/sales",
        method: "GET",
      }),
      providesTags: ["SalesRoute"],
    }),

    // ADD
    addSalesRoute: builder.mutation<SalesRouteResponse, Partial<User>>({
      query: (body) => ({
        url: "/sales/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SalesRoute"],
    }),

    // GET SINGLE
    getSalesRouteById: builder.query<SalesRouteResponse, string | number>({
      query: (id) => ({
        url: `/sales/get/${id}`,
        method: "GET",
      }),
      providesTags: ["SalesRoute"],
    }),

    // UPDATE
    updateSalesRoute: builder.mutation<
      SalesRouteResponse,
      { id: string | number; body: Partial<User> }
    >({
      query: ({ id, body }) => ({
        url: `/sales/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SalesRoute"],
    }),

    // DELETE
    deleteSalesRoute: builder.mutation<SalesRouteResponse, string | number>({
      query: (id) => ({
        url: `/sales/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SalesRoute"],
    }),

  }),
});

export const {
  useGetAllSalesRouteQuery,
  useAddSalesRouteMutation,
  useGetSalesRouteByIdQuery,
  useUpdateSalesRouteMutation,
  useDeleteSalesRouteMutation,
} = salesRouteApiService;
