import { baseApi } from "@/store/baseApi";

export type DashboardStats = {
  totalOrders: number;
  pendingOrders: number;
  activeCustomers: number;
  lowStock: number;
  revenue: number;
  activeStaff: number;
}

export type DashboardSalesStats = {
  total_sales: number;
  total_orders: number;
  total_invoices: number;
  total_collections: number;
  period?: {
    filter: string;
    start_date: string;
    end_date: string;
  };
}

type DashboardStatsResponse = {
  status: boolean;
  message: string;
  data: DashboardStats;
};

type DashboardSalesStatsResponse = {
  status: boolean;
  message: string;
  data: DashboardSalesStats;
};

export const dashboardApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: `/dashboard`,
        method: "GET",
      }),
      providesTags: ["Stats"],
    }),
    getDashboardCharts: builder.query({
      query: () => ({
        url: `/dashboard/charts`,
        method: "GET",
      }),
      providesTags: ["Stats"],
    }),
    getDashboardSalesStats: builder.query<DashboardSalesStatsResponse, string>({
      query: (filter) => ({
        url: `/reports/my/dashboard-statistics?filter=${filter}`,
        method: "GET",
      }),
      providesTags: ["Stats"],
    }),
    getStaffSalesCharts: builder.query<any, { staff_id: string | number }>({
      query: ({ staff_id }) => ({
        url: `/dashboard/staffs/charts?staff_id=${staff_id}`,
        method: "GET",
      }),
      providesTags: ["Stats"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetDashboardChartsQuery,
  useGetDashboardSalesStatsQuery,
  useGetStaffSalesChartsQuery,
} = dashboardApiService;
