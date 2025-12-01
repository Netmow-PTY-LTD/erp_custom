import {
  Briefcase,
  Car,
  HandCoins,
  Layers,
  LayoutDashboard,
  LineChart,
  List,
  Package,
  Pencil,
  Settings,
  ShoppingCart,
  UserCircle,
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
import SettingsSidebarLayout from "@/pages/Settings/Settings";
import LeavesManagement from "@/pages/staffs/leaves";
import Roles from "@/pages/roles";
import AttendancePage from "@/pages/staffs/attendance";
import PermissionsPage from "@/pages/permissions";
import UnitsPage from "@/pages/unit";
import DepartmentsPage from "@/pages/departments";
import ProductDetailsPage from "@/pages/products/ProductDetails";
import EditProductPage from "@/pages/products/edit";
import UsersList from "@/pages/users/UsersList";
import UserDetails from "@/pages/users/UserDetails";
import AddUserPage from "@/pages/users/AddUser";
import EditUserPage from "@/pages/users/EditUser";
import PayrollPage from "@/pages/payroll";
import CustomerGroups from "@/pages/customer/groups";
import CustomerContacts from "@/pages/customer/contacts";
// import SuppliersReports from "@/pages/reports/SuppliersReports";
// import PurchaseReports from "@/pages/reports/PurchaseReports";
// import PaymentsReport from "@/pages/reports/PaymentsReport";
import AccountingReports from "@/pages/reports/AccountingReports";
import AttendanceReport from "@/pages/reports/AttendanceReport";
import ConversionReport from "@/pages/reports/ConversionReport";
import SavedReports from "@/pages/reports/SavedReports";
import ScheduledReports from "@/pages/reports/ScheduledReports";
import ModuleManagement from "@/pages/modules/ModuleManagement";
import CompanyProfilePage from "@/pages/modules/CompanyProfilePage";
import EmailSmsSettingsPage from "@/pages/modules/EmailSmsSettingsPage";
import LanguageRegionSettings from "@/pages/modules/LanguageRegionSettings";
import BranchesPage from "@/pages/modules/BranchesPage";
import NumberingSequencesPage from "@/pages/modules/NumberingSequencesPage";
import TaxesPage from "@/pages/modules/TaxesPage";
import CurrenciesPage from "@/pages/modules/CurrenciesPage";
import DocumentTemplatesPage from "@/pages/modules/DocumentTemplatesPage";
import BackupRestorePage from "@/pages/modules/BackupRestorePage";
import IntegrationsPage from "@/pages/modules/IntegrationsPage";
import ProjectsPage from "@/pages/projects/ProjectsPage";
import ProjectPhasesPage from "@/pages/projects/ProjectPhasesPage";
import TaskManagementPage from "@/pages/projects/TaskManagementPage";
import TimesheetsPage from "@/pages/projects/TimesheetsPage";
import ProjectCostingPage from "@/pages/projects/ProjectCostingPage";
import ProjectProfitabilityPage from "@/pages/projects/ProjectProfitabilityPage";
import CRMLeadsPage from "@/pages/crm/CRMLeadsPage";
import OpportunitiesPage from "@/pages/crm/OpportunitiesPage";
import PipelineStagesPage from "@/pages/crm/PipelineStagesPage";
import ActivitiesPage from "@/pages/crm/ActivitiesPage";
import FollowUpsPage from "@/pages/crm/FollowUpsPage";
import LeadSourceAnalysis from "@/pages/crm/LeadSourceAnalysis";
import LeadConversionTracking from "@/pages/crm/LeadConversionTracking";


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
        title: "Customer Groups / Types",
        url: "/dashboard/customers/groups",
        element: <CustomerGroups />,
      },
      {
        title: "Customer Contacts",
        url: "/dashboard/customers/contacts",
        element: <CustomerContacts />,
      },
      {
        title: "Customer Payments",
        url: "/dashboard/payments",
        element: <Payments />,
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
        title: "Sales Routes",
        url: "/dashboard/customers/sales-routes",
        element: <SalesRoutesPage />,
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
    element: <PayrollPage />
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
    icon: List,
    items: [
      {
        title: "Roles",
        url: "/dashboard/roles",
        element: <Roles />,
      },
      {
        title: "Permissions",
        url: "/dashboard/permissions",
        element: <PermissionsPage />,
      },
    ]
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
        title: "Accounting Reports",
        url: "/dashboard/reports/accounting",
        element: <AccountingReports />
      },
      {
        title: "Attendence Reports",
        url: "/dashboard/reports/attendence",
        element: <AttendanceReport />
      },
      {
        title: "CRM & Projects Reports",
        url: "/dashboard/reports/crm",
        element: <ConversionReport />
      },
      {
        title: "Save Reports",
        url: "/dashboard/reports/saved-reports",
        element: <SavedReports />
      },
      {
        title: "Scheduled Reports",
        url: "/dashboard/reports/schedule",
        element: <ScheduledReports />
      },

    ],
  },
  {
    title: "Module Management",
    url: "#",
    icon: Layers,
    items: [
      {
        title: "Module List",
        url: "/dashboard/module/list",
        element: <ModuleManagement />
      },
      {
        title: "Company Profile",
        url: "/dashboard/module/company-profile",
        element: <CompanyProfilePage />
      },
      {
        title: "Email settings",
        url: "/dashboard/module/email-settings",
        element: <EmailSmsSettingsPage />
      },
      {
        title: "Language & Region settings",
        url: "/dashboard/module/lang-region",
        element: < LanguageRegionSettings />
      },
      {
        title: "Branches",
        url: "/dashboard/module/branch",
        element: < BranchesPage />
      },
      {
        title: "Numbering Sequences ",
        url: "/dashboard/module/numbering-sequences",
        element: < NumberingSequencesPage />
      },
      {
        title: "Taxes & Vat ",
        url: "/dashboard/module/tax",
        element: < TaxesPage />
      },
      {
        title: "Currencies ",
        url: "/dashboard/module/currencies",
        element: < CurrenciesPage />
      },
      {
        title: "Document Templates ",
        url: "/dashboard/module/document-templates",
        element: < DocumentTemplatesPage />
      },
      {
        title: "Backup & Restore ",
        url: "/dashboard/module/backup-restore",
        element: < BackupRestorePage />
      },
      {
        title: "Integrations ",
        url: "/dashboard/module/integrations",
        element: < IntegrationsPage />
      },

    ],
  },
  {
    title: "Projects/Jobs",
    url: "#",
    icon: Briefcase,
    items: [
      {
        title: "Projects",
        url: "/dashboard/projects",
        element: <ProjectsPage />
      },
      
      {
        title: "Project Phases",
        url: "/dashboard/project-phases",
        element: <ProjectPhasesPage/>
      },
      {
        title: "Task Management",
        url: "/dashboard/task-management",
        element: <TaskManagementPage/>
      },
      {
        title: "Time Sheets",
        url: "/dashboard/time-sheets",
        element: <TimesheetsPage/>
      },
      {
        title: "Project Costing",
        url: "/dashboard/project-costing",
        element: <ProjectCostingPage/>
      },
      {
        title: "Project Profitability",
        url: "/dashboard/project-profitability",
        element: <ProjectProfitabilityPage/>
      },
      

    ],
  },
  {
    title: "CRM",
    url: "#",
    icon: UserCircle,
    items: [
      {
        title: "Projects",
        url: "/dashboard/crm/leads",
        element: <CRMLeadsPage />
      },
      {
        title: "Opportunities",
        url: "/dashboard/crm/opportunities",
        element: <OpportunitiesPage/>
      },
      {
        title: "PipelineStages",
        url: "/dashboard/crm/pipeline-stages",
        element: <PipelineStagesPage/>
      },
      {
        title: "Activities",
        url: "/dashboard/crm/activities",
        element: <ActivitiesPage/>
      },
      {
        title: "FollowUps",
        url: "/dashboard/crm/followups",
        element: <FollowUpsPage/>
      },
      {
        title: "Lead Source Analysis",
        url: "/dashboard/crm/lead-source-analysis",
        element: <LeadSourceAnalysis/>
      },
      {
        title: "Lead Conversion Tracking",
        url: "/dashboard/crm/lead-conversion-tracking",
        element: <LeadConversionTracking/>
      },
      
    
      

    ],
  },
];



