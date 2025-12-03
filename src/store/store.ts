// import { configureStore } from "@reduxjs/toolkit";
// import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

// import authReducer from "@/store/features/auth/authSlice";
// //import { authApi } from "@/store/features/auth/authApiService";
// import { baseApi } from "./baseApi";

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,

//     // RTK Query reducers
//     [baseApi.reducerPath]: baseApi.reducer,
//   },

//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware()
//       .concat(baseApi.middleware),
// });

// // TYPES
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// // HOOKS
// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;








// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { loadState, saveState } from "./localStorage";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

const LOCAL_STORAGE_KEY = "reduxState";

// Load persisted state from localStorage
const preloadedState = loadState<{ auth: ReturnType<typeof authReducer> }>(LOCAL_STORAGE_KEY);

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState, // <-- load state here
});

// Save state on every change
store.subscribe(() => {
  saveState(LOCAL_STORAGE_KEY, {
    auth: store.getState().auth,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// HOOKS
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
