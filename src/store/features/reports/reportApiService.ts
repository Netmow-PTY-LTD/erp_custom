import { baseApi } from "@/store/baseApi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReportResponse<T = any> = {
  status: boolean;
  message: string;
  data: T;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
};

export type RevenuePoint = {
  date: string; // e.g. "2025-12", "2025-12-01", "2025-W50", "2025-Q4"
  amount: number;
  order_count: number;
};

export interface RevenueChartResponse {
  status: boolean;
  message: string;
  data: {
    period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
    year: number;
    month: number | null;
    quarter: number | null;
    data: RevenuePoint[];
  };
}

export const reportsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===================== SALES REPORTS =====================

    // GET /api/reports/sales/summary
    getSalesSummary: builder.query<
      ReportResponse,
      { start_date: string; end_date: string }
    >({
      query: (params) => ({
        url: "/reports/sales/summary",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    // GET /api/reports/sales/top-customers
    getTopCustomers: builder.query<
      ReportResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: () => ({
        url: "/reports/sales/top-customers",
        method: "GET",
      }),
      providesTags: ["Reports"],
    }),

    // GET /api/reports/sales/top-products
    getTopProducts: builder.query<
      ReportResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: () => ({
        url: "/reports/sales/top-products",
        method: "GET",
      }),
      providesTags: ["Reports"],
    }),

    getSalesChartData: builder.query<
      RevenueChartResponse,
      { start_date: string; end_date: string }
    >({
      query: (params) => ({
        url: "/sales/reports/charts",
        method: "GET",
        params,
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

    // GET /api/reports/inventory/low-stock-list
    getInventoryLowStockList: builder.query<
      ReportResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/reports/inventory/low-stock-list",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    // ===================== Customer Reports =====================

    getSalesReportByCustomer: builder.query<
      ReportResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/reports/sales/by-customer",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    getAccountsReceivableReport: builder.query<
      ReportResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/reports/customers/account-receivables",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    // GET /api/reports/customers - Customer Statistics
    getCustomerStatistics: builder.query<
      {
        success: boolean;
        message: string;
        data: {
          total_customers: number;
          total_sales: number;
          total_outstanding_balance: number;
        };
      },
      void
    >({
      query: () => ({
        url: "/reports/customers",
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

    // GET /api/reports/sales/staff-wise
    getStaffWiseSales: builder.query<
      ReportResponse,
      {
        start_date?: string;
        end_date?: string;
        page?: number;
        limit?: number;
        search?: string;
        staff_id?: string | number;
      }
    >({
      query: (params) => ({
        url: "/reports/sales/staff-wise",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    // GET /api/reports/invoices/staff-wise
    getStaffWiseInvoices: builder.query<
      ReportResponse,
      {
        start_date?: string;
        end_date?: string;
        page?: number;
        limit?: number;
        search?: string;
        staff_id?: string | number;
      }
    >({
      query: (params) => ({
        url: "/reports/invoices/staff-wise",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    // My Reports - GET /api/reports/my/*
    getMySales: builder.query<
      ReportResponse,
      {
        startDate?: string;
        endDate?: string;
        start_date?: string;
        end_date?: string;
        page?: number;
        limit?: number;
        search?: string;
        customerId?: string;
      }
    >({
      query: (params) => ({
        url: "/reports/my/sales",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    getMyInvoices: builder.query<
      ReportResponse,
      {
        startDate?: string;
        endDate?: string;
        start_date?: string;
        end_date?: string;
        page?: number;
        limit?: number;
        search?: string;
        customerId?: string;
      }
    >({
      query: (params) => ({
        url: "/reports/my/invoices",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    getMyCustomerWiseSales: builder.query<
      ReportResponse,
      {
        startDate?: string;
        endDate?: string;
        start_date?: string;
        end_date?: string;
        page?: number;
        limit?: number;
        search?: string;
      }
    >({
      query: (params) => ({
        url: "/reports/my/customer-wise-sales",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    getMyCustomerWiseInvoices: builder.query<
      ReportResponse,
      {
        startDate?: string;
        endDate?: string;
        start_date?: string;
        end_date?: string;
        page?: number;
        limit?: number;
        search?: string;
      }
    >({
      query: (params) => ({
        url: "/reports/my/customer-wise-invoices",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    getMyCustomers: builder.query<
      {
        status: boolean;
        message: string;
        data: {
          data: Array<{
            id: number;
            company: string;
            name: string;
            email: string;
            phone: string;
            address: string;
            status: string;
          }>;
          pagination: {
            total: number;
            limit: number;
          };
        };
      },
      { search?: string; limit?: number }
    >({
      query: (params) => ({
        url: "/reports/my/customers",
        method: "GET",
        params,
      }),
      providesTags: ["Reports"],
    }),

    // GET /api/dashboard/staffs/charts - Staff's month-wise total sales
    getStaffsCharts: builder.query<
      Array<{ name: string; total: number }>,
      { staff_id?: number | string }
    >({
      query: (params) => ({
        url: "/dashboard/staffs/charts",
        method: "GET",
        params,
      }),
      providesTags: ["Reports", "Dashboard"],
    }),
  }),
});

export const {
  useGetSalesSummaryQuery,
  useGetTopCustomersQuery,
  useGetTopProductsQuery,
  useGetSalesChartDataQuery,
  useGetPurchaseSummaryQuery,
  useGetPurchaseBySupplierQuery,
  useGetInventoryStatusQuery,
  useGetInventoryValuationQuery,
  useGetInventoryLowStockListQuery,
  useGetSalesReportByCustomerQuery,
  useGetAccountsReceivableReportQuery,
  useGetCustomerStatisticsQuery,
  useGetHrAttendanceQuery,
  useGetHrPayrollQuery,
  useGetProfitLossQuery,
  useGetStaffWiseSalesQuery,
  useGetStaffWiseInvoicesQuery,
  useGetMySalesQuery,
  useGetMyInvoicesQuery,
  useGetMyCustomerWiseSalesQuery,
  useGetMyCustomerWiseInvoicesQuery,
  useGetMyCustomersQuery,
  useGetStaffsChartsQuery,
} = reportsApiService;
