import { baseApi } from "@/store/baseApi";
import type { PurchaseOrder } from "@/types/purchaseOrder.types";



export type PurchaseResponse = {
  status: boolean;
  message: string;
  data: PurchaseOrder | PurchaseOrder[];
};

export const purchaseApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET ALL PURCHASES
    getAllPurchases: builder.query<PurchaseResponse, void>({
      query: () => ({
        url: "/purchase",
        method: "GET",
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

    // UPDATE PURCHASE ORDER BY ID
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

  }),
});

export const {
  useGetAllPurchasesQuery,
  useAddPurchaseOrderMutation,
  useGetPurchaseOrderByIdQuery,
  useUpdatePurchaseOrderMutation,
} = purchaseApiService;
