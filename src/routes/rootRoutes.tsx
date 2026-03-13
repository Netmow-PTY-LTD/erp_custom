import { createBrowserRouter } from "react-router";
import App from "../App";
import NotFound from "../pages/NotFound";
import DashboardLayout from "../Layout/Dashboard";

import { generateRoutes } from "../utils/routesGenerators";
import Login from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { sidebarItemLink } from "@/config/sidebarItemLInk";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import Privacy from "@/pages/privacy/Privacy";
import Terms from "@/pages/terms/Terms";
import Contact from "@/pages/contact/Contact";
import ModulesFunctionality from "@/pages/modules/ModulesFunctionality";
import AuthModule from "@/pages/modules/details/AuthModule";
import SalesModule from "@/pages/modules/details/SalesModule";
import ProductsModule from "@/pages/modules/details/ProductsModule";

import DashboardRedirect from "@/routes/DashboardRedirect";

// Generate dynamic dashboard routes (relative paths)
const dashboardRoutes = generateRoutes(sidebarItemLink, "dashboard");


// Define routes using createBrowserRouter

const rootRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [{ index: true, element: <App /> }],
  },

  { path: "/login", element: <Login /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "/terms", element: <Terms /> },
  { path: "/contact", element: <Contact /> },
  { path: "/modules-functionality", element: <ModulesFunctionality /> },
  { path: "/modules/auth", element: <AuthModule /> },
  { path: "/modules/sales", element: <SalesModule /> },
  { path: "/modules/products", element: <ProductsModule /> },
  // Add other module routes here following the same pattern

  //  PROTECTED DASHBOARD
  {
    element: <ProtectedRoute />, // No allowed[] needed
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardRedirect />

          },
          ...dashboardRoutes,
        ],
      },
    ],
  },
]);

export default rootRouter;

