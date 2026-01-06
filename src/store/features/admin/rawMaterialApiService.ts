import { baseApi } from "@/store/baseApi";

interface RawMaterialCategory {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

interface RawMaterial {
  id: number;
  name: string;
  sku?: string;
  category_id: number;
  category?: RawMaterialCategory;
  supplier?: string;
  unit_id: number;
  unit?: string;
  cost: number;
  initial_stock: number;
  min_stock: number;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

type RawMaterialCategoryResponse = {
  status: boolean;
  message: string;
  data: RawMaterialCategory[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
};

type RawMaterialCategoryByIdResponse = {
  status: boolean;
  message: string;
  data: RawMaterialCategory;
};

type RawMaterialResponse = {
  status: boolean;
  message: string;
  data: RawMaterial[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
};

type RawMaterialByIdResponse = {
  status: boolean;
  message: string;
  data: RawMaterial;
};

export const rawMaterialApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Raw Material Category APIs
    addRawMaterialCategory: builder.mutation<
      RawMaterialCategoryResponse,
      Partial<RawMaterialCategory>
    >({
      query: (body) => ({
        url: "/raw-materials/category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["RawMaterialCategory"],
    }),

    getAllRawMaterialCategories: builder.query<
      RawMaterialCategoryResponse,
      void | { page?: number; limit?: number; search?: string }
    >({
      query: (params) => {
        const safeParams = params ?? {};

        return {
          url: "/raw-materials/category",
          method: "GET",
          params: safeParams,
        };
      },
      providesTags: ["RawMaterialCategory"],
    }),

    getRawMaterialCategoryById: builder.query<
      RawMaterialCategoryByIdResponse,
      number
    >({
      query: (id) => ({
        url: `/raw-materials/category/${id}`,
        method: "GET",
      }),
      providesTags: ["RawMaterialCategory"],
    }),

    updateRawMaterialCategory: builder.mutation<
      RawMaterialCategoryResponse,
      { id: number; body: Partial<RawMaterialCategory> }
    >({
      query: (payload) => ({
        url: `/raw-materials/category/${payload.id}`,
        method: "PUT",
        body: payload.body,
      }),
      invalidatesTags: ["RawMaterialCategory"],
    }),

    deleteRawMaterialCategory: builder.mutation<
      RawMaterialCategoryResponse,
      number
    >({
      query: (id) => ({
        url: `/raw-materials/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RawMaterialCategory"],
    }),

    // Raw Material APIs
    addRawMaterial: builder.mutation<
      RawMaterialByIdResponse,
      Partial<RawMaterial>
    >({
      query: (body) => ({
        url: "/raw-materials",
        method: "POST",
        body,
      }),
      invalidatesTags: ["RawMaterial"],
    }),

    getAllRawMaterials: builder.query<
      RawMaterialResponse,
      void | { page?: number; limit?: number; search?: string }
    >({
      query: (params) => {
        const safeParams = params ?? {};
        return {
          url: "/raw-materials",
          method: "GET",
          params: safeParams,
        };
      },
      providesTags: ["RawMaterial"],
    }),

    getRawMaterialById: builder.query<RawMaterialByIdResponse, number>({
      query: (id) => ({
        url: `/raw-materials/${id}`,
        method: "GET",
      }),
      providesTags: ["RawMaterial"],
    }),

    updateRawMaterial: builder.mutation<
      RawMaterialByIdResponse,
      { id: number; body: Partial<RawMaterial> }
    >({
      query: (payload) => ({
        url: `/raw-materials/${payload.id}`,
        method: "PUT",
        body: payload.body,
      }),
      invalidatesTags: ["RawMaterial"],
    }),

    deleteRawMaterial: builder.mutation<RawMaterialResponse, number>({
      query: (id) => ({
        url: `/raw-materials/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RawMaterial"],
    }),
  }),
});

export const {
  useAddRawMaterialCategoryMutation,
  useGetAllRawMaterialCategoriesQuery,
  useGetRawMaterialCategoryByIdQuery,
  useUpdateRawMaterialCategoryMutation,
  useDeleteRawMaterialCategoryMutation,
  useAddRawMaterialMutation,
  useGetAllRawMaterialsQuery,
  useGetRawMaterialByIdQuery,
  useUpdateRawMaterialMutation,
  useDeleteRawMaterialMutation,
} = rawMaterialApiService;
