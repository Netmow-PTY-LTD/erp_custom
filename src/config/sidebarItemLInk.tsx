import {
  Boxes,
  CalendarCheck,
  Car,
  Banknote,
  CreditCard,
  DollarSign,
  // FileCode,
  Box,
  FileText,
  HandCoins,
  Layers,
  LayoutDashboard,
  LineChart,
  List,
  Map,
  MapPin,
  Package,
  PieChart,
  PlusCircle,
  RotateCcw,
  Ruler,
  Scale,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Truck,
  UserPlus,
  Users,
  CheckCircle,
  Clock,
  Database,
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
import PendingOrders from "@/pages/salesOrders/order/PendingOrders";
import DeliveredOrders from "@/pages/salesOrders/order/DeliveredOrders";
import ReturnedOrders from "@/pages/salesOrders/order/ReturnedOrders";
import AccountingOverview from "@/pages/accounting/Accounting";
import AddIncomePage from "@/pages/accounting/AddIncomePage";
import AddExpensePage from "@/pages/accounting/AddExpanse";
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
import CreatePurchaseReturnPage from "@/pages/suppliers/purchaseOrder/CreatePurchaseReturnPage";
import ViewPurchaseOrderPage from "@/pages/suppliers/purchaseOrder/ViewPurchaseOrderPage";
import ViewPurchaseReturnPage from "@/pages/suppliers/purchaseOrder/ViewPurchaseReturnPage";
import Staffs from "@/pages/staffs";
import StaffDetails from "@/pages/staffs/StaffDetails";
import AddStaffPage from "@/pages/staffs/add";
import EditStaff from "@/pages/staffs/edit";
import EditCustomerPage from "@/pages/customer/EditCustomerPage";
import CustomerViewPage from "@/pages/customer/CustomerViewPage";
import CustomersMapPage from "@/pages/customer/CustomersMapPage";
//import AccountSettings from "@/pages/Settings/pages/Account";
import InventoryReports from "@/pages/reports/InventoryReports";
import SettingsSidebarLayout from "@/pages/Settings/Settings";
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

import CustomerReports from "@/pages/reports/CustomerReports";
import EditPurchaseOrderPage from "@/pages/suppliers/purchaseOrder/EditPurchaseOrderPage";
import CreateRoutePage from "@/pages/salesOrders/salesRoutes/CreateRoute";
import InvoicePrintPreview from "@/pages/salesOrders/invoices/InvoicePrintPreview";
import PurchaseInvoicesList from "@/pages/suppliers/purchaseOrderInvoices/PurchaseInvoicesList";
import PurchaseInvoicesDetails from "@/pages/suppliers/purchaseOrderInvoices/PurchaseInvoicesDetails";
import PurchaseInvoicePrintPreview from "@/pages/suppliers/purchaseOrderInvoices/PurchaseInvoicePrintPreview";
import PurchaseReturnInvoiceDetails from "@/pages/suppliers/purchaseReturnInvoices/PurchaseReturnInvoiceDetails";
import PurchaseReturnInvoicePrintPreview from "@/pages/suppliers/purchaseReturnInvoices/PurchaseReturnInvoicePrintPreview";
import PurchasePayments from "@/pages/suppliers/purchasePayments/PurchasePayments";
import PurchasePaymentsDetails from "@/pages/suppliers/purchasePayments/PurchasePaymentsDetails";
import CreatePurchasePayments from "@/pages/suppliers/purchasePayments/CreatePurchasePayments";
import CreatePurchaseReturnPayment from "@/pages/suppliers/purchasePayments/CreatePurchaseReturnPayment";
import PurchaseReturnPayments from "@/pages/suppliers/purchasePayments/PurchaseReturnPayments";
import PurchaseReturnPaymentsDetails from "@/pages/suppliers/purchasePayments/PurchaseReturnPaymentsDetails";
import PurchaseOrdersMapPage from "@/pages/suppliers/PurchaseOrdersMap";
// import CreditHead from "@/pages/accounting/CreditHead";
// import DebitHead from "@/pages/accounting/DebitHead";
import Roles from "@/pages/rolesPermission/Roles";
import PermissionsPage from "@/pages/rolesPermission/PermissionsPage";

// New Accounting Pages
import Transactions from "@/pages/accounting/Transactions";
import ChartOfAccounts from "@/pages/accounting/ChartOfAccounts";
import PosOrder from "@/pages/salesOrders/pos/PosOrder";
import JournalReport from "@/pages/accounting/JournalReport";
import LedgerReport from "@/pages/accounting/LedgerReport";
import TrialBalance from "@/pages/accounting/TrialBalance";
import ProfitAndLoss from "@/pages/accounting/ProfitAndLoss";
import TaxSubmission from "@/pages/accounting/TaxSubmission";
import IncomePage from "@/pages/accounting/Income";
import ExpensesPage from "@/pages/accounting/Expenses";
import BalanceSheet from "@/pages/accounting/BalanceSheet";
import {
  DashboardPermission,
  ProductPermission,
  CustomerPermission,
  SupplierPermission,
  StaffPermission,
  SalesPermission,
  AccountingPermission,
  UserPermission,
  RolePermission,
  SettingsPermission,
  ReportPermission,
  // RawMaterialPermission,
  // ProductionPermission,
  SuperAdminPermission,
  RouteOperationPermission,
  HelpPermission,
  PayrollPermission,
  SystemPermission,
} from "./permissions";
import SalesReportsPage from "@/pages/reports/SalesReports";
import SalesRouteDetails from "@/pages/salesOrders/salesRoutes/SalesRouteDetails";
import LeaveRequest from "@/pages/staffs/leaves/LeaveRequest";
import AttendanceDetailsPage from "@/pages/staffs/attendance/attendanceDetails";
import RouteWiseOrder from "@/pages/routeOperations/RouteWiseOrder";
import OrderManage from "@/pages/routeOperations/OrderManage";
import StaffRoute from "@/pages/routeOperations/StaffRoute";
// import RawMaterials from "@/pages/raw-materials";
// import AddRawMaterial from "@/pages/raw-materials/AddRawMaterial";
// import EditRawMaterial from "@/pages/raw-materials/EditRawMaterial";
// import ViewRawMaterial from "@/pages/raw-materials/ViewRawMaterial";
// import ProductionDashboard from "@/pages/production";
// import ProductionList from "@/pages/production/ProductionList";
// import CreateProduction from "@/pages/production/CreateProduction";
// import ProductionDetails from "@/pages/production/ProductionDetails";
// import RMSupplierList from "@/pages/raw-materials/suppliers/SupplierList";
// import AddRMSupplier from "@/pages/raw-materials/suppliers/AddSupplier";
// import EditRMSupplier from "@/pages/raw-materials/suppliers/EditSupplier";
// import RMPurchaseOrderList from "@/pages/raw-materials/purchase-orders/PurchaseOrderList";
// import CreateRMPurchaseOrder from "@/pages/raw-materials/purchase-orders/CreatePurchaseOrder";
// import ViewRMPurchaseOrder from "@/pages/raw-materials/purchase-orders/ViewPurchaseOrderPage";
// import RMInvoiceList from "@/pages/raw-materials/invoice/RawMaterialInvoiceList";
// import RecordRMInvoice from "@/pages/raw-materials/invoice/RecordInvoice";
// import RawMaterialInvoiceDetails from "@/pages/raw-materials/invoice/RawMaterialInvoiceDetails";
// import RMPurchaseInvoicePrintPreview from "@/pages/raw-materials/invoice/RMPurchaseInvoicePrintPreview";
// import SupplierPaymentList from "@/pages/raw-materials/payments/SupplierPaymentList";
// import MakeSupplierPayment from "@/pages/raw-materials/payments/MakePayment";
// import RMPaymentDetails from "@/pages/raw-materials/payments/PaymentDetails";
// import BomList from "@/pages/production/bom/BomList";
// import CreateBom from "@/pages/production/bom/CreateBom";
// import FinishedGoodsList from "@/pages/production/finished-goods/FinishedGoodsList";
// import AddFinishedGood from "@/pages/production/finished-goods/AddFinishedGood";
// import RawMaterialCategoriesPage from "@/pages/raw-materials/categories";
// import EditRawMaterialPurchaseOrder from "@/pages/raw-materials/purchase-orders/EditPurchaseOrder";
import InActiveCustomersList from "@/pages/customer/InActiveCustomers";
import CheckIn from "@/pages/checkIn/CheckIn";
import CheckInList from "@/pages/checkIn/CheckInList";
import AddCustomerByStaffPage from "@/pages/customer/AddCustomerByStaff";
import MyProfileSettings from "@/pages/Settings/MyProfileSettings";
import Help from "@/pages/help/Help";
import EditCustomerByStaffPage from "@/pages/customer/EditCustomerByStaffPage";
import HrPayrollOverview from "@/pages/HrAndPayroll/HrPayrollOverview";
import StaffAdvanceDetail from "@/pages/HrAndPayroll/StaffAdvanceDetail";

// import DepartmentsDesignations from "@/pages/HrAndPayroll/DepartmentsDesignations";
// import EmploymentDetails from "@/pages/HrAndPayroll/EmploymentDetails";
import Attendance from "@/pages/HrAndPayroll/Attendance";

// import PayrollComponents from "@/pages/HrAndPayroll/PayrollComponents";
// import SalaryStructures from "@/pages/HrAndPayroll/SalaryStructures";
//import PayrollRuns from "@/pages/HrAndPayroll/PayrollRuns";
import Payslips from "@/pages/HrAndPayroll/Payslips";

import PayrollReports from "@/pages/HrAndPayroll/PayrollReports";
import StaffPayrollRun from "@/pages/HrAndPayroll/StaffPayrollRun";


import { ConfirmedOrders } from "@/pages/salesOrders/order/ConfirmedOrders";
import IntransitOrder from "@/pages/salesOrders/order/IntransitOrder";
import EditRoutePage from "@/pages/salesOrders/salesRoutes/EditRoutePage";
import ProfitByItem from "@/pages/accounting/ProfitByItem";
import ProductsByStaff from "@/pages/products/ProductsByStaff";
import DatabaseTables from "@/pages/data_management/DatabaseTables";
import ReturnedPurchaseOrders from "@/pages/suppliers/purchaseOrder/ReturnedPurchaseOrders";
import LayoutSettings from "@/pages/Settings/pages/LayoutSettings";
import EInvoiceList from "@/pages/salesOrders/invoices/EInvoiceList";
import EInvoiceSettings from "@/pages/Settings/pages/EInvoiceSettings";
import EditProfilePage from "@/pages/Settings/pages/UserProfilePage";
import GoogleApiSettings from "@/pages/Settings/pages/GoogleApiSettings";
import PrefixSettings from "@/pages/Settings/pages/PrefixSettings";
import StaffWiseSalesReport from "@/pages/reports/StaffWiseSalesReport";
import InvoicesSummaryPreview from "@/pages/salesOrders/invoices/InvoicesSummaryPreview";
import InvoiceItemsSummaryPreview from "@/pages/salesOrders/invoices/InvoiceItemsSummaryPreview";
import InvoiceSummaryDetails from "@/pages/salesOrders/invoices/InvoiceSummaryDetails";
import CreateSalesReturn from "@/pages/salesOrders/returns/CreateSalesReturn";
import ViewSalesReturn from "@/pages/salesOrders/returns/ViewSalesReturn";
import SalesReturnInvoiceDetails from "@/pages/salesOrders/returns/SalesReturnInvoiceDetails";
import SalesReturnInvoicePrintPreview from "@/pages/salesOrders/returns/SalesReturnInvoicePrintPreview";
import SalesReturnPaymentsList from "@/pages/salesOrders/returns/SalesReturnPaymentsList";
import CreateSalesReturnPayment from "@/pages/salesOrders/returns/CreateSalesReturnPayment";
import SalesReturnPaymentDetails from "@/pages/salesOrders/returns/SalesReturnPaymentDetails";
import SalesReturnsList from "@/pages/salesOrders/returns/SalesReturnsList";


export const sidebarItemLink = [
  // DASHBOARD
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    element: <Dashboard />,
    allowedPermissions: [
      DashboardPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
  },

  // PRODUCTS
  {
    title: "Products",
    url: "#",
    icon: Package,
    allowedPermissions: [
      ProductPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "Products",
        url: "/dashboard/products",
        element: <Products />,
        icon: List, // product list
        allowedPermissions: [
          ProductPermission.LIST,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },

      {
        title: "Products for Staff",
        url: "/dashboard/products-by-staff",
        element: <ProductsByStaff />,
        icon: List, // product list
        allowedPermissions: [
          ProductPermission.LIST_BY_STAFF,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },

      {
        title: "",
        url: "/dashboard/products/:productId",
        element: <ProductDetailsPage />,
        allowedPermissions: [
          ProductPermission.DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },

      {
        title: "Add Product",
        url: "/dashboard/products/create",
        element: <CreateProduct />,
        icon: PlusCircle, // add product
        allowedPermissions: [
          ProductPermission.CREATE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/products/:productId/edit",
        element: <EditProductPage />,
        allowedPermissions: [
          ProductPermission.EDIT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Categories",
        url: "/dashboard/products/categories",
        element: <ProductCategories />,
        icon: Layers, // categories/groups
        allowedPermissions: [
          ProductPermission.VIEW_CATEGORIES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Unit",
        url: "/dashboard/products/unit",
        element: <UnitsPage />,
        icon: Ruler, // unit/measurement
        allowedPermissions: [
          ProductPermission.VIEW_UNITS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Stock Management",
        url: "/dashboard/products/stock",
        element: <StockManagement />,
        icon: Boxes, // inventory/stock
        allowedPermissions: [
          ProductPermission.MANAGE_STOCK,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // CUSTOMERS
  {
    title: "Customers",
    url: "#",
    icon: Users,
    allowedPermissions: [
      CustomerPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "List of  Active Customers",
        url: "/dashboard/customers",
        element: <Customers />,
        icon: List,
        allowedPermissions: [
          CustomerPermission.LIST,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "List of Inactive Customers",
        url: "/dashboard/customers/inactive",
        element: <InActiveCustomersList />,
        icon: List,
        allowedPermissions: [
          CustomerPermission.LIST_INACTIVE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/customers/:customerId",
        element: <CustomerViewPage />,
        allowedPermissions: [
          CustomerPermission.DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Add Customer",
        url: "/dashboard/customers/create",
        element: <AddCustomer />,
        icon: UserPlus,
        allowedPermissions: [
          CustomerPermission.CREATE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Add Customer By Staff",
        url: "/dashboard/customers/create/by-staff",
        element: <AddCustomerByStaffPage />,
        icon: UserPlus,
        allowedPermissions: [
          CustomerPermission.CREATE_BY_STAFF,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/customers/:customerId/edit/by-staff",
        element: <EditCustomerByStaffPage />,
        allowedPermissions: [
          CustomerPermission.EDIT_BY_STAFF,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/customers/:customerId/edit",
        element: <EditCustomerPage />,
        allowedPermissions: [
          CustomerPermission.EDIT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Customer Maps",
        url: "/dashboard/customers/map",
        element: <CustomersMapPage />,
        icon: Map, // map view
        allowedPermissions: [
          CustomerPermission.VIEW_MAP,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // SUPPLIERS
  {
    title: "Suppliers",
    url: "#",
    icon: Car,
    allowedPermissions: [
      SupplierPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "List of Suppliers",
        url: "/dashboard/suppliers",
        element: <SuppliersList />,
        icon: List,
        allowedPermissions: [
          SupplierPermission.LIST,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Add Supplier",
        url: "/dashboard/suppliers/create",
        element: <AddSupplierPage />,
        icon: UserPlus,
        allowedPermissions: [
          SupplierPermission.CREATE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/suppliers/:supplierId/edit",
        element: <EditSupplierPage />,
        icon: UserPlus,
        allowedPermissions: [
          SupplierPermission.EDIT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },


  // // RAW MATERIALS
  // {
  //   title: "Raw Materials",
  //   url: "#",
  //   icon: Boxes,
  //   allowedPermissions: [
  //     RawMaterialPermission.VIEW,
  //     SuperAdminPermission.ACCESS_ALL,
  //   ],
  //   items: [
  //     {
  //       title: "Raw Materials List",
  //       url: "/dashboard/raw-materials",
  //       element: <RawMaterials />,
  //       icon: List,
  //       allowedPermissions: [
  //         RawMaterialPermission.LIST,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "Suppliers",
  //       url: "/dashboard/raw-materials/suppliers",
  //       element: <RMSupplierList />,
  //       icon: Truck,
  //       allowedPermissions: [
  //         RawMaterialPermission.VIEW,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "Purchase Orders",
  //       url: "/dashboard/raw-materials/purchase-orders",
  //       element: <RMPurchaseOrderList />,
  //       icon: FileText,
  //       allowedPermissions: [
  //         RawMaterialPermission.VIEW,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "Invoices & GRN",
  //       url: "/dashboard/raw-materials/invoices",
  //       element: <RMInvoiceList />,
  //       icon: FileText,
  //       allowedPermissions: [
  //         RawMaterialPermission.VIEW,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "Payments",
  //       url: "/dashboard/raw-materials/payments",
  //       element: <SupplierPaymentList />,
  //       icon: CreditCard,
  //       allowedPermissions: [
  //         RawMaterialPermission.VIEW,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "Categories",
  //       url: "/dashboard/raw-materials/categories",
  //       element: <RawMaterialCategoriesPage />,
  //       icon: Layers,
  //       allowedPermissions: [
  //         RawMaterialPermission.VIEW,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     // Hidden Create/Edit Routes
  //     {
  //       title: "",
  //       url: "/dashboard/raw-materials/add",
  //       element: <AddRawMaterial />,
  //       allowedPermissions: [
  //         RawMaterialPermission.CREATE,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "",
  //       url: "/dashboard/raw-materials/:id",
  //       element: <ViewRawMaterial />,
  //       allowedPermissions: [
  //         RawMaterialPermission.VIEW,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "",
  //       url: "/dashboard/raw-materials/edit/:id",
  //       element: <EditRawMaterial />,
  //       allowedPermissions: [
  //         RawMaterialPermission.EDIT,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "",
  //       url: "/dashboard/raw-materials/suppliers/create",
  //       element: <AddRMSupplier />,
  //       allowedPermissions: [
  //         RawMaterialPermission.CREATE,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "",
  //       url: "/dashboard/raw-materials/suppliers/edit/:id",
  //       element: <EditRMSupplier />,
  //       allowedPermissions: [
  //         RawMaterialPermission.EDIT,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "",
  //       url: "/dashboard/raw-materials/purchase-orders/create",
  //       element: <CreateRMPurchaseOrder />,
  //       allowedPermissions: [
  //         RawMaterialPermission.CREATE,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "",
  //       url: "/dashboard/raw-materials/purchase-orders/:purchaseId",
  //       element: <ViewRMPurchaseOrder />,
  //       allowedPermissions: [
  //         RawMaterialPermission.VIEW,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "",
  //       url: "/dashboard/raw-materials/purchase-orders/edit/:purchaseId",
  //       element: <EditRawMaterialPurchaseOrder />,
  //       allowedPermissions: [
  //         RawMaterialPermission.EDIT,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "",
  //       url: "/dashboard/raw-materials/invoices/create",
  //       element: <RecordRMInvoice />,
  //       allowedPermissions: [
  //         RawMaterialPermission.CREATE,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "",
  //       url: "/dashboard/raw-materials/invoices/:id",
  //       element: <RawMaterialInvoiceDetails />,
  //       allowedPermissions: [
  //         RawMaterialPermission.VIEW,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "",
  //       url: "/dashboard/raw-materials/invoices/print/:id",
  //       element: <RMPurchaseInvoicePrintPreview />,
  //       allowedPermissions: [
  //         RawMaterialPermission.VIEW,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "",
  //       url: "/dashboard/raw-materials/payments/create",
  //       element: <MakeSupplierPayment />,
  //       allowedPermissions: [
  //         RawMaterialPermission.CREATE,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "",
  //       url: "/dashboard/raw-materials/payments/:id",
  //       element: <RMPaymentDetails />,
  //       allowedPermissions: [
  //         RawMaterialPermission.VIEW,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //   ],
  // },

  // // PRODUCTION
  // {
  //   title: "Production",
  //   url: "#",
  //   icon: Layers,
  //   allowedPermissions: [
  //     ProductionPermission.VIEW,
  //     SuperAdminPermission.ACCESS_ALL,
  //   ],
  //   items: [
  //     {
  //       title: "Dashboard",
  //       url: "/dashboard/production",
  //       element: <ProductionDashboard />,
  //       icon: LayoutDashboard,
  //       allowedPermissions: [
  //         ProductionPermission.VIEW,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "Production Batches",
  //       url: "/dashboard/production/list",
  //       element: <ProductionList />,
  //       icon: List,
  //       allowedPermissions: [
  //         ProductionPermission.LIST,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "Recipes (BOM)",
  //       url: "/dashboard/production/bom",
  //       element: <BomList />,
  //       icon: FileCode,
  //       allowedPermissions: [
  //         ProductionPermission.VIEW,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "Finished Goods",
  //       url: "/dashboard/production/finished-goods",
  //       element: <FinishedGoodsList />,
  //       icon: Box,
  //       allowedPermissions: [
  //         ProductionPermission.VIEW,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     // Hidden Create Routes
  //     {
  //       title: "",
  //       url: "/dashboard/production/create",
  //       element: <CreateProduction />,
  //       allowedPermissions: [
  //         ProductionPermission.CREATE,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "",
  //       url: "/dashboard/production/:id",
  //       element: <ProductionDetails />,
  //       allowedPermissions: [
  //         ProductionPermission.DETAILS,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "",
  //       url: "/dashboard/production/bom/create",
  //       element: <CreateBom />,
  //       allowedPermissions: [
  //         ProductionPermission.CREATE,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //     {
  //       title: "",
  //       url: "/dashboard/production/finished-goods/create",
  //       element: <AddFinishedGood />,
  //       allowedPermissions: [
  //         ProductionPermission.CREATE,
  //         SuperAdminPermission.ACCESS_ALL,
  //       ],
  //     },
  //   ],
  // },

  // STAFFS
  {
    title: "Staffs",
    url: "#",
    icon: Users,
    allowedPermissions: [StaffPermission.VIEW, SuperAdminPermission.ACCESS_ALL],
    items: [
      {
        title: "All Staffs",
        url: "/dashboard/staffs",
        element: <Staffs />,
        icon: List,
        allowedPermissions: [
          StaffPermission.LIST,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/staffs/:staffId",
        element: <StaffDetails />,
        allowedPermissions: [
          StaffPermission.DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Add New Staff",
        url: "/dashboard/staffs/add",
        element: <AddStaffPage />,
        icon: PlusCircle,
        allowedPermissions: [
          StaffPermission.CREATE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/staffs/:staffId/edit",
        element: <EditStaff />,
        allowedPermissions: [
          StaffPermission.EDIT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Departments",
        url: "/dashboard/departments",
        element: <DepartmentsPage />,
        icon: Layers,
        allowedPermissions: [
          StaffPermission.VIEW_DEPARTMENTS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Attendance",
        url: "/dashboard/staffs/attendance",
        element: <AttendancePage />,
        icon: CalendarCheck,
        allowedPermissions: [
          StaffPermission.VIEW_ATTENDANCE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/staffs/attendance/:staffId",
        element: <AttendanceDetailsPage />,
        allowedPermissions: [
          StaffPermission.VIEW_ATTENDANCE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      // {
      //   title: "Leave Management",
      //   url: "/dashboard/staffs/leaves",
      //   element: <LeavesManagement />,
      //   icon: FileMinus,
      //   allowedPermissions: [
      //     StaffPermission.MANAGE_LEAVES,
      //     SuperAdminPermission.ACCESS_ALL,
      //   ],
      // },

      // CHECK IN
      {
        title: "Check In",
        url: "/dashboard/staff/check-in",
        icon: MapPin,
        element: <CheckIn />,
        allowedPermissions: [
          StaffPermission.CHECK_IN,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Check In List",
        url: "/dashboard/staff/check-in-list",
        icon: MapPin,
        element: <CheckInList />,
        allowedPermissions: [
          StaffPermission.VIEW_CHECK_IN_LIST,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/staffs/leaves/request",
        element: <LeaveRequest />,
        allowedPermissions: [
          StaffPermission.MANAGE_LEAVES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Sales Routes",
        url: "/dashboard/sales/sales-routes",
        element: <SalesRoutesPage />,
        icon: MapPin,
        allowedPermissions: [
          SalesPermission.SALES_ROUTES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  //Purchase Orders

  {
    title: "Purchase",
    url: "#",
    icon: Car,
    allowedPermissions: [
      SupplierPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "List of Purchase Orders",
        url: "/dashboard/purchase-orders",
        element: <PurchaseOrdersList />,
        icon: List,
        allowedPermissions: [
          SupplierPermission.LIST,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Add New Purchase Order",
        url: "/dashboard/purchase-orders/create",
        element: <CreatePurchaseOrderPage />,
        icon: PlusCircle,
        allowedPermissions: [
          SupplierPermission.CREATE_PURCHASE_ORDER,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/purchase-orders/:purchaseId",
        element: <ViewPurchaseOrderPage />,
        allowedPermissions: [
          SupplierPermission.VIEW_PURCHASE_ORDER_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },

      {
        title: "",
        url: "/dashboard/purchase-orders/:purchaseId/edit",
        element: <EditPurchaseOrderPage />,
        allowedPermissions: [
          SupplierPermission.EDIT_PURCHASE_ORDER,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/purchase-orders/create",
        element: <CreatePurchaseOrderPage />,
        allowedPermissions: [
          SupplierPermission.CREATE_PURCHASE_ORDER,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Purchase Invoices",
        url: "/dashboard/purchase-invoices",
        element: <PurchaseInvoicesList />,
        icon: FileText,
        allowedPermissions: [
          SupplierPermission.VIEW_PURCHASE_INVOICES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/purchase-invoices/:id",
        element: <PurchaseInvoicesDetails />,
        allowedPermissions: [
          SupplierPermission.VIEW_PURCHASE_INVOICE_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/purchase-invoices/:id/preview",
        element: <PurchaseInvoicePrintPreview />,
        allowedPermissions: [
          SupplierPermission.PREVIEW_PURCHASE_INVOICE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/purchase-payments/create",
        element: <CreatePurchasePayments />,
        allowedPermissions: [
          SupplierPermission.CREATE_PURCHASE_PAYMENT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Purchase Payments",
        url: "/dashboard/purchase-payments",
        element: <PurchasePayments />,
        icon: CreditCard,
        allowedPermissions: [
          SupplierPermission.VIEW_PURCHASE_PAYMENTS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/purchase-payments/:id",
        element: <PurchasePaymentsDetails />,
        allowedPermissions: [
          SupplierPermission.VIEW_PURCHASE_PAYMENT_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Purchase Orders Map",
        url: "/dashboard/purchase-orders-map",
        element: <PurchaseOrdersMapPage />,
        icon: MapPin,
        allowedPermissions: [
          SupplierPermission.VIEW_PURCHASE_ORDERS_MAP,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // PURCHASE RETURN
  {
    title: "Purchase Return",
    url: "#",
    icon: RotateCcw,
    allowedPermissions: [
      SupplierPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "Purchase Returns",
        url: "/dashboard/purchase-orders/returned",
        element: <ReturnedPurchaseOrders />,
        icon: List,
        allowedPermissions: [
          SupplierPermission.LIST,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Create Purchase Return",
        url: "/dashboard/purchase-orders/return/create",
        element: <CreatePurchaseReturnPage />,
        icon: PlusCircle,
        allowedPermissions: [
          SupplierPermission.CREATE_PURCHASE_ORDER,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/purchase-returns/:returnId",
        element: <ViewPurchaseReturnPage />,
        allowedPermissions: [
          SupplierPermission.VIEW_PURCHASE_RETURN_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/purchase-return-invoices/:id",
        element: <PurchaseReturnInvoiceDetails />,
        allowedPermissions: [
          SupplierPermission.VIEW_PURCHASE_RETURN_INVOICE_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/purchase-return-invoices/:id/preview",
        element: <PurchaseReturnInvoicePrintPreview />,
        allowedPermissions: [
          SupplierPermission.PREVIEW_PURCHASE_RETURN_INVOICE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/purchase-returns/payments/create",
        element: <CreatePurchaseReturnPayment />,
        allowedPermissions: [
          SupplierPermission.CREATE_PURCHASE_RETURN_PAYMENT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Purchase Return Refunds",
        url: "/dashboard/purchase-returns/payments",
        element: <PurchaseReturnPayments />,
        icon: Banknote,
        allowedPermissions: [
          SupplierPermission.VIEW_PURCHASE_RETURN_PAYMENTS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/purchase-returns/payments/:id",
        element: <PurchaseReturnPaymentsDetails />,
        allowedPermissions: [
          SupplierPermission.VIEW_PURCHASE_RETURN_PAYMENT_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // SALES & ORDERS
  {
    title: "Sales & Orders",
    url: "#",
    icon: ShoppingCart,
    allowedPermissions: [SalesPermission.VIEW, SuperAdminPermission.ACCESS_ALL],
    items: [
      {
        title: "POS Order",
        url: "/dashboard/sales/pos",
        element: <PosOrder />,
        icon: ShoppingCart,
        allowedPermissions: [
          SalesPermission.POS_ORDER,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Orders",
        url: "/dashboard/sales/orders",
        element: <Orders />,
        icon: List,
        allowedPermissions: [
          SalesPermission.ORDERS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Add New Sales Order",
        url: "/dashboard/sales/orders/create",
        icon: PlusCircle,
        element: <CreateOrderPage />,
        allowedPermissions: [
          SalesPermission.CREATE_ORDER,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Pending Orders",
        url: "/dashboard/sales/orders/pending",
        element: <PendingOrders />,
        icon: Clock,
        allowedPermissions: [
          SalesPermission.PENDING_ORDERS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Confirmed Orders",
        url: "/dashboard/sales/orders/confirmed",
        element: <ConfirmedOrders />,
        icon: CheckCircle,
        allowedPermissions: [
          SalesPermission.CONFIRMED_ORDERS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "In-Transit Orders",
        url: "/dashboard/sales/orders/intransit-order",
        element: <IntransitOrder />,
        icon: Truck,
        allowedPermissions: [
          SalesPermission.INTRANSIT_ORDERS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Delivered Orders",
        url: "/dashboard/sales/orders/delivered",
        element: <DeliveredOrders />,
        icon: Package,
        allowedPermissions: [
          SalesPermission.DELIVERED_ORDERS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Return Orders",
        url: "/dashboard/sales/orders/return",
        element: <ReturnedOrders />,
        icon: RotateCcw,
        allowedPermissions: [
          SalesPermission.VIEW_SALES_RETURNS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },

      {
        title: "",
        url: "/dashboard/sales/orders/:orderId",
        element: <OrderDetails />,
        allowedPermissions: [
          SalesPermission.ORDER_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/orders/:orderId/edit",
        element: <EditOrderPage />,
        allowedPermissions: [
          SalesPermission.EDIT_ORDER,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Invoices",
        url: "/dashboard/sales/invoices",
        element: <Invoices />,
        icon: FileText,
        allowedPermissions: [
          SalesPermission.INVOICES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "E-Invoices",
        url: "/dashboard/sales/einvoices",
        element: <EInvoiceList />,
        icon: FileText,
        allowedPermissions: [
          SalesPermission.INVOICES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/invoices/:invoiceId",
        element: <InvoiceDetailsPage />,
        allowedPermissions: [
          SalesPermission.INVOICE_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/invoices/:invoiceId/preview",
        element: <InvoicePrintPreview />,
        allowedPermissions: [
          SalesPermission.INVOICE_PREVIEW,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/invoices/summary",
        element: <InvoicesSummaryPreview />,
        allowedPermissions: [
          SalesPermission.INVOICE_PREVIEW,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/invoices/items-summary",
        element: <InvoiceItemsSummaryPreview />,
        allowedPermissions: [
          SalesPermission.INVOICE_PREVIEW,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/invoices/summary-details",
        element: <InvoiceSummaryDetails />,
        allowedPermissions: [
          SalesPermission.INVOICE_PREVIEW,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Payments",
        url: "/dashboard/sales/payments",
        element: <Payments />,
        icon: CreditCard,
        allowedPermissions: [
          SalesPermission.PAYMENTS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/payments/:paymentId",
        element: <PaymentDetails />,
        allowedPermissions: [
          SalesPermission.PAYMENT_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/payments/create",
        element: <CreatePaymentPage />,
        allowedPermissions: [
          SalesPermission.CREATE_PAYMENT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Delivery",
        url: "/dashboard/sales/delivery",
        element: <DeliveryPage />,
        icon: Truck,
        allowedPermissions: [
          SalesPermission.DELIVERY,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Sales Return",
        url: "/dashboard/sales/returns",
        element: <SalesReturnsList />,
        icon: List,
        allowedPermissions: [
          SalesPermission.VIEW_SALES_RETURNS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Create Sales Return",
        url: "/dashboard/sales/returns/create",
        element: <CreateSalesReturn />,
        icon: PlusCircle,
        allowedPermissions: [
          SalesPermission.CREATE_SALES_RETURN,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/returns/:returnId",
        element: <ViewSalesReturn />,
        allowedPermissions: [
          SalesPermission.VIEW_SALES_RETURN_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales-return-invoices/:id",
        element: <SalesReturnInvoiceDetails />,
        allowedPermissions: [
          SalesPermission.VIEW_SALES_RETURN_INVOICE_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales-return-invoices/:id/preview",
        element: <SalesReturnInvoicePrintPreview />,
        allowedPermissions: [
          SalesPermission.PREVIEW_SALES_RETURN_INVOICE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Sales Return Refunds",
        url: "/dashboard/sales/returns/payments",
        element: <SalesReturnPaymentsList />,
        icon: Banknote,
        allowedPermissions: [
          SalesPermission.VIEW_SALES_RETURN_PAYMENTS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/returns/payments/create",
        element: <CreateSalesReturnPayment />,
        allowedPermissions: [
          SalesPermission.CREATE_SALES_RETURN_PAYMENT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/returns/payments/:id",
        element: <SalesReturnPaymentDetails />,
        allowedPermissions: [
          SalesPermission.VIEW_SALES_RETURN_PAYMENT_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/sales-routes/create",
        element: <CreateRoutePage />,
        allowedPermissions: [
          SalesPermission.CREATE_ROUTE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/sales-routes/:id",
        element: <SalesRouteDetails />,
        allowedPermissions: [
          SalesPermission.DETAILS_SALES_ROUTES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/sales-routes/:id/edit",
        element: <EditRoutePage />,
        allowedPermissions: [
          SalesPermission.EDIT_ROUTE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      // {
      //   title: "",
      //   url: "/dashboard/sales/sales-routes/:routeId/assign",
      //   element: <AssignRoutePage />,
      //   allowedPermissions: [
      //     SalesPermission.ASSIGN_ROUTE,
      //     SuperAdminPermission.ACCESS_ALL,
      //   ],
      // },
    ],
  },

  // SALES RETURN
  {
    title: "Sales Return",
    url: "#",
    icon: RotateCcw,
    allowedPermissions: [
      SalesPermission.VIEW_SALES_RETURNS,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "Sales Return Orders",
        url: "/dashboard/sales/returns",
        element: <SalesReturnsList />,
        icon: List,
        allowedPermissions: [
          SalesPermission.VIEW_SALES_RETURNS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Create New Sales Return",
        url: "/dashboard/sales/returns/create",
        element: <CreateSalesReturn />,
        icon: PlusCircle,
        allowedPermissions: [
          SalesPermission.CREATE_SALES_RETURN,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/returns/:returnId",
        element: <ViewSalesReturn />,
        allowedPermissions: [
          SalesPermission.VIEW_SALES_RETURN_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales-return-invoices/:id",
        element: <SalesReturnInvoiceDetails />,
        allowedPermissions: [
          SalesPermission.VIEW_SALES_RETURN_INVOICE_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales-return-invoices/:id/preview",
        element: <SalesReturnInvoicePrintPreview />,
        allowedPermissions: [
          SalesPermission.PREVIEW_SALES_RETURN_INVOICE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Sales Return Refunds",
        url: "/dashboard/sales/returns/payments",
        element: <SalesReturnPaymentsList />,
        icon: Banknote,
        allowedPermissions: [
          SalesPermission.VIEW_SALES_RETURN_PAYMENTS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/returns/payments/create",
        element: <CreateSalesReturnPayment />,
        allowedPermissions: [
          SalesPermission.CREATE_SALES_RETURN_PAYMENT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/sales/returns/payments/:id",
        element: <SalesReturnPaymentDetails />,
        allowedPermissions: [
          SalesPermission.VIEW_SALES_RETURN_PAYMENT_DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // ACCOUNTING
  {
    title: "Accounting",
    url: "#",
    icon: HandCoins,
    allowedPermissions: [
      AccountingPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "Dashboard",
        url: "/dashboard/accounting",
        element: <AccountingOverview />,
        icon: LayoutDashboard,
        allowedPermissions: [
          AccountingPermission.OVERVIEW,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Transactions",
        url: "/dashboard/accounting/transactions",
        element: <Transactions />,
        icon: FileText,
        allowedPermissions: [
          AccountingPermission.TRANSACTIONS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Chart of Accounts",
        url: "/dashboard/accounting/accounts",
        element: <ChartOfAccounts />,
        icon: List,
        allowedPermissions: [
          AccountingPermission.CHART_OF_ACCOUNTS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Income List",
        url: "/dashboard/accounting/income",
        element: <IncomePage />,
        icon: List,
        allowedPermissions: [
          AccountingPermission.TRANSACTIONS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Expense List",
        url: "/dashboard/accounting/expenses",
        element: <ExpensesPage />,
        icon: List,
        allowedPermissions: [
          AccountingPermission.TRANSACTIONS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Journal Report",
        url: "/dashboard/accounting/reports/journal",
        element: <JournalReport />,
        icon: FileText,
        allowedPermissions: [
          AccountingPermission.JOURNAL_REPORT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Ledger Report",
        url: "/dashboard/accounting/reports/ledger",
        element: <LedgerReport />,
        icon: FileText,
        allowedPermissions: [
          AccountingPermission.LEDGER_REPORT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Trial Balance",
        url: "/dashboard/accounting/reports/trial-balance",
        element: <TrialBalance />,
        icon: Scale, // Need to make sure Scale is imported or use another icon
        allowedPermissions: [
          AccountingPermission.TRIAL_BALANCE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Profit & Loss",
        url: "/dashboard/accounting/reports/profit-and-loss",
        element: <ProfitAndLoss />,
        icon: PieChart,
        allowedPermissions: [
          AccountingPermission.PROFIT_AND_LOSS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Balance Sheet",
        url: "/dashboard/accounting/reports/balance-sheet",
        element: <BalanceSheet />,
        icon: Scale,
        allowedPermissions: [
          AccountingPermission.BALANCE_SHEET,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Profit by Item",
        url: "/dashboard/accounting/reports/profit-by-item",
        element: <ProfitByItem />,
        icon: CreditCard,
        // allowedPermissions: [
        //   AccountingPermission.PROFIT_BY_ITEM,
        //   SuperAdminPermission.ACCESS_ALL,
        // ],
      },
      {
        title: "Tax Submissions",
        url: "/dashboard/accounting/tax-submissions",
        element: <TaxSubmission />,
        icon: Scale,
        allowedPermissions: [
          AccountingPermission.TAX_SUBMISSION,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      // {
      //   title: "Daily Profit Status",
      //   url: "/dashboard/accounting/reports/daily-profit-status",
      //   element: <DailyProfitStatus />,
      //   icon: CreditCard,
      //   // allowedPermissions: [
      //   //   AccountingPermission.PROFIT_BY_ITEM,
      //   //   SuperAdminPermission.ACCESS_ALL,
      //   // ],
      // },
      // Hidden Create/Edit Routes
      {
        title: "",
        url: "/dashboard/accounting/add-income",
        element: <AddIncomePage />,
        allowedPermissions: [
          AccountingPermission.CREATE_INCOME,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/accounting/add-expanse",
        element: <AddExpensePage />,
        allowedPermissions: [
          AccountingPermission.CREATE_EXPENSE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },



  //HR and Payroll
  {
    title: "HR & Payroll",
    url: "#",
    icon: HandCoins,
    allowedPermissions: [
      PayrollPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "Overview",
        url: "/dashboard/payroll",
        element: <HrPayrollOverview />,
        icon: LayoutDashboard,
        allowedPermissions: [
          PayrollPermission.OVERVIEW,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/payroll/:staffId/advance",
        element: <StaffAdvanceDetail />,
        allowedPermissions: [
          PayrollPermission.OVERVIEW,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/payroll/:staffId/payroll-run",
        element: <StaffPayrollRun />,
        allowedPermissions: [
          PayrollPermission.OVERVIEW,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },

      // {
      //   title: "Employment Details",
      //   url: "/dashboard/payroll/employment-details",
      //   element: <EmploymentDetails />,
      //   icon: FileText,
      //   allowedPermissions: [
      //     PayrollPermission.EMPLOYMENT_DETAILS,
      //     SuperAdminPermission.ACCESS_ALL,
      //   ],
      // },
      {
        title: "Manual Attendance",
        url: "/dashboard/payroll/attendance",
        element: <Attendance />,
        icon: CalendarCheck,
        allowedPermissions: [
          PayrollPermission.ATTENDANCE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      // {
      //   title: "Payroll Runs",
      //   url: "/dashboard/payroll/payroll-runs",
      //   element: <PayrollRuns />,
      //   icon: BanknoteArrowDown,
      //   allowedPermissions: [
      //     PayrollPermission.PAYROLL_RUNS,
      //     SuperAdminPermission.ACCESS_ALL,
      //   ],
      // },
      {
        title: "Payslips",
        url: "/dashboard/payroll/payslips",
        element: <Payslips />,
        icon: FileText,
        allowedPermissions: [
          PayrollPermission.PAYSLIPS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Payroll Reports",
        url: "/dashboard/payroll/payroll-reports",
        element: <PayrollReports />,
        icon: LineChart,
        allowedPermissions: [
          PayrollPermission.PAYROLL_REPORTS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // USERS
  {
    title: "Users",
    url: "#",
    icon: Users,
    allowedPermissions: [UserPermission.VIEW, SuperAdminPermission.ACCESS_ALL],
    items: [
      {
        title: "User List",
        url: "/dashboard/users/list",
        element: <UsersList />,
        icon: List,
        allowedPermissions: [
          UserPermission.LIST,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Add Users",
        url: "/dashboard/users/add",
        element: <AddUserPage />,
        icon: UserPlus,
        allowedPermissions: [
          UserPermission.CREATE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/users/:userId/edit",
        element: <EditUserPage />,
        allowedPermissions: [
          UserPermission.EDIT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/users/:userId",
        element: <UserDetails />,
        allowedPermissions: [
          UserPermission.DETAILS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // ROLES & PERMISSIONS
  {
    title: "Roles & Permissions",
    url: "#",
    icon: ShieldCheck,
    allowedPermissions: [
      RolePermission.VIEW_ROLES_PERMISSIONS,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "Roles",
        url: "/dashboard/roles",
        element: <Roles />,
        icon: Users,
        allowedPermissions: [
          RolePermission.VIEW_ROLES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      // {
      //   title: "Permissions",
      //   url: "/dashboard/permissions",
      //   element: <PermissionsPage />,
      //   allowedPermissions: [RolePermission.VIEW_PERMISSIONS,SuperAdminPermission.ACCESS_ALL],
      // },
      {
        title: "",
        url: "/dashboard/permissions/:roleId/edit",
        element: <PermissionsPage />,
        allowedPermissions: [
          RolePermission.EDIT_ROLES_PERMISSIONS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // REPORTS
  {
    title: "Reports",
    url: "#",
    icon: LineChart,
    allowedPermissions: [
      ReportPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "Sales Reports",
        url: "/dashboard/reports/sales",
        element: <SalesReportsPage />,
        icon: DollarSign,
        allowedPermissions: [
          ReportPermission.SALES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Inventory Reports",
        url: "/dashboard/reports/inventory",
        element: <InventoryReports />,
        icon: Box,
        allowedPermissions: [
          ReportPermission.INVENTORY,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Customer Reports",
        url: "/dashboard/reports/customers",
        element: <CustomerReports />,
        icon: Users,
        allowedPermissions: [
          ReportPermission.CUSTOMERS,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Staff Wise Sales Report",
        url: "/dashboard/reports/staff-wise-sales",
        element: <StaffWiseSalesReport />,
        icon: Users,
        allowedPermissions: [
          ReportPermission.SALES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },

  // ROUTE OPERATIONS
  {
    title: "Route Operations",
    url: "#",
    icon: Map,
    allowedPermissions: [
      RouteOperationPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "Route Wise Order",
        url: "/dashboard/route-operations/route-wise-order",
        element: <RouteWiseOrder />,
        icon: List,
        allowedPermissions: [
          RouteOperationPermission.ROUTE_WISE_ORDER,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Order Manage",
        url: "/dashboard/route-operations/order-manage",
        element: <OrderManage />,
        icon: Settings,
        allowedPermissions: [
          RouteOperationPermission.ORDER_MANAGE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "Staff Wise Route",
        url: "/dashboard/route-operations/staff-route",
        element: <StaffRoute />,
        icon: Users,
        allowedPermissions: [
          RouteOperationPermission.STAFF_WISE_ROUTE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },


  // SETTINGS
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    layout: <SettingsSidebarLayout />,
    element: <SettingsSidebarLayout />,
    allowedPermissions: [
      SettingsPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "",
        url: "/dashboard/settings",
        element: <EditProfilePage />,
        allowedPermissions: [
          SettingsPermission.PROFILE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/settings/profile",
        element: <MyProfileSettings />,
        allowedPermissions: [
          SettingsPermission.PROFILE,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/settings/layout",
        element: <LayoutSettings />,
        allowedPermissions: [
          SettingsPermission.LAYOUT,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/settings/einvoice",
        element: <EInvoiceSettings />,
        allowedPermissions: [
          SettingsPermission.VIEW,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/settings/google-api",
        element: <GoogleApiSettings />,
        allowedPermissions: [
          SettingsPermission.VIEW,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
      {
        title: "",
        url: "/dashboard/settings/prefixes",
        element: <PrefixSettings />,
        allowedPermissions: [
          SettingsPermission.VIEW,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },


  // DATABASE
  {
    title: "Database",
    url: "#",
    icon: Database,
    allowedPermissions: [
      SystemPermission.VIEW_TABLES,
      SuperAdminPermission.ACCESS_ALL,
    ],
    items: [
      {
        title: "All Tables",
        url: "/dashboard/database",
        element: <DatabaseTables />,
        icon: List,
        allowedPermissions: [
          SystemPermission.VIEW_TABLES,
          SuperAdminPermission.ACCESS_ALL,
        ],
      },
    ],
  },


  {
    title: "Help",
    url: "/dashboard/help",
    icon: Map,
    element: <Help />,
    allowedPermissions: [
      HelpPermission.VIEW,
      SuperAdminPermission.ACCESS_ALL,
    ],

  },
];
