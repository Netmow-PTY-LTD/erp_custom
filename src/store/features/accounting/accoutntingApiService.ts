import { baseApi } from "@/store/baseApi";
import type { IncomeExpense, Overview, Payroll } from "@/types/accounting.types";

// -------------------- OVERVIEW --------------------


export type OverviewResponse = {
  status: boolean;
  data: Overview;
};

// -------------------- PAGINATION --------------------
export type Pagination = {
  total: number;
  page: string;
  limit: string;
  totalPage: number;
};

// -------------------- INCOME / EXPENSE --------------------
export type ListResponse<T> = {
  success: boolean;
  message: string;
  pagination: Pagination;
  data: T[];
};

// -------------------- PAYROLL --------------------

export type PayrollResponse = ListResponse<Payroll>;

// -------------------- RTK QUERY SERVICE --------------------
export const accountingApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET ACCOUNTING OVERVIEW
    getOverview: builder.query<OverviewResponse, void>({
      query: () => ({ url: "/accounting/overview", method: "GET" }),
      providesTags: ["Accounting"],
    }),

    // GET ALL INCOMES
    getIncomes: builder.query<ListResponse<IncomeExpense>, void>({
      query: () => ({ url: "/accounting/incomes", method: "GET" }),
      providesTags: ["Accounting"],
    }),

    // ADD INCOME
    addIncome: builder.mutation<IncomeExpense, Partial<IncomeExpense>>({
      query: (body) => ({ url: "/accounting/incomes", method: "POST", body }),
      invalidatesTags: ["Accounting"],
    }),

    // GET ALL EXPENSES
    getExpenses: builder.query<ListResponse<IncomeExpense>, void>({
      query: () => ({ url: "/accounting/expenses", method: "GET" }),
      providesTags: ["Accounting"],
    }),

    // ADD EXPENSE
    addExpense: builder.mutation<IncomeExpense, Partial<IncomeExpense>>({
      query: (body) => ({ url: "/accounting/expenses", method: "POST", body }),
      invalidatesTags: ["Accounting"],
    }),

    // GET PAYROLL
    getPayroll: builder.query<PayrollResponse, void>({
      query: () => ({ url: "/accounting/payroll", method: "GET" }),
      providesTags: ["Accounting"],
    }),

    // ADD PAYROLL
    addPayroll: builder.mutation<Payroll, Partial<Payroll>>({
      query: (body) => ({ url: "/accounting/payroll", method: "POST", body }),
      invalidatesTags: ["Accounting"],
    }),

  }),
});

export const {
  useGetOverviewQuery,
  useGetIncomesQuery,
  useAddIncomeMutation,
  useGetExpensesQuery,
  useAddExpenseMutation,
  useGetPayrollQuery,
  useAddPayrollMutation,
} = accountingApiService;
