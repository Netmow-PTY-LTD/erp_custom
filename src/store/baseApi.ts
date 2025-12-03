import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

const baseQuery = fetchBaseQuery({
  //baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1` || "https://jsonplaceholder.typicode.com/",
  baseUrl: `https://jsonplaceholder.typicode.com`,
  credentials: "include",
  prepareHeaders: (headers, api) => {
    // Cast getState() to RootState
    const state = api.getState() as RootState;
    const token = state.auth.token;

    if (token) {
      headers.set("Authorization", token);
    }

    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Auth", "Products", "Users", "Categories"],
  endpoints: () => ({}),
});
