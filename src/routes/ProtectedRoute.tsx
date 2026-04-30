import { useAppDispatch, useAppSelector } from "@/store/store";
import { Navigate, Outlet, useNavigate } from "react-router";
import { useEffect, useMemo } from "react";
import { logout } from "@/store/features/auth/authSlice";

// Helper to check if token is expired
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return false; // If no exp claim, assume not expired (though unlikely for JWT)
    return Date.now() >= exp * 1000;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Assume expired if decoding fails
  }
};

export default function ProtectedRoute() {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isExpired = useMemo(() => isTokenExpired(token), [token]);

  // Handle immediate redirect if already logged out or expired on mount/token change
  useEffect(() => {
    if (!user || !token || isExpired) {
      if (token || user) {
        dispatch(logout());
      }
      navigate('/login', { replace: true });
    }
  }, [user, token, isExpired, navigate, dispatch]);

  // Proactive token expiration timer
  useEffect(() => {
    if (!token) return;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const { exp } = JSON.parse(jsonPayload);
      
      if (exp) {
        const timeLeft = exp * 1000 - Date.now();
        if (timeLeft > 0) {
          const timeout = setTimeout(() => {
            dispatch(logout());
            navigate('/login', { replace: true });
          }, timeLeft);
          return () => clearTimeout(timeout);
        } else {
          dispatch(logout());
          navigate('/login', { replace: true });
        }
      }
    } catch (error) {
      console.error("Error setting expiration timer:", error);
    }
  }, [token, dispatch, navigate]);

  if (!user || !token || isExpired) return <Navigate to="/login" replace />;

  if (!user.role && !user.role_id) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
