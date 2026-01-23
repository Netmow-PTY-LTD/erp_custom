import { baseApi } from "@/store/baseApi";

export interface PayrollRun {
    id: number;
    month: string;
    total_gross: number;
    total_net: number;
    status: "pending" | "approved" | "paid";
    payment_date: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    items?: PayrollItem[];
}

export interface PayrollItem {
    id: number;
    run_id: number;
    staff_id: number;
    basic_salary: number;
    allowances: { name: string; amount: number }[];
    deductions: { name: string; amount: number }[];
    gross_pay: number;
    net_pay: number;
    created_at: string;
    updated_at: string;
}

export interface PayrollResponse<T> {
    status: boolean;
    message: string;
    data: T;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPage: number;
    };
}

export interface PayrollQueryParams {
    page?: number;
    limit?: number;
    status?: "pending" | "approved" | "paid";
    month?: string;
}

export const payrollApiService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all payroll runs
        getAllPayrollRuns: builder.query<PayrollResponse<PayrollRun[]>, PayrollQueryParams | void>({
            query: (params) => ({
                url: "/payroll",
                method: "GET",
                params: (params as PayrollQueryParams) || undefined,
            }),
            providesTags: ["Payroll"],
        }),

        // Get single payroll run by ID
        getPayrollRunById: builder.query<PayrollResponse<PayrollRun>, number>({
            query: (id) => ({
                url: `/payroll/${id}`,
                method: "GET",
            }),
            providesTags: ["Payroll"],
        }),

        // Generate payroll run
        generatePayrollRun: builder.mutation<PayrollResponse<PayrollRun>, { month: string; staff_ids?: number[] }>({
            query: (body) => ({
                url: "/payroll/generate",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Payroll"],
        }),

        // Approve payroll run
        approvePayrollRun: builder.mutation<PayrollResponse<PayrollRun>, number>({
            query: (id) => ({
                url: `/payroll/${id}/approve`,
                method: "PATCH",
            }),
            invalidatesTags: ["Payroll"],
        }),

        // Pay payroll run
        payPayrollRun: builder.mutation<PayrollResponse<PayrollRun>, number>({
            query: (id) => ({
                url: `/payroll/${id}/pay`,
                method: "PATCH",
            }),
            invalidatesTags: ["Payroll"],
        }),

        // Delete payroll run
        deletePayrollRun: builder.mutation<PayrollResponse<null>, number>({
            query: (id) => ({
                url: `/payroll/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Payroll"],
        }),
    }),
});

export const {
    useGetAllPayrollRunsQuery,
    useGetPayrollRunByIdQuery,
    useGeneratePayrollRunMutation,
    useApprovePayrollRunMutation,
    usePayPayrollRunMutation,
    useDeletePayrollRunMutation,
} = payrollApiService;
