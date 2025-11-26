import {
  Car,
  HandCoins,
  LayoutDashboard,
  LineChart,
  Package,
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
import CreateRoutePage from "@/pages/sales-routes/create";
import RouteDetails from "@/pages/sales-routes/RouteDetails";
import AssignRoutePage from "@/pages/sales-routes/AssignRoute";
import Staffs from "@/pages/staffs";
import StaffDetails from "@/pages/staffs/StaffDetails";
import AddStaffPage from "@/pages/staffs/add";
import EditStaff from "@/pages/staffs/edit";
import EditCustomerPage from "@/pages/customer/EditCustomerPage";
import CustomerViewPage from "@/pages/customer/CustomerViewPage";
import CustomersMapPage from "@/pages/customer/CustomersMapPage";
import UserProfilePage from "@/pages/Settings/pages/UserProfilePage";
import AccountSettings from "@/pages/Settings/pages/Account";
import SalesRprots from "@/pages/reports/SalesRprots";
import InventoryReports from "@/pages/reports/InventoryReports";
import CustomerReports from "@/pages/reports/CustomerReports";
import StaffReports from "@/pages/reports/StaffReports";
import SettingsSidebarLayout from "@/pages/Settings/Settings";
// import SuppliersReports from "@/pages/reports/SuppliersReports";
// import PurchaseReports from "@/pages/reports/PurchaseReports";
// import PaymentsReport from "@/pages/reports/PaymentsReport";

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
      {
        title: "Customer Maps",
        url: "/dashboard/customers/map",
        element: <CustomersMapPage />,
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
        element: <EditSupplierPage />
      },
      {
        title: "Purchase Orders",
        url: "/dashboard/suppliers/purchase-orders",
        element: <PurchaseOrdersList />
      },
      {
        title: "",
        url: "/dashboard/purchase-orders/:purchaseId",
        element: <ViewPurchaseOrderPage />
      },
      {
        title: "",
        url: "/purchase-orders/create",
        element: <CreatePurchaseOrderPage />,
      },
    ],
  },
   {
    title: "Staffs",
    url: "#",
    icon: Users,
    items: [
      {
        title: "All Staffs",
        url: "/dashboard/staffs",
        element: <Staffs />,
      },
      {
        title: "",
        url: "/dashboard/staffs/:staffId",
        element: <StaffDetails />,
      },
      {
        title: "Add Staff",
        url: "/dashboard/staffs/add",
        element: <AddStaffPage />,
      },
      {
        title: "",
        url: "/dashboard/staffs/:staffId/edit",
        element: <EditStaff />,
      },
      {
        title: "Departments",
        url: "/dashboard/departments",
      },
      {
        title: "Attendance",
        url: "/dashboard/staffs/attendance",
      },
      {
        title: "Leave Management",
        url: "/dashboard/staffs/leaves",
        element: <AddExpensePage />,
      },
      {
        title: "Staff Map",
        url: "/dashboard/staffs/map",
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
        element: <RouteDetails />,
      },
      {
        title: "",
        url: "/dashboard/sales-routes/create",
        element: <CreateRoutePage />,
      },
      {
        title: "",
        url: "/dashboard/sales-routes/:routeId/assign",
        element: <AssignRoutePage />,
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
    // url: "#",
    url: "/dashboard/settings",
    icon: Settings,
    layout: <SettingsSidebarLayout />,
    items: [
      {
        title: "Profile",
        url: "/dashboard/settings/profile",
        icon: UserPlus,
        element: <UserProfilePage />
      },
      {
        title: "Account",
        url: "/dashboard/settings/account",
        icon: Wrench,
        element: <AccountSettings />
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
        element: <SalesRprots />
      },
      {
        title: "Inventory Reports",
        url: "/dashboard/reports/inventory",
        element: <InventoryReports />
      },
      {
        title: "Customers Reports",
        url: "/dashboard/reports/customers",
        element: <CustomerReports />
      },
      // {
      //   title: "Suppliers Reports",
      //   url: "/dashboard/reports/suppliers",
      //   element:<SuppliersReports/>
      // },
      // {
      //   title: "Purchase Reports",
      //   url: "/dashboard/reports/purchases",
      //   element:<PurchaseReports/>
      // },
      // {
      //   title: "Payments",
      //   url: "/dashboard/reports/payments",
      //   element:<PaymentsReport/>
      // },
      {
        title: "Staff Reports",
        url: "/dashboard/reports/staff",
        element: <StaffReports />
      },
    ],
  },
];



