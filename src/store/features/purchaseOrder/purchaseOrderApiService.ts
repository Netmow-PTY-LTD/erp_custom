/* eslint-disable @typescript-eslint/no-explicit-any */


import { baseApi } from "@/store/baseApi";
import type { PurchaseOrder } from "@/types/purchaseOrder.types";

export type PurchaseResponse = {
  success: boolean;
  message: string;
  data: any;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
};

export const purchaseApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    //-------------------------------------
    //  PURCHASE ORDERS
    //-------------------------------------

    // GET ALL PURCHASE ORDERS
    getAllPurchases: builder.query<
      PurchaseResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/purchase/orders",
        method: "GET",
        params,
      }),
      providesTags: ["Purchases"],
    }),

    // ADD PURCHASE ORDER
    addPurchaseOrder: builder.mutation<PurchaseResponse, Partial<PurchaseOrder>>({
      query: (body) => ({
        url: "/purchase/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Purchases"],
    }),

    // GET SINGLE PURCHASE ORDER BY ID
    getPurchaseOrderById: builder.query<PurchaseResponse, string | number>({
      query: (id) => ({
        url: `/purchase/orders/${id}`,
        method: "GET",
      }),
      providesTags: ["Purchases"],
    }),

    // UPDATE PURCHASE ORDER
    updatePurchaseOrder: builder.mutation<
      PurchaseResponse,
      { id: string | number; body: Partial<PurchaseOrder> }
    >({
      query: ({ id, body }) => ({
        url: `/purchase/orders/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Purchases"],
    }),

    // DELETE PURCHASE ORDER
    deletePurchaseOrder: builder.mutation<PurchaseResponse, string | number>({
      query: (id) => ({
        url: `/purchase/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Purchases"],
    }),

    // RECEIVE PURCHASE ORDER
    receivePurchaseOrder: builder.mutation<PurchaseResponse, string | number>({
      query: (id) => ({
        url: `/purchase/orders/${id}/receive`,
        method: "POST",
      }),
      invalidatesTags: ["Purchases"],
    }),

    //-------------------------------------
    //  PURCHASE ORDER INVOICES
    //-------------------------------------

    // GET ALL INVOICES
    getAllPurchaseInvoices: builder.query<
      PurchaseResponse,
      { page?: number; limit?: number, search?:string }
    >({
      query: (params) => ({
        url: "/purchase/orders/invoices",
        method: "GET",
        params,
      }),
      providesTags: ["PurchaseInvoices"],
    }),

    // CREATE INVOICE
    addPurchaseInvoice: builder.mutation<PurchaseResponse, any>({
      query: (body) => ({
        url: "/purchase/orders/invoices",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PurchaseInvoices"],
    }),

    // GET SINGLE INVOICE
    getPurchaseInvoiceById: builder.query<PurchaseResponse, string | number>({
      query: (id) => ({
        url: `/purchase/orders/invoices/${id}`,
        method: "GET",
      }),
      providesTags: ["PurchaseInvoices"],
    }),

    //-------------------------------------
    //  PURCHASE ORDER PAYMENTS
    //-------------------------------------

    // GET ALL PAYMENTS
    getAllPurchasePayments: builder.query<
      PurchaseResponse,
      { page?: number; limit?: number, search?:string }
    >({
      query: (params) => ({
        url: "/purchase/orders/payments",
        method: "GET",
        params,
      }),
      providesTags: ["PurchasePayments"],
    }),

    // ADD PAYMENT
    addPurchasePayment: builder.mutation<PurchaseResponse, any>({
      query: (body) => ({
        url: "/purchase/orders/payments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PurchasePayments"],
    }),

    // GET PAYMENT BY ID
    getPurchasePaymentById: builder.query<PurchaseResponse, string | number>({
      query: (id) => ({
        url: `/purchase/orders/payments/${id}`,
        method: "GET",
      }),
      providesTags: ["PurchasePayments"],
    }),

    //-------------------------------------
    //  PURCHASE MAPS
    //-------------------------------------
    getPurchaseMaps: builder.query<PurchaseResponse, void>({
      query: () => ({
        url: "/purchase/maps",
        method: "GET",
      }),
      providesTags: ["PurchaseMaps"],
    }),

  }),
});

export const {
  // ORDERS
  useGetAllPurchasesQuery,
  useAddPurchaseOrderMutation,
  useGetPurchaseOrderByIdQuery,
  useUpdatePurchaseOrderMutation,
  useDeletePurchaseOrderMutation,
  useReceivePurchaseOrderMutation,

  // INVOICES
  useGetAllPurchaseInvoicesQuery,
  useAddPurchaseInvoiceMutation,
  useGetPurchaseInvoiceByIdQuery,

  // PAYMENTS
  useGetAllPurchasePaymentsQuery,
  useAddPurchasePaymentMutation,
  useGetPurchasePaymentByIdQuery,

  // MAPS
  useGetPurchaseMapsQuery,
} = purchaseApiService;
















// import { baseApi } from "@/store/baseApi";
// import type { PurchaseOrder } from "@/types/purchaseOrder.types";



// export type PurchaseResponse = {
//   success: boolean;
//   message: string;
//   data: PurchaseOrder | PurchaseOrder[];
//   pagination?: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPage: number;
//   };
// };

// export const purchaseApiService = baseApi.injectEndpoints({
//   endpoints: (builder) => ({

//     // GET ALL PURCHASES
//     getAllPurchases: builder.query<PurchaseResponse, { page?: number; limit?: number; search?: string }>({
//       query: (params) => ({
//         url: "/purchase/orders",
//         method: "GET",
//         params,
//       }),
      
//       providesTags: ["Purchases"],
//     }),

//     // ADD PURCHASE ORDER
//     addPurchaseOrder: builder.mutation<PurchaseResponse, Partial<PurchaseOrder>>({
//       query: (body) => ({
//         url: "/purchase/orders",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Purchases"],
//     }),

//     // GET SINGLE PURCHASE ORDER BY ID
//     getPurchaseOrderById: builder.query<PurchaseResponse, string | number>({
//       query: (id) => ({
//         url: `/purchase/orders/${id}`,
//         method: "GET",
//       }),
//       providesTags: ["Purchases"],
//     }),

//     // UPDATE PURCHASE ORDER BY ID
//     updatePurchaseOrder: builder.mutation<
//       PurchaseResponse,
//       { id: string | number; body: Partial<PurchaseOrder> }
//     >({
//       query: ({ id, body }) => ({
//         url: `/purchase/orders/${id}`,
//         method: "PUT",
//         body,
//       }),
//       invalidatesTags: ["Purchases"],
//     }),

//   }),
// });

// export const {
//   useGetAllPurchasesQuery,
//   useAddPurchaseOrderMutation,
//   useGetPurchaseOrderByIdQuery,
//   useUpdatePurchaseOrderMutation,
// } = purchaseApiService;




