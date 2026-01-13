import { baseApi } from "@/store/baseApi";
import type {
  CreditHead,
  DebitHead,
  Expense,
  Income,
  Overview,
  Payroll,
} from "@/types/accounting.types";

// -------------------- OVERVIEW --------------------

export type OverviewResponse = {
  status: boolean;
  message: string;
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
  status: boolean;
  message: string;
  pagination: Pagination;
  data: T[];
};

export type IncomeResponse = ListResponse<Income>;

export type ExpenseResponse = ListResponse<Expense>;

// -------------------- Credit Head --------------------
export type CreditHeadResponse = ListResponse<CreditHead>;

export type CreditHeadByIdResponse = {
  status: boolean;
  message: string;
  data: CreditHead;
};

// -------------------- Debit Head --------------------
export type DebitHeadResponse = ListResponse<DebitHead>;

export type DebitHeadByIdResponse = {
  status: boolean;
  message: string;
  data: DebitHead;
};

// -------------------- PAYROLL --------------------

export type PayrollResponse = ListResponse<Payroll>;

// -------------------- CHART DATA --------------------

export type ChartDataPoint = {
  date: string;
  income: number;
  expense: number;
};

export type ChartResponse = {
  status: boolean;
  message: string;
  data: ChartDataPoint[];
};

// -------------------- RTK QUERY SERVICE --------------------
export const accountingApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ACCOUNTING OVERVIEW
    getAccountingOverview: builder.query<OverviewResponse, void>({
      query: () => ({ url: "/accounting/overview", method: "GET" }),
      providesTags: ["Accounting"],
    }),

    // GET ALL INCOMES
    getIncomes: builder.query<
      IncomeResponse,
      { page?: number; limit?: number; search?: string; date?: string }
    >({
      query: (params) => ({
        url: "/accounting/incomes",
        method: "GET",
        params,
      }),
      providesTags: ["Accounting"],
    }),

    // ADD INCOME
    addIncome: builder.mutation<IncomeResponse, Partial<Income>>({
      query: (body) => ({ url: "/accounting/incomes", method: "POST", body }),
      invalidatesTags: ["Accounting"],
    }),

    // GET ALL EXPENSES
    getExpenses: builder.query<
      ExpenseResponse,
      { page?: number; limit?: number; search?: string; date?: string }
    >({
      query: (params) => ({
        url: "/accounting/expenses",
        method: "GET",
        params,
      }),
      providesTags: ["Accounting"],
    }),

    // ADD EXPENSE
    addExpense: builder.mutation<ExpenseResponse, Partial<Expense>>({
      query: (body) => ({ url: "/accounting/expenses", method: "POST", body }),
      invalidatesTags: ["Accounting"],
    }),

    //Add credit head
    addCreditHead: builder.mutation<CreditHeadResponse, Partial<CreditHead>>({
      query: (body) => ({
        url: "/accounting/credit-head",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Accounting"],
    }),

    // GET CREDIT HEAD
    getAllCreditHeads: builder.query<
      CreditHeadResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/accounting/credit-head",
        method: "GET",
        params,
      }),
      providesTags: ["Accounting"],
    }),

    //get single credit head
    getSingleCreditHead: builder.query<CreditHeadByIdResponse, number>({
      query: (id) => ({ url: `/accounting/credit-head/${id}`, method: "GET" }),
      providesTags: ["Accounting"],
    }),

    //update credit head
    updateCreditHead: builder.mutation<
      CreditHeadResponse,
      { id: number; body: Partial<CreditHead> }
    >({
      query: ({ id, body }) => ({
        url: `/accounting/credit-head/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Accounting"],
    }),

    //delete credit head
    deleteCreditHead: builder.mutation<CreditHeadResponse, number>({
      query: (id) => ({
        url: `/accounting/credit-head/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Accounting"],
    }),

    //Add debit head
    addDebitHead: builder.mutation<DebitHeadResponse, Partial<DebitHead>>({
      query: (body) => ({
        url: "/accounting/debit-head",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Accounting"],
    }),

    // GET CREDIT HEAD
    getAllDebitHeads: builder.query<
      DebitHeadResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/accounting/debit-head",
        method: "GET",
        params,
      }),
      providesTags: ["Accounting"],
    }),

    //get single credit head
    getSingleDebitHead: builder.query<DebitHeadByIdResponse, number>({
      query: (id) => ({ url: `/accounting/debit-head/${id}`, method: "GET" }),
      providesTags: ["Accounting"],
    }),

    //update credit head
    updateDebitHead: builder.mutation<
      DebitHeadResponse,
      { id: number; body: Partial<CreditHead> }
    >({
      query: ({ id, body }) => ({
        url: `/accounting/debit-head/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Accounting"],
    }),

    //delete credit head
    deleteDebitHead: builder.mutation<DebitHeadResponse, number>({
      query: (id) => ({
        url: `/accounting/debit-head/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Accounting"],
    }),

    //GET chart data

    getAccountingChartData: builder.query<ChartResponse, void>({
      query: () => ({ url: "/accounting/charts", method: "GET" }),
      providesTags: ["Accounting"],
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
  useGetAccountingOverviewQuery,
  useGetIncomesQuery,
  useAddIncomeMutation,
  useGetExpensesQuery,
  useAddExpenseMutation,
  useAddCreditHeadMutation,
  useGetAllCreditHeadsQuery,
  useGetSingleCreditHeadQuery,
  useUpdateCreditHeadMutation,
  useDeleteCreditHeadMutation,
  useAddDebitHeadMutation,
  useGetAllDebitHeadsQuery,
  useGetSingleDebitHeadQuery,
  useUpdateDebitHeadMutation,
  useDeleteDebitHeadMutation,
  useGetAccountingChartDataQuery,
  useGetPayrollQuery,
  useAddPayrollMutation,
} = accountingApiService;
