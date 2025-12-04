import { baseApi } from "@/store/baseApi";

export type Overview = {
  totalIncome: number;
  totalExpense: number;
  totalPayroll: number;
  balance: number;
};

export type IncomeExpense = {
  id: number;
  title: string;
  amount: number;
  date: string;
  description?: string;
};

export type Payroll = {
  id: number;
  staff_id: number;
  month: string;
  year: string;
  amount: number;
  status: string;
};

export type AccountingResponse<T> = {
  status: boolean;
  message: string;
  data: T | T[];
};

export const accountingApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET ACCOUNTING OVERVIEW
    getOverview: builder.query<AccountingResponse<Overview>, void>({
      query: () => ({
        url: "/accounting/overview",
        method: "GET",
      }),
      providesTags: ["Accounting"],
    }),

    // GET ALL INCOMES
    getIncomes: builder.query<AccountingResponse<IncomeExpense>, void>({
      query: () => ({
        url: "/accounting/incomes",
        method: "GET",
      }),
      providesTags: ["Accounting"],
    }),

    // ADD INCOME
    addIncome: builder.mutation<AccountingResponse<IncomeExpense>, Partial<IncomeExpense>>({
      query: (body) => ({
        url: "/accounting/incomes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Accounting"],
    }),

    // GET ALL EXPENSES
    getExpenses: builder.query<AccountingResponse<IncomeExpense>, void>({
      query: () => ({
        url: "/accounting/expenses",
        method: "GET",
      }),
      providesTags: ["Accounting"],
    }),

    // ADD EXPENSE
    addExpense: builder.mutation<AccountingResponse<IncomeExpense>, Partial<IncomeExpense>>({
      query: (body) => ({
        url: "/accounting/expenses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Accounting"],
    }),

    // GET PAYROLL
    getPayroll: builder.query<AccountingResponse<Payroll>, void>({
      query: () => ({
        url: "/accounting/payroll",
        method: "GET",
      }),
      providesTags: ["Accounting"],
    }),

    // ADD PAYROLL
    addPayroll: builder.mutation<AccountingResponse<Payroll>, Partial<Payroll>>({
      query: (body) => ({
        url: "/accounting/payroll",
        method: "POST",
        body,
      }),
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
