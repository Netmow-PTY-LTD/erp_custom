import type { LoginRequest, LoginResponse } from "./types";
import { baseApi } from "@/store/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    authLogin: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useAuthLoginMutation } = authApi;
