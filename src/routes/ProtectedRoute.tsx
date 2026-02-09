import { useAppSelector } from "@/store/store";
import { Navigate, Outlet, useNavigate } from "react-router";
import { useEffect } from "react";

export default function ProtectedRoute() {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const navigate = useNavigate();

  // Monitor auth state changes and redirect immediately when logged out
  useEffect(() => {
    if (!user || !token) {
      navigate('/login', { replace: true });
    }
  }, [user, token, navigate]);

  if (!user || !token) return <Navigate to="/login" replace />;

  if (!user.role && !user.role_id) {
    return <Navigate to="/unauthorized" replace />;
  }


  return <Outlet />;
}
