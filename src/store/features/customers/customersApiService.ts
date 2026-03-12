import { baseApi } from "@/store/baseApi";

export interface Customer {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  is_active: boolean;
}

interface CustomersResponse {
  success: boolean;
  message: string;
  data: Customer[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
}

export const customersApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<CustomersResponse, { page?: number; limit?: number; search?: string }>({
      query: (params) => ({
        url: "/customers",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 100,
          ...(params.search && { search: params.search }),
        },
      }),
    }),
  }),
});

export const { useGetCustomersQuery } = customersApiService;
