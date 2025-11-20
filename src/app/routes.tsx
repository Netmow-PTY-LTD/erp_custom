import { createBrowserRouter } from "react-router";
import App from "../App";
import NotFound from "../pages/NotFound";
import Dashboard from "../Layout/Dashboard";



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
        element: <Dashboard />

    }
]);

export default router;
