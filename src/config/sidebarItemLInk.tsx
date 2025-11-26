import {
  Bell,
  Car,
  HandCoins,
  LayoutDashboard,
  LineChart,
  Monitor,
  Package,
  Palette,
  Settings,
  ShoppingCart,
  UserPlus,
  Users,
  Wrench,
} from "lucide-react";
import Dashboard from "../pages/dashboard/Dashboard";
import Products from "../pages/products/Products";
import CreateProduct from "@/pages/products/create";
import Customers from "@/pages/customer/Customers";
import AddCustomer from "@/pages/customer/AddCustomer";
import ProductCategories from "@/pages/products/categories";
import StockManagement from "@/pages/products/stock";
import Orders from "@/pages/orders";
import Invoices from "@/pages/invoices";
import Payments from "@/pages/payments";
import CreateOrderPage from "@/pages/orders/create";
import EditOrderPage from "@/pages/orders/edit";
import OrderDetails from "@/pages/orders/OrderDetails";
import AddIncomePage from "@/pages/accounting/AddIncomePage";
import AddExpensePage from "@/pages/accounting/AddExpanse";
import Expenses from "@/pages/accounting/Expenses";
import IncomePage from "@/pages/accounting/Income";
import AccountingOverview from "@/pages/accounting/Accounting";
import InvoiceDetailsPage from "@/pages/invoices/InvoiceDetails";
import CreatePaymentPage from "@/pages/payments/create";
import PaymentDetails from "@/pages/payments/PaymentDetails";
import SuppliersList from "@/pages/suppliers/suppliersList";
import AddSupplierPage from "@/pages/suppliers/AddSupplier";
import WarehousesPage from "@/pages/warehouse";
import DeliveryPage from "@/pages/delivery";
import SalesRoutesPage from "@/pages/sales-routes";
import PurchaseOrdersList from "@/pages/suppliers/PurchaseOrdersList";
import EditSupplierPage from "@/pages/suppliers/EditSupplier";
import CreatePurchaseOrderPage from "@/pages/suppliers/CreatePurchaseOrderPage";
import ViewPurchaseOrderPage from "@/pages/suppliers/ViewPurchaseOrderPage";
import EditCustomerPage from "@/pages/customer/EditCustomerPage";
import CustomerViewPage from "@/pages/customer/CustomerViewPage";

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
        title: "",
        url: "/dashboard/customers/:customerId",
        element: <CustomerViewPage />,
      },
      {
        title: "Add Customer",
        url: "/dashboard/customers/create",
        element: <AddCustomer />,
      },
      {
        title: "",
        url: "/dashboard/customers/:customerId/edit",
        element: <EditCustomerPage />,
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
        element: <SuppliersList />,
      },
      {
        title: "Add Supplier",
        url: "/dashboard/suppliers/create",
        element: <AddSupplierPage />,
      },
      {
        title: "",
        url: "/dashboard/suppliers/:supplierId/edit",
        element:<EditSupplierPage/>
      },
      {
        title: "Purchase Orders",
        url: "/dashboard/suppliers/purchase-orders",
        element:<PurchaseOrdersList/>
      },
      {
        title: "",
        url: "/dashboard/purchase-orders/:purchaseId",
        element:<ViewPurchaseOrderPage/>
      },
      {
        title: "",
        url: "/purchase-orders/create",
        element:<CreatePurchaseOrderPage/>
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
        element: <Orders />,
      },
      {
        title: "",
        url: "/dashboard/orders/:orderId",
        element: <OrderDetails />,
      },
      {
        title: "Create Order",
        url: "/dashboard/orders/create",
        element: <CreateOrderPage />,
      },
      {
        title: "",
        url: "/dashboard/orders/:orderId/edit",
        element: <EditOrderPage />,
      },
      {
        title: "Invoices",
        url: "/dashboard/invoices",
        element: <Invoices />,
      },
      {
        title: "",
        url: "/dashboard/invoices/:invoiceId",
        element: <InvoiceDetailsPage />,
      },
      {
        title: "Payments",
        url: "/dashboard/payments",
        element: <Payments />,
      },
      {
        title: "",
        url: "/dashboard/payments/:paymentId",
        element: <PaymentDetails />,
      },
      {
        title: "",
        url: "/dashboard/payments/create",
        element: <CreatePaymentPage />,
      },
      {
        title: "Warehouses",
        url: "/dashboard/warehouses",
        element: <WarehousesPage />,
      },
      {
        title: "Delivery",
        url: "/dashboard/delivery",
        element: <DeliveryPage />,
      },
      {
        title: "Sales Routes",
        url: "/dashboard/sales-routes",
        element: <SalesRoutesPage />,
      },
       {
        title: "",
        url: "/dashboard/sales-routes/:routeId",
        element: <div>Sales Route</div>,
      },
        {
        title: "",
        url: "/dashboard/sales-routes/create",
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
        element: <AccountingOverview />,
      },
      {
        title: "Incomes",
        url: "/dashboard/accounting/incomes",
        element: <IncomePage />,
      },
      {
        title: "Expenses",
        url: "/dashboard/accounting/expenses",
        element: <Expenses />,
      },
      {
        title: "",
        url: "/dashboard/accounting/add-income",
        element: <AddIncomePage />,
      },
      {
        title: "",
        url: "/dashboard/accounting/add-expanse",
        element: <AddExpensePage />,
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
