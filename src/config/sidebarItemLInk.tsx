
import { Bell, Car, HandCoins, LayoutDashboard, LineChart, Monitor, Package, Palette, Settings, ShoppingCart, UserPlus, Users, Wrench, } from "lucide-react";
import Dashboard from "../pages/dashboard/Dashboard";
import Products from "../pages/products/Products";
import CreateProduct from "@/pages/products/create";
import Customers from "@/pages/customer/Customers";
import AddCustomer from "@/pages/customer/AddCustomer";
import ProductCategories from "@/pages/products/categories";
import StockManagement from "@/pages/products/stock";
import AddIncomePage from "@/pages/accounting/AddIncomePage";

// This is sample data.
export const sidebarItemLink = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    element: <Dashboard />,
  },
  {
    title: "Products",
    url: "#",
    icon: Package,
    items: [
      {
        title: "Products",
        url: "/dashboard/products",
        element: <Products />,
      },
      {
        title: "Add Product",
        url: "/dashboard/products/create",
        element: <CreateProduct />,
      },
      {
        title: "Categories",
        url: "/dashboard/products/categories",
        element: <ProductCategories />,
      },
      {
        title: "Stock Management",
        url: "/dashboard/products/stock",
        element: <StockManagement />,
      },
    ],
  },
  {
    title: "Customers",
    url: "#",
    icon: Users,
    items: [
      {
        title: "List of Customers",
        url: "/dashboard/customers",
         element: <Customers />,
      },
      {
        title: "Add Customer",
        url: "/dashboard/customers/create",
         element: <AddCustomer />,
      },
    ],
  },
  {
    title: "Suppliers",
    url: "#",
    icon: Car,
    items: [
      {
        title: "List of Suppliers",
        url: "/dashboard/suppliers",
      },
      {
        title: "Add Supplier",
        url: "/dashboard/suppliers/create",
      },
      {
        title: "Purchase Orders",
        url: "/dashboard/suppliers/purchase-orders",
      },
    ],
  },
  {
    title: "Sales & Orders",
    url: "#",
    icon: ShoppingCart,
    items: [
      {
        title: "Orders",
        url: "/dashboard/orders",
      },
      {
        title: "Create Order",
        url: "/dashboard/orders/create",
      },
      {
        title: "Invoices",
        url: "/dashboard/invoices",
      },
      {
        title: "Payments",
        url: "/dashboard/payments",
      },
      {
        title: "Warehouses",
        url: "/dashboard/warehouses",
      },
      {
        title: "Delivery",
        url: "/dashboard/delivery",
      },
    ],
  },
  {
    title: "Accounting",
    url: "#",
    icon: HandCoins,
    items: [
      {
        title: "Overview",
        url: "/dashboard/accounting",
      },
      {
        title: "Incomes",
        url: "/dashboard/accounting/incomes",
      },
      {
        title: "Expenses",
        url: "/dashboard/accounting/expenses",
      },
      {
        title: "Add Income",
        url: "/dashboard/accounting/add-income",
        element:<AddIncomePage/>
      },
      {
        title: "Add Expanse",
        url: "/dashboard/accounting/add-expanse",
      },
    ],
  },
  {
    title: "Payroll",
    url: "/dashboard/payroll",
    icon: HandCoins,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    items: [
      {
        title: "Profile",
        url: "/dashboard/settings",
        icon: UserPlus,
      },
      {
        title: "Account",
        url: "/dashboard/settings/account",
        icon: Wrench,
      },
      {
        title: "Appearance",
        url: "/dashboard/settings/appearance",
        icon: Palette,
      },
      {
        title: "Notifications",
        url: "/dashboard/settings/notifications",
        icon: Bell,
      },
      {
        title: "Display",
        url: "/dashboard/settings/display",
        icon: Monitor,
      },
    ],
  },
  {
    title: "Reports",
    url: "#",
    icon: LineChart,
    items: [
      {
        title: "Sales Reports",
        url: "/dashboard/reports/sales",
      },
      {
        title: "Inventory Reports",
        url: "/dashboard/reports/inventory",
      },
      {
        title: "Customers Reports",
        url: "/dashboard/reports/customers",
      },
      {
        title: "Suppliers Reports",
        url: "/dashboard/reports/suppliers",
      },
      {
        title: "Purchase Reports",
        url: "/dashboard/reports/purchases",
      },
      {
        title: "Payments",
        url: "/dashboard/reports/payments",
      },
      {
        title: "Staff Reports",
        url: "/dashboard/reports/staff",
      },
    ],
  },
];
