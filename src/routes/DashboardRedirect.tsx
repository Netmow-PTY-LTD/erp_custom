import { useAppSelector } from "@/store/store";
import { Navigate } from "react-router";
import { sidebarItemLink } from "@/config/sidebarItemLInk";
import { getFirstAllowedRoute } from "@/utils/permissionUtils";
import { DashboardPermission } from "@/config/permissions";
import Dashboard from "@/pages/dashboard/Dashboard";

export default function DashboardRedirect() {
    const user = useAppSelector((state) => state.auth.user);
    const permissions = user?.role?.permissions || [];

    const hasDashboardAccess =
        permissions.includes(DashboardPermission.VIEW) ||
        permissions.includes('*');

    if (hasDashboardAccess) {
        return <Dashboard />;
    }

    // Not allowed to see dashboard, find first allowed route
    const firstRoute = getFirstAllowedRoute(sidebarItemLink, permissions);

    // If no route found or fallback is dashboard (avoid loop), go to unauthorized
    if (firstRoute === "/dashboard") {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Navigate to={firstRoute} replace />;
}
