import { createBrowserRouter } from "react-router";
import App from "../App";
import NotFound from "../pages/NotFound";
import DashboardLayout from "../Layout/Dashboard";
import Dashboard from "../pages/dashboard/Dashboard";
import { generateRoutes } from "../utils/routesGenerators";
import Login from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { sidebarItemLink } from "@/config/sidebarItemLInk";

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
  { path: "/unauthorized", element: <div>Unauthorized</div> },

  // 🔐 PROTECTED DASHBOARD
  {
    element: <ProtectedRoute />, // No allowed[] needed
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          ...dashboardRoutes,
        ],
      },
    ],
  },
]);

export default rootRouter;

//   protected route example

// export const AppRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: <DashboardLayout />,
//     children: roleRoutes.map((r) => ({
//       path: r.path,
//       element: (
//         <ProtectedRoute allowed={r.allowed}>
//           <r.element />
//         </ProtectedRoute>
//       ),
//     })),
//   },
// ]);
