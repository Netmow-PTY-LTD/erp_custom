import { createBrowserRouter } from "react-router";
import App from "../App";
import NotFound from "../pages/NotFound";
import DashboardLayout from "../Layout/Dashboard";
import Dashboard from "../pages/Dashboard/Dashboard";
import { generateRoutes } from "../utils/routesGenerators";
import { sidebarItemLInk } from "../config/sidebarItemLInk";




// Generate dynamic dashboard routes (relative paths)
const dashboardRoutes = generateRoutes(sidebarItemLInk, "dashboard");


// Define routes using createBrowserRouter
const rootRouter = createBrowserRouter([
    {
        path: "/",
        element: <App />,             // Layout or main App
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <App />

            },

            // You can add more child routes here
        ],
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            ...dashboardRoutes,
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
