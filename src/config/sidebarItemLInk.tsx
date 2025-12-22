import {
  Car,
  HandCoins,
  KeyRound,
  LayoutDashboard,
  LineChart,
  Package,
  Pencil,
  Settings,
  ShieldCheck,
  ShoppingCart,
  UserCog,
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
import Orders from "@/pages/salesOrders/order/OrderList";
import Invoices from "@/pages/salesOrders/invoices";
import Payments from "@/pages/salesOrders/payments/Payments";
import CreateOrderPage from "@/pages/salesOrders/order/createOrder";
import EditOrderPage from "@/pages/salesOrders/order/editOrder";
import OrderDetails from "@/pages/salesOrders/order/OrderDetails";
import AddIncomePage from "@/pages/accounting/AddIncomePage";
import AddExpensePage from "@/pages/accounting/AddExpanse";
import Expenses from "@/pages/accounting/Expenses";
import IncomePage from "@/pages/accounting/Income";
import AccountingOverview from "@/pages/accounting/Accounting";
import InvoiceDetailsPage from "@/pages/salesOrders/invoices/InvoiceDetails";
import CreatePaymentPage from "@/pages/salesOrders/payments/createPayment";
import PaymentDetails from "@/pages/salesOrders/payments/PaymentDetails";
import SuppliersList from "@/pages/suppliers/supplier/suppliersList";
import AddSupplierPage from "@/pages/suppliers/supplier/AddSupplier";
// import WarehousesPage from "@/pages/warehouse";
import DeliveryPage from "@/pages/salesOrders/delivery/DeliveryPage";
import SalesRoutesPage from "@/pages/salesOrders/salesRoutes/SalesRoutePage";
import PurchaseOrdersList from "@/pages/suppliers/purchaseOrder/PurchaseOrdersList";
import EditSupplierPage from "@/pages/suppliers/supplier/EditSupplier";
import CreatePurchaseOrderPage from "@/pages/suppliers/purchaseOrder/CreatePurchaseOrderPage";
import ViewPurchaseOrderPage from "@/pages/suppliers/purchaseOrder/ViewPurchaseOrderPage";
import RouteDetails from "@/pages/salesOrders/salesRoutes/RouteDetails";
import AssignRoutePage from "@/pages/salesOrders/salesRoutes/AssignRoute";
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
import SettingsSidebarLayout from "@/pages/Settings/Settings";
import LeavesManagement from "@/pages/staffs/leaves";
//import Roles from "@/pages/roles";
import AttendancePage from "@/pages/staffs/attendance";
//import PermissionsPage from "@/pages/permissions";
import UnitsPage from "@/pages/unit";
import DepartmentsPage from "@/pages/departments";
import ProductDetailsPage from "@/pages/products/ProductDetails";
import EditProductPage from "@/pages/products/edit";
import UsersList from "@/pages/users/UsersList";
import UserDetails from "@/pages/users/UserDetails";
import AddUserPage from "@/pages/users/AddUser";
import EditUserPage from "@/pages/users/EditUser";
import StaffReports from "@/pages/reports/StaffReports";
import CustomerReports from "@/pages/reports/CustomerReports";
import EditPurchaseOrderPage from "@/pages/suppliers/purchaseOrder/EditPurchaseOrderPage";
import CreateRoutePage from "@/pages/salesOrders/salesRoutes/CreateRoute";
import InvoicePrintPreview from "@/pages/salesOrders/invoices/InvoicePrintPreview";
import PurchaseInvoicesList from "@/pages/suppliers/purchaseOrderInvoices/PurchaseInvoicesList";
import PurchaseInvoicesDetails from "@/pages/suppliers/purchaseOrderInvoices/PurchaseInvoicesDetails";

import PurchasePayments from "@/pages/suppliers/purchasePayments/PurchasePayments";
import PurchasePaymentsDetails from "@/pages/suppliers/purchasePayments/PurchasePaymentsDetails";
import CreatePurchasePayments from "@/pages/suppliers/purchasePayments/CreatePurchasePayments";
import PurchaseOrdersMapPage from "@/pages/suppliers/PurchaseOrdersMap";
import CreditHead from "@/pages/accounting/CreditHead";
import DebitHead from "@/pages/accounting/DebitHead";
import Roles from "@/pages/rolesPermission/Roles";
import PermissionsPage from "@/pages/rolesPermission/PermissionsPage";
import PurchaseInvoicePrintPreview from "@/pages/suppliers/purchaseOrderInvoices/PurchaseInvoicePrintPreview";
import { Permission } from "./permissions";


// This is sample data.
export const _sidebarItemLink = [
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
        title: "",
        url: "/dashboard/products/:productId",
        element: <ProductDetailsPage />,
      },
      {
        title: "Add Product",
        url: "/dashboard/products/create",
        element: <CreateProduct />,
      },
      {
        title: "",
        url: "/dashboard/products/:productId/edit",
        element: <EditProductPage />,
      },
      {
        title: "Categories",
        url: "/dashboard/products/categories",
        element: <ProductCategories />,
      },
      {
        title: "Unit",
        url: "/dashboard/products/unit",
        element: <UnitsPage />,
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
        title: "",
        url: "/dashboard/customers/sales-routes/:routeId",
        element: <RouteDetails />,
      },
      {
        title: "",
        url: "/dashboard/customers/sales-routes/:routeId/assign",
        element: <AssignRoutePage />,
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
        url: "/dashboard/purchase-orders/:purchaseId/edit",
        element: <EditPurchaseOrderPage />
      },
      {
        title: "",
        url: "/purchase-orders/create",
        element: <CreatePurchaseOrderPage />,
      },
      {
        title: "Purchase Invoices",
        url: "/dashboard/purchase-invoices",
        element: <PurchaseInvoicesList />,
      },
      {
        title: "",
        url: "/dashboard/purchase-invoices/:id",
        element: <PurchaseInvoicesDetails />,
      },

       {
        title: "",
        url: "/dashboard/purchase-invoices/:id/preview",
        element: <PurchaseInvoicePrintPreview />,
      },

      // PURCHASE PAYMENTS ROUTES
      {
        title: "",
        url: "/dashboard/purchase-payments/create",
        element: <CreatePurchasePayments />,
      },
      {
        title: "Purchase Payments",
        url: "/dashboard/purchase-payments",
        element: <PurchasePayments />,
      },
      {
        title: "",
        url: "/dashboard/purchase-payments/:id",
        element: <PurchasePaymentsDetails />,
      },
      {
        title: "Purchase Orders Map",
        url: "/dashboard/purchase-orders-map",
        element: <PurchaseOrdersMapPage />,
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
        title: "",
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
        element: <DepartmentsPage />,
      },
      {
        title: "Attendance",
        url: "/dashboard/staffs/attendance",
        element: <AttendancePage />,
      },
      {
        title: "Leave Management",
        url: "/dashboard/staffs/leaves",
        element: <LeavesManagement />,
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
        url: "/dashboard/sales/orders",
        element: <Orders />,
      },
      {
        title: "",
        url: "/dashboard/sales/orders/:orderId",
        element: <OrderDetails />,
      },
      {
        title: "",
        url: "/dashboard/sales/orders/create",
        element: <CreateOrderPage />,
      },
      {
        title: "",
        url: "/dashboard/sales/orders/:orderId/edit",
        element: <EditOrderPage />,
      },
      {
        title: "Invoices",
        url: "/dashboard/sales/invoices",
        element: <Invoices />,
      },
      {
        title: "",
        url: "/dashboard/sales/invoices/:invoiceId",
        element: <InvoiceDetailsPage />,
      },
      {
        title: "",
        url: "/dashboard/sales/invoices/:invoiceId/preview",
        element: <InvoicePrintPreview />,
      },
      {
        title: "Payments",
        url: "/dashboard/sales/payments",
        element: <Payments />,
      },
      {
        title: "",
        url: "/dashboard/sales/payments/:paymentId",
        element: <PaymentDetails />,
      },
      {
        title: "",
        url: "/dashboard/sales/payments/create",
        element: <CreatePaymentPage />,
      },
      // {
      //   title: "Warehouses",
      //   url: "/dashboard/warehouses",
      //   element: <WarehousesPage />,
      // },
      {
        title: "Delivery",
        url: "/dashboard/sales/delivery",
        element: <DeliveryPage />,
      },
      {
        title: "Sales Routes",
        url: "/dashboard/sales/sales-routes",
        element: <SalesRoutesPage />,
      },
      {
        title: "",
        url: "/dashboard/sales/sales-routes/:routeId",
        element: <RouteDetails />,
      },
      {
        title: "",
        url: "/dashboard/sales/sales-routes/create",
        element: <CreateRoutePage />,
      },
      {
        title: "",
        url: "/dashboard/sales/sales-routes/:routeId/assign",
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
        title: "Credit Heads",
        url: "/dashboard/accounting/credit-head",
        element: <CreditHead />,
      },
      {
        title: "Debit Heads",
        url: "/dashboard/accounting/debit-head",
        element: <DebitHead />,
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
    title: "Users",
    url: "#",
    icon: Users,
    items: [
      {
        title: "User List",
        url: "/dashboard/users/list",
        icon: Users,
        element: <UsersList />,
      },
      {
        title: "Add Users",
        url: "/dashboard/users/add",
        icon: UserPlus,
        element: <AddUserPage />
      },
      {
        title: "",
        url: "/dashboard/users/:userId/edit",
        icon: Pencil,
        element: <EditUserPage />
      },
      {
        title: "",
        url: "/dashboard/users/:userId",
        element: <UserDetails />
      },

    ],
  },
  {
    title: "Roles & Permissions",
    url: "#",
    icon: ShieldCheck,
    items: [
      {
        title: "Roles",
        url: "/dashboard/roles",
        element: <Roles />,
        icon: UserCog,
      },
      {
        title: "Permissions",
        url: "/dashboard/permissions",
        element: <PermissionsPage />,
        icon: KeyRound,
      },
    ],
  },
  {
    title: "Settings",
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
        title: "Customer Reports",
        url: "/dashboard/reports/customers",
        element: <CustomerReports />
      },

      {
        title: "Staff Reports",
        url: "/dashboard/reports/staffs",
        element: <StaffReports />
      },

    ],
  },
];








