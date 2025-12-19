import { baseApi } from "@/store/baseApi";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReportResponse<T = any> = {
  status: boolean;
  message: string;
  data: T;
};

export const reportsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ===================== SALES REPORTS =====================

    // GET /api/reports/sales/summary
    getSalesSummary: builder.query<ReportResponse, void>({
      query: () => ({
        url: "/reports/sales/summary",
        method: "GET",
      }),
      providesTags: ["Reports"],
    }),

    // GET /api/reports/sales/top-customers
    getTopCustomers: builder.query<ReportResponse, void>({
      query: () => ({
        url: "/reports/sales/top-customers",
        method: "GET",
      }),
      providesTags: ["Reports"],
    }),

    // GET /api/reports/sales/top-products
    getTopProducts: builder.query<ReportResponse, void>({
      query: () => ({
        url: "/reports/sales/top-products",
        method: "GET",
      }),
      providesTags: ["Reports"],
    }),

    // ===================== PURCHASE REPORTS =====================

    // GET /api/reports/purchase/summary
    getPurchaseSummary: builder.query<ReportResponse, void>({
      query: () => ({
        url: "/reports/purchase/summary",
        method: "GET",
      }),
      providesTags: ["Reports"],
    }),

    // GET /api/reports/purchase/by-supplier
    getPurchaseBySupplier: builder.query<ReportResponse, void>({
      query: () => ({
        url: "/reports/purchase/by-supplier",
        method: "GET",
      }),
      providesTags: ["Reports"],
    }),

    // ===================== INVENTORY REPORTS =====================

    // GET /api/reports/inventory/status
    getInventoryStatus: builder.query<ReportResponse, void>({
      query: () => ({
        url: "/reports/inventory/status",
        method: "GET",
      }),
      providesTags: ["Reports"],
    }),

    // GET /api/reports/inventory/valuation
    getInventoryValuation: builder.query<ReportResponse, void>({
      query: () => ({
        url: "/reports/inventory/valuation",
        method: "GET",
      }),
      providesTags: ["Reports"],
    }),

    // ===================== HR REPORTS =====================

    // GET /api/reports/hr/attendance
    getHrAttendance: builder.query<ReportResponse, void>({
      query: () => ({
        url: "/reports/hr/attendance",
        method: "GET",
      }),
      providesTags: ["Reports"],
    }),

    // GET /api/reports/hr/payroll
    getHrPayroll: builder.query<ReportResponse, void>({
      query: () => ({
        url: "/reports/hr/payroll",
        method: "GET",
      }),
      providesTags: ["Reports"],
    }),

    // ===================== FINANCE REPORTS =====================

    // GET /api/reports/finance/profit-loss
    getProfitLoss: builder.query<ReportResponse, void>({
      query: () => ({
        url: "/reports/finance/profit-loss",
        method: "GET",
      }),
      providesTags: ["Reports"],
    }),

  }),
});

export const {
  useGetSalesSummaryQuery,
  useGetTopCustomersQuery,
  useGetTopProductsQuery,
  useGetPurchaseSummaryQuery,
  useGetPurchaseBySupplierQuery,
  useGetInventoryStatusQuery,
  useGetInventoryValuationQuery,
  useGetHrAttendanceQuery,
  useGetHrPayrollQuery,
  useGetProfitLossQuery,
} = reportsApiService;
