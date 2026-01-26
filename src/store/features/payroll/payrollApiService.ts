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
    paid_amount?: number;
    payment_status?: "unpaid" | "partial" | "paid";
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

export interface PayrollAdvanceReturn {
    id: number;
    advance_id: number;
    amount: number;
    return_date: string;
    remarks: string | null;
    created_at: string;
}

export interface PayrollAdvance {
    id: number;
    staff_id: number;
    amount: number;
    advance_date: string;
    reason: string | null;
    status: 'pending' | 'approved' | 'paid' | 'returned' | 'cancelled';
    returned_amount: number;
    returned_date: string | null;
    remarks: string | null;
    created_at: string;
    updated_at: string;
    returns?: PayrollAdvanceReturn[];
    staff?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    };
}

export const payrollApiService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ... (existing endpoints)
        getAllPayrollRuns: builder.query<PayrollResponse<PayrollRun[]>, PayrollQueryParams | void>({
            query: (params) => ({
                url: "/payroll",
                method: "GET",
                params: (params as PayrollQueryParams) || undefined,
            }),
            providesTags: ["Payroll"],
        }),

        getPayrollRunById: builder.query<PayrollResponse<PayrollRun>, number>({
            query: (id) => ({
                url: `/payroll/${id}`,
                method: "GET",
            }),
            providesTags: ["Payroll"],
        }),

        generatePayrollRun: builder.mutation<PayrollResponse<PayrollRun>, { month: string; staff_ids?: number[] }>({
            query: (body) => ({
                url: "/payroll/generate",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Payroll"],
        }),

        approvePayrollRun: builder.mutation<PayrollResponse<PayrollRun>, number>({
            query: (id) => ({
                url: `/payroll/${id}/approve`,
                method: "PATCH",
            }),
            invalidatesTags: ["Payroll"],
        }),

        payPayrollRun: builder.mutation<PayrollResponse<PayrollRun>, number>({
            query: (id) => ({
                url: `/payroll/${id}/pay`,
                method: "PATCH",
            }),
            invalidatesTags: ["Payroll"],
        }),

        deletePayrollRun: builder.mutation<PayrollResponse<null>, number>({
            query: (id) => ({
                url: `/payroll/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Payroll"],
        }),

        // Advance Endpoints
        getAllAdvances: builder.query<PayrollResponse<PayrollAdvance[]>, { staff_id?: number, status?: string, month?: string, page?: number, limit?: number } | void>({
            query: (params) => ({
                url: "/payroll/advances",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["Payroll"],
        }),

        createAdvance: builder.mutation<PayrollResponse<PayrollAdvance>, Partial<PayrollAdvance>>({
            query: (body) => ({
                url: "/payroll/advances",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Payroll"],
        }),

        updateAdvance: builder.mutation<PayrollResponse<PayrollAdvance>, { id: number; body: Partial<PayrollAdvance> }>({
            query: ({ id, body }) => ({
                url: `/payroll/advances/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Payroll"],
        }),

        returnAdvance: builder.mutation<PayrollResponse<PayrollAdvanceReturn>, { id: number; body: { amount: number, return_date: string, remarks?: string } }>({
            query: ({ id, body }) => ({
                url: `/payroll/advances/${id}/return`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Payroll"],
        }),

        deleteAdvance: builder.mutation<PayrollResponse<null>, number>({
            query: (id) => ({
                url: `/payroll/advances/${id}`,
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
    useGetAllAdvancesQuery,
    useCreateAdvanceMutation,
    useUpdateAdvanceMutation,
    useReturnAdvanceMutation, // Exporting the new mutation
    useDeleteAdvanceMutation,
} = payrollApiService;


