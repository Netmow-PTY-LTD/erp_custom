import { baseApi } from "@/store/baseApi";
import type { SalesRoute } from "@/types/salesRoute.types";

// ----------------------
// Types
// ----------------------



export interface SalesRoutePagination {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export interface SalesRouteListResponse {
  success: boolean;
  message: string;
  pagination: SalesRoutePagination;
  data: SalesRoute[];
}

export interface SalesRouteSingleResponse {
  success: boolean;
  message: string;
  data: SalesRoute;
}

// ----------------------
// RTK Query Service
// ----------------------

export const salesRouteApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET ALL SALES ROUTES
    getAllSalesRoute: builder.query<SalesRouteListResponse, void>({
      query: () => ({
        url: "/sales",
        method: "GET",
      }),
      providesTags: ["SalesRoute"],
    }),

    // ADD SALES ROUTE
    addSalesRoute: builder.mutation<SalesRouteSingleResponse, Partial<SalesRoute>>({
      query: (body) => ({
        url: "/sales",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SalesRoute"],
    }),

    // GET SINGLE SALES ROUTE
    getSalesRouteById: builder.query<SalesRouteSingleResponse, string | number>({
      query: (id) => ({
        url: `/sales/${id}`,
        method: "GET",
      }),
      providesTags: ["SalesRoute"],
    }),

    // UPDATE SALES ROUTE
    updateSalesRoute: builder.mutation<
      SalesRouteSingleResponse,
      { id: string | number; body: Partial<SalesRoute> }
    >({
      query: ({ id, body }) => ({
        url: `/sales/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SalesRoute"],
    }),

    // DELETE SALES ROUTE
    deleteSalesRoute: builder.mutation<SalesRouteSingleResponse, string | number>({
      query: (id) => ({
        url: `/sales/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SalesRoute"],
    }),

  }),
});

// Hooks
export const {
  useGetAllSalesRouteQuery,
  useAddSalesRouteMutation,
  useGetSalesRouteByIdQuery,
  useUpdateSalesRouteMutation,
  useDeleteSalesRouteMutation,
} = salesRouteApiService;
