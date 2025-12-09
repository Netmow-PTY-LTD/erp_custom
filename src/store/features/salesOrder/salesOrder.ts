/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/store/baseApi";
import type { InvoiceCreatePayload, SalesInvoice } from "@/types/salesInvoice.types";
import type { SalesOrder, SalesOrderFormValues } from "@/types/salesOrder.types";
import type { SalesPayment } from "@/types/salesPayment.types";
import type { Warehouse } from "@/types/warehouse.types";


export type SalesResponse<T = any> = {
  status: boolean;
  message: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
};

export const salesApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ============================
    // SALES ORDERS
    // ============================

    // GET ALL SALES ORDERS
    getAllSalesOrders: builder.query<
      SalesResponse<SalesOrder[]>,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/sales/orders",
        method: "GET",
        params,
      }),
      providesTags: ["SalesOrders"],
    }),

    // CREATE SALES ORDER
    addSalesOrder: builder.mutation<
      SalesResponse<SalesOrder>,
      SalesOrderFormValues
    >({
      query: (body) => ({
        url: "/sales/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SalesOrders"],
    }),

    // GET SINGLE SALES ORDER BY ID
    getSalesOrderById: builder.query<SalesResponse<SalesOrder>, string | number>(
      {
        query: (id) => ({
          url: `/sales/orders/${id}`,
          method: "GET",
        }),
        providesTags: ["SalesOrders"],
      }
    ),

    // ============================
    // INVOICES
    // ============================

    // GET ALL SALES INVOICES
    getSalesInvoices: builder.query<
      SalesResponse<SalesInvoice[]>,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/sales/orders/invoices",
        method: "GET",
        params,
      }),
      providesTags: ["SalesInvoices"],
    }),

    // CREATE SALES INVOICE
    addSalesInvoice: builder.mutation<
      SalesResponse<SalesInvoice>,
     InvoiceCreatePayload
    >({
      query: (body) => ({
        url: "/sales/orders/invoices",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SalesInvoices"],
    }),


        // GET SINGLE SALES INVOICE BY ID
    getInvoiceById: builder.query< SalesResponse<SalesInvoice>, string | number>(
      {
        query: (id) => ({
          url: `/sales/orders/invoices/${id}`,
          method: "GET",
        }),
        providesTags: ["SalesInvoice"],
      }
    ),

    // ============================
    // PAYMENTS
    // ============================

    // CREATE SALES PAYMENT
    addSalesPayment: builder.mutation<
      SalesResponse<SalesPayment>,
      Partial<SalesPayment>
    >({
      query: (body) => ({
        url: "/sales/orders/payments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SalesPayments"],
    }),


       // GET ALL Payments
    getSalesPayment: builder.query<
       SalesResponse<SalesPayment[]>,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/sales/orders/payments",
        method: "GET",
        params,
      }),
      providesTags: ["SalesPayments"],
    }),

    // ============================
    // WAREHOUSES
    // ============================

    // GET WAREHOUSES
    getSalesWarehouses: builder.query<
      SalesResponse<Warehouse[]>,
      void
    >({
      query: () => ({
        url: "/sales/warehouses",
        method: "GET",
      }),
      providesTags: ["Warehouses"],
    }),

    // ADD WAREHOUSE
    addSalesWarehouse: builder.mutation<
      SalesResponse<Warehouse>,
      Partial<Warehouse>
    >({
      query: (body) => ({
        url: "/sales/warehouses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Warehouses"],
    }),

    // ============================
    // SALES ROUTES
    // ============================

    getSalesRoutes: builder.query<SalesResponse<any[]>, void>({
      query: () => ({
        url: "/sales/sales/routes",
        method: "GET",
      }),
      providesTags: ["SalesRoutes"],
    }),
  }),
});

export const {
  useGetAllSalesOrdersQuery,
  useAddSalesOrderMutation,
  useGetSalesOrderByIdQuery,
  useGetSalesInvoicesQuery,
  useAddSalesInvoiceMutation,
  useGetInvoiceByIdQuery,
  useLazyGetInvoiceByIdQuery,
  useAddSalesPaymentMutation,
  useGetSalesPaymentQuery,
  useGetSalesWarehousesQuery,
  useAddSalesWarehouseMutation,
  useGetSalesRoutesQuery,
} = salesApiService;
