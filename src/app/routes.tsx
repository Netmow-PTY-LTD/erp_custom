import { createBrowserRouter } from "react-router";
import App from "../App";
import NotFound from "../pages/NotFound";
import DashboardLayout from "../Layout/Dashboard";
import Dashboard from "../pages/dashboard/Dashboard";



// Define routes using createBrowserRouter
const router = createBrowserRouter([
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

        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />

            },

            // You can add more child routes here
        ],

    }
]);

export default router;







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
