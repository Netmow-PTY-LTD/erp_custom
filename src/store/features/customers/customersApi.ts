import { baseApi } from "../../baseApi";
import type {
   
    CreateCustomerRequest,
    UpdateCustomerRequest,
    GetCustomersParams,
    GetCustomersResponse,
    CustomerResponse,
    DeleteCustomerResponse,
    GetCustomerMapsResponse,
} from "./types";

export const customersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all customers with pagination
        getCustomers: builder.query<GetCustomersResponse, GetCustomersParams | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();

                if (params) {
                    if (params.page) queryParams.append("page", params.page.toString());
                    if (params.limit) queryParams.append("limit", params.limit.toString());
                    if (params.customer_type) queryParams.append("customer_type", params.customer_type);
                    if (params.is_active !== undefined) queryParams.append("is_active", params.is_active.toString());
                    if (params.search) queryParams.append("search", params.search);
                }

                return {
                    url: `/customers${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: "Customers" as const, id })),
                        { type: "Customers", id: "LIST" },
                    ]
                    : [{ type: "Customers", id: "LIST" }],
        }),

        // Get single customer by ID
        getCustomerById: builder.query<CustomerResponse, number | string>({
            query: (id) => ({
                url: `/customers/${id}`,
                method: "GET",
            }),
            providesTags: (result, _error, id) => [{ type: "Customers", id }],
        }),

        // Create new customer
        createCustomer: builder.mutation<CustomerResponse, CreateCustomerRequest>({
            query: (data) => ({
                url: "/customers",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Customers", id: "LIST" }],
        }),

        // Update existing customer
        updateCustomer: builder.mutation<
            CustomerResponse,
            { id: number | string; data: UpdateCustomerRequest }
        >({
            query: ({ id, data }) => ({
                url: `/customers/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Customers", id },
                { type: "Customers", id: "LIST" },
            ],
        }),

        // Delete customer
        deleteCustomer: builder.mutation<DeleteCustomerResponse, number | string>({
            query: (id) => ({
                url: `/customers/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Customers", id: "LIST" }],
        }),

        // Get customer locations for map
        getCustomerMaps: builder.query<GetCustomerMapsResponse, void>({
            query: () => ({
                url: "/customers/maps",
                method: "GET",
            }),
            providesTags: [{ type: "Customers", id: "MAP" }],
        }),
    }),
});

export const {
    useGetCustomersQuery,
    useGetCustomerByIdQuery,
    useCreateCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
    useGetCustomerMapsQuery,
} = customersApi;