// permission value

export const sidebarItemLink = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    element: <Dashboard />,
    allowedPermissions: [Permission.VIEW_DASHBOARD],
  },
  {
    title: "Products",
    url: "#",
    icon: Package,
    allowedPermissions: [Permission.VIEW_PRODUCTS],
    items: [
      {
        title: "Products",
        url: "/dashboard/products",
        element: <Products />,
        allowedPermissions: [Permission.VIEW_PRODUCTS_LIST],
      },
      {
        title: "",
        url: "/dashboard/products/:productId",
        element: <ProductDetailsPage />,
        allowedPermissions: [Permission.VIEW_PRODUCT_DETAILS],
      },
      {
        title: "Add Product",
        url: "/dashboard/products/create",
        element: <CreateProduct />,
        allowedPermissions: [Permission.CREATE_PRODUCT],
      },
      {
        title: "",
        url: "/dashboard/products/:productId/edit",
        element: <EditProductPage />,
        allowedPermissions: [Permission.EDIT_PRODUCT],
      },
      {
        title: "Categories",
        url: "/dashboard/products/categories",
        element: <ProductCategories />,
        allowedPermissions: [Permission.VIEW_PRODUCT_CATEGORIES],
      },
      {
        title: "Unit",
        url: "/dashboard/products/unit",
        element: <UnitsPage />,
        allowedPermissions: [Permission.VIEW_UNITS],
      },
      {
        title: "Stock Management",
        url: "/dashboard/products/stock",
        element: <StockManagement />,
        allowedPermissions: [Permission.MANAGE_STOCK],
      },
    ],
  },
  {
    title: "Customers",
    url: "#",
    icon: Users,
    allowedPermissions: [Permission.VIEW_CUSTOMERS],
    items: [
      {
        title: "List of Customers",
        url: "/dashboard/customers",
        element: <Customers />,
        allowedPermissions: [Permission.VIEW_CUSTOMER_LIST],
      },
      {
        title: "",
        url: "/dashboard/customers/:customerId",
        element: <CustomerViewPage />,
        allowedPermissions: [Permission.VIEW_CUSTOMER_DETAILS],
      },
      {
        title: "Add Customer",
        url: "/dashboard/customers/create",
        element: <AddCustomer />,
        allowedPermissions: [Permission.CREATE_CUSTOMER],
      },
      {
        title: "",
        url: "/dashboard/customers/:customerId/edit",
        element: <EditCustomerPage />,
        allowedPermissions: [Permission.EDIT_CUSTOMER],
      },
      {
        title: "",
        url: "/dashboard/customers/sales-routes/:routeId",
        element: <RouteDetails />,
        allowedPermissions: [Permission.VIEW_ROUTE_DETAILS],
      },
      {
        title: "",
        url: "/dashboard/customers/sales-routes/:routeId/assign",
        element: <AssignRoutePage />,
        allowedPermissions: [Permission.ASSIGN_ROUTE],
      },
      {
        title: "Customer Maps",
        url: "/dashboard/customers/map",
        element: <CustomersMapPage />,
        allowedPermissions: [Permission.VIEW_CUSTOMER_MAP],
      },
    ],
  },
  {
    title: "Suppliers",
    url: "#",
    icon: Car,
    allowedPermissions: [Permission.VIEW_SUPPLIERS],
    items: [
      {
        title: "List of Suppliers",
        url: "/dashboard/suppliers",
        element: <SuppliersList />,
        allowedPermissions: [Permission.VIEW_SUPPLIER_LIST],
      },
      {
        title: "Add Supplier",
        url: "/dashboard/suppliers/create",
        element: <AddSupplierPage />,
        allowedPermissions: [Permission.CREATE_SUPPLIER],
      },
      {
        title: "",
        url: "/dashboard/suppliers/:supplierId/edit",
        element: <EditSupplierPage />,
        allowedPermissions: [Permission.EDIT_SUPPLIER],
      },
      {
        title: "Purchase Orders",
        url: "/dashboard/suppliers/purchase-orders",
        element: <PurchaseOrdersList />,
        allowedPermissions: [Permission.VIEW_PURCHASE_ORDERS],
      },
      {
        title: "",
        url: "/dashboard/purchase-orders/:purchaseId",
        element: <ViewPurchaseOrderPage />,
        allowedPermissions: [Permission.VIEW_PURCHASE_ORDER_DETAILS],
      },
      {
        title: "",
        url: "/dashboard/purchase-orders/:purchaseId/edit",
        element: <EditPurchaseOrderPage />,
        allowedPermissions: [Permission.EDIT_PURCHASE_ORDER],
      },
      {
        title: "",
        url: "/purchase-orders/create",
        element: <CreatePurchaseOrderPage />,
        allowedPermissions: [Permission.CREATE_PURCHASE_ORDER],
      },
      {
        title: "Purchase Invoices",
        url: "/dashboard/purchase-invoices",
        element: <PurchaseInvoicesList />,
        allowedPermissions: [Permission.VIEW_PURCHASE_INVOICES],
      },
      {
        title: "",
        url: "/dashboard/purchase-invoices/:id",
        element: <PurchaseInvoicesDetails />,
        allowedPermissions: [Permission.VIEW_PURCHASE_INVOICE_DETAILS],
      },
      {
        title: "",
        url: "/dashboard/purchase-invoices/:id/preview",
        element: <PurchaseInvoicePrintPreview />,
        allowedPermissions: [Permission.PREVIEW_PURCHASE_INVOICE],
      },
      {
        title: "",
        url: "/dashboard/purchase-payments/create",
        element: <CreatePurchasePayments />,
        allowedPermissions: [Permission.CREATE_PURCHASE_PAYMENT],
      },
      {
        title: "Purchase Payments",
        url: "/dashboard/purchase-payments",
        element: <PurchasePayments />,
        allowedPermissions: [Permission.VIEW_PURCHASE_PAYMENTS],
      },
      {
        title: "",
        url: "/dashboard/purchase-payments/:id",
        element: <PurchasePaymentsDetails />,
        allowedPermissions: [Permission.VIEW_PURCHASE_PAYMENT_DETAILS],
      },
      {
        title: "Purchase Orders Map",
        url: "/dashboard/purchase-orders-map",
        element: <PurchaseOrdersMapPage />,
        allowedPermissions: [Permission.VIEW_PURCHASE_ORDERS_MAP],
      },
    ],
  },
  // STAFFS
  {
    title: "Staffs",
    url: "#",
    icon: Users,
    allowedPermissions: [Permission.VIEW_STAFFS],
    items: [
      {
        title: "All Staffs",
        url: "/dashboard/staffs",
        element: <Staffs />,
        allowedPermissions: [Permission.VIEW_STAFF_LIST],
      },
      {
        title: "",
        url: "/dashboard/staffs/:staffId",
        element: <StaffDetails />,
        allowedPermissions: [Permission.VIEW_STAFF_DETAILS],
      },
      {
        title: "",
        url: "/dashboard/staffs/add",
        element: <AddStaffPage />,
        allowedPermissions: [Permission.CREATE_STAFF],
      },
      {
        title: "",
        url: "/dashboard/staffs/:staffId/edit",
        element: <EditStaff />,
        allowedPermissions: [Permission.EDIT_STAFF],
      },
      {
        title: "Departments",
        url: "/dashboard/departments",
        element: <DepartmentsPage />,
        allowedPermissions: [Permission.VIEW_DEPARTMENTS],
      },
      {
        title: "Attendance",
        url: "/dashboard/staffs/attendance",
        element: <AttendancePage />,
        allowedPermissions: [Permission.VIEW_ATTENDANCE],
      },
      {
        title: "Leave Management",
        url: "/dashboard/staffs/leaves",
        element: <LeavesManagement />,
        allowedPermissions: [Permission.MANAGE_LEAVES],
      },
      // {
      //   title: "Staff Map",
      //   url: "/dashboard/staffs/map",
      //   element: <StaffMapPage />,
      //   allowedPermissions: [Permission.VIEW_STAFF_MAP],
      // },
    ],
  },
  // SALES & ORDERS
  {
    title: "Sales & Orders",
    url: "#",
    icon: ShoppingCart,
    allowedPermissions: [Permission.VIEW_SALES],
    items: [
      {
        title: "Orders",
        url: "/dashboard/sales/orders",
        element: <Orders />,
        allowedPermissions: [Permission.VIEW_ORDERS],
      },
      {
        title: "",
        url: "/dashboard/sales/orders/:orderId",
        element: <OrderDetails />,
        allowedPermissions: [Permission.VIEW_ORDER_DETAILS],
      },
      {
        title: "",
        url: "/dashboard/sales/orders/create",
        element: <CreateOrderPage />,
        allowedPermissions: [Permission.CREATE_ORDER],
      },
      {
        title: "",
        url: "/dashboard/sales/orders/:orderId/edit",
        element: <EditOrderPage />,
        allowedPermissions: [Permission.EDIT_ORDER],
      },
      {
        title: "Invoices",
        url: "/dashboard/sales/invoices",
        element: <Invoices />,
        allowedPermissions: [Permission.VIEW_INVOICES],
      },
      {
        title: "",
        url: "/dashboard/sales/invoices/:invoiceId",
        element: <InvoiceDetailsPage />,
        allowedPermissions: [Permission.VIEW_INVOICE_DETAILS],
      },
      {
        title: "",
        url: "/dashboard/sales/invoices/:invoiceId/preview",
        element: <InvoicePrintPreview />,
        allowedPermissions: [Permission.PREVIEW_INVOICE],
      },
      {
        title: "Payments",
        url: "/dashboard/sales/payments",
        element: <Payments />,
        allowedPermissions: [Permission.VIEW_PAYMENTS],
      },
      {
        title: "",
        url: "/dashboard/sales/payments/:paymentId",
        element: <PaymentDetails />,
        allowedPermissions: [Permission.VIEW_PAYMENT_DETAILS],
      },
      {
        title: "",
        url: "/dashboard/sales/payments/create",
        element: <CreatePaymentPage />,
        allowedPermissions: [Permission.CREATE_PAYMENT],
      },
      {
        title: "Delivery",
        url: "/dashboard/sales/delivery",
        element: <DeliveryPage />,
        allowedPermissions: [Permission.VIEW_DELIVERY],
      },
      {
        title: "Sales Routes",
        url: "/dashboard/sales/sales-routes",
        element: <SalesRoutesPage />,
        allowedPermissions: [Permission.VIEW_SALES_ROUTES],
      },
      {
        title: "",
        url: "/dashboard/sales/sales-routes/:routeId",
        element: <RouteDetails />,
        allowedPermissions: [Permission.VIEW_ROUTE_DETAILS],
      },
      {
        title: "",
        url: "/dashboard/sales/sales-routes/create",
        element: <CreateRoutePage />,
        allowedPermissions: [Permission.CREATE_ROUTE],
      },
      {
        title: "",
        url: "/dashboard/sales/sales-routes/:routeId/assign",
        element: <AssignRoutePage />,
        allowedPermissions: [Permission.ASSIGN_ROUTE],
      },
    ],
  },
  // ACCOUNTING
  {
    title: "Accounting",
    url: "#",
    icon: HandCoins,
    allowedPermissions: [Permission.VIEW_ACCOUNTING],
    items: [
      {
        title: "Overview",
        url: "/dashboard/accounting",
        element: <AccountingOverview />,
        allowedPermissions: [Permission.VIEW_ACCOUNTING_OVERVIEW],
      },
      {
        title: "Credit Heads",
        url: "/dashboard/accounting/credit-head",
        element: <CreditHead />,
        allowedPermissions: [Permission.VIEW_CREDIT_HEADS],
      },
      {
        title: "Debit Heads",
        url: "/dashboard/accounting/debit-head",
        element: <DebitHead />,
        allowedPermissions: [Permission.VIEW_DEBIT_HEADS],
      },
      {
        title: "Incomes",
        url: "/dashboard/accounting/incomes",
        element: <IncomePage />,
        allowedPermissions: [Permission.VIEW_INCOMES],
      },
      {
        title: "Expenses",
        url: "/dashboard/accounting/expenses",
        element: <Expenses />,
        allowedPermissions: [Permission.VIEW_EXPENSES],
      },
      {
        title: "",
        url: "/dashboard/accounting/add-income",
        element: <AddIncomePage />,
        allowedPermissions: [Permission.CREATE_INCOME],
      },
      {
        title: "",
        url: "/dashboard/accounting/add-expanse",
        element: <AddExpensePage />,
        allowedPermissions: [Permission.CREATE_EXPENSE],
      },
    ],
  },
  // USERS
  {
    title: "Users",
    url: "#",
    icon: Users,
    allowedPermissions: [Permission.VIEW_USERS],
    items: [
      {
        title: "User List",
        url: "/dashboard/users/list",
        element: <UsersList />,
        allowedPermissions: [Permission.VIEW_USER_LIST],
      },
      {
        title: "Add Users",
        url: "/dashboard/users/add",
        element: <AddUserPage />,
        allowedPermissions: [Permission.CREATE_USER],
      },
      {
        title: "",
        url: "/dashboard/users/:userId/edit",
        element: <EditUserPage />,
        allowedPermissions: [Permission.EDIT_USER],
      },
      {
        title: "",
        url: "/dashboard/users/:userId",
        element: <UserDetails />,
        allowedPermissions: [Permission.VIEW_USER_DETAILS],
      },
    ],
  },
  // ROLES & PERMISSIONS
  {
    title: "Roles & Permissions",
    url: "#",
    icon: ShieldCheck,
    allowedPermissions: [Permission.VIEW_ROLES_PERMISSIONS],
    items: [
      {
        title: "Roles",
        url: "/dashboard/roles",
        element: <Roles />,
        icon: UserCog,
        allowedPermissions: [Permission.VIEW_ROLES],
      },
      {
        title: "Permissions",
        url: "/dashboard/permissions",
        element: <PermissionsPage />,
        icon: KeyRound,
        allowedPermissions: [Permission.VIEW_PERMISSIONS],
      },
    ],
  },
  // SETTINGS
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    layout: <SettingsSidebarLayout />,
    allowedPermissions: [Permission.VIEW_SETTINGS],
    items: [
      {
        title: "Profile",
        url: "/dashboard/settings/profile",
        icon: UserPlus,
        element: <UserProfilePage />,
        allowedPermissions: [Permission.VIEW_PROFILE],
      },
      {
        title: "Account",
        url: "/dashboard/settings/account",
        icon: Wrench,
        element: <AccountSettings />,
        allowedPermissions: [Permission.VIEW_ACCOUNT_SETTINGS],
      },
    ],
  },
  // REPORTS
  {
    title: "Reports",
    url: "#",
    icon: LineChart,
    allowedPermissions: [Permission.VIEW_REPORTS],
    items: [
      {
        title: "Sales Reports",
        url: "/dashboard/reports/sales",
        element: <SalesRprots />,
        allowedPermissions: [Permission.VIEW_SALES_REPORTS],
      },
      {
        title: "Inventory Reports",
        url: "/dashboard/reports/inventory",
        element: <InventoryReports />,
        allowedPermissions: [Permission.VIEW_INVENTORY_REPORTS],
      },
      {
        title: "Customer Reports",
        url: "/dashboard/reports/customers",
        element: <CustomerReports />,
        allowedPermissions: [Permission.VIEW_CUSTOMER_REPORTS],
      },
      {
        title: "Staff Reports",
        url: "/dashboard/reports/staffs",
        element: <StaffReports />,
        allowedPermissions: [Permission.VIEW_STAFF_REPORTS],
      },
    ],
  },
];
