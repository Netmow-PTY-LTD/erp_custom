import { baseApi } from "@/store/baseApi";
import type { Category } from "@/types/types";

type CategoryResponse = {
  status: boolean;
  message: string;
  data: Category[];
};

type CategoryByIdResponse = {
  status: boolean;
  message: string;
  data: Category;
};

export const productsApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProductCategory: builder.mutation({
      query: (body) => ({
        url: "/products/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    getAllCategories: builder.query<CategoryResponse, void>({
      query: () => ({
        url: "/products/categories",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    getCategoryById: builder.query<CategoryByIdResponse, number>({
      query: (id) => ({
        url: `/products/categories/${id}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    updateCategory: builder.mutation<
      CategoryResponse,
      { id: number; body: Partial<Category> }
    >({
      query: (body) => ({
        url: `/products/categories/${body.id}`,
        method: "PUT",
        body: body.body,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<CategoryResponse, number>({
      query: (id) => ({
        url: `/products/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
    useAddProductCategoryMutation,
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = productsApiService;
