import type { User } from "@/types/users.types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: Cookies.get("token") ?? null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      Cookies.set('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      Cookies.remove('token');
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type.includes("executeQuery/fulfilled") && action.meta?.arg?.endpointName === "authUser",
      (state, action: PayloadAction<{ data: { user: User } }>) => {
        if (action.payload?.data?.user) {
          state.user = action.payload.data.user;
        }
      }
    );
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
