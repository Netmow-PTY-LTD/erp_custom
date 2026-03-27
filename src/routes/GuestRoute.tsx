import { useAppSelector } from "@/store/store";
import { Navigate, Outlet } from "react-router";
import { isTokenExpired } from "./ProtectedRoute";

export default function GuestRoute() {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  const isExpired = isTokenExpired(token);

  // If user is logged in and token is not expired, redirect to dashboard
  if (user && token && !isExpired) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, allow access to guest routes (Login, Register, etc.)
  return <Outlet />;
}
