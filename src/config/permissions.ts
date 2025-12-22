
//   group/module based permission


// --- Dashboard ---
export const DashboardPermission = {
  VIEW: "dashboard.view" as const,
};

// --- Products ---
export const ProductPermission = {
  VIEW: "products.view" as const,
  LIST: "products.list" as const,
  DETAILS: "products.details" as const,
  CREATE: "products.create" as const,
  EDIT: "products.edit" as const,
  VIEW_CATEGORIES: "products.categories.view" as const,
  VIEW_UNITS: "products.units.view" as const,
  MANAGE_STOCK: "products.stock.manage" as const,
};

// --- Customers ---
export const CustomerPermission = {
  VIEW: "customers.view" as const,
  LIST: "customers.list" as const,
  DETAILS: "customers.details" as const,
  CREATE: "customers.create" as const,
  EDIT: "customers.edit" as const,
  VIEW_ROUTE_DETAILS: "customers.routes.details.view" as const,
  ASSIGN_ROUTE: "customers.routes.assign" as const,
  VIEW_MAP: "customers.map.view" as const,
};

// --- Suppliers ---
export const SupplierPermission = {
  VIEW: "suppliers.view" as const,
  LIST: "suppliers.list" as const,
  CREATE: "suppliers.create" as const,
  EDIT: "suppliers.edit" as const,
  VIEW_PURCHASE_ORDERS: "suppliers.purchase_orders.view" as const,
  VIEW_PURCHASE_ORDER_DETAILS: "suppliers.purchase_orders.details.view" as const,
  CREATE_PURCHASE_ORDER: "suppliers.purchase_orders.create" as const,
  EDIT_PURCHASE_ORDER: "suppliers.purchase_orders.edit" as const,
  VIEW_PURCHASE_INVOICES: "suppliers.invoices.view" as const,
  VIEW_PURCHASE_INVOICE_DETAILS: "suppliers.invoices.details.view" as const,
  PREVIEW_PURCHASE_INVOICE: "suppliers.invoices.preview" as const,
  CREATE_PURCHASE_PAYMENT: "suppliers.payments.create" as const,
  VIEW_PURCHASE_PAYMENTS: "suppliers.payments.view" as const,
  VIEW_PURCHASE_PAYMENT_DETAILS: "suppliers.payments.details.view" as const,
  VIEW_PURCHASE_ORDERS_MAP: "suppliers.purchase_orders.map.view" as const,
};

// --- Staffs ---
export const StaffPermission = {
  VIEW: "staffs.view" as const,
  LIST: "staffs.list" as const,
  DETAILS: "staffs.details.view" as const,
  CREATE: "staffs.create" as const,
  EDIT: "staffs.edit" as const,
  VIEW_DEPARTMENTS: "departments.view" as const,
  VIEW_ATTENDANCE: "attendance.view" as const,
  MANAGE_LEAVES: "leaves.manage" as const,
  VIEW_STAFF_MAP: "staffs.map.view" as const,
};

// --- Sales & Orders ---
export const SalesPermission = {
  VIEW: "sales.view" as const,
  ORDERS: "sales.orders.view" as const,
  ORDER_DETAILS: "sales.orders.details.view" as const,
  CREATE_ORDER: "sales.orders.create" as const,
  EDIT_ORDER: "sales.orders.edit" as const,
  INVOICES: "sales.invoices.view" as const,
  INVOICE_DETAILS: "sales.invoices.details.view" as const,
  INVOICE_PREVIEW: "sales.invoices.preview" as const,
  PAYMENTS: "sales.payments.view" as const,
  PAYMENT_DETAILS: "sales.payments.details.view" as const,
  CREATE_PAYMENT: "sales.payments.create" as const,
  DELIVERY: "sales.delivery.view" as const,
  SALES_ROUTES: "sales.routes.view" as const,
  CREATE_ROUTE: "sales.routes.create" as const,
  ASSIGN_ROUTE: "sales.routes.assign" as const,
};

// --- Accounting ---
export const AccountingPermission = {
  VIEW: "accounting.view" as const,
  OVERVIEW: "accounting.overview.view" as const,
  CREDIT_HEADS: "accounting.credit_heads.view" as const,
  DEBIT_HEADS: "accounting.debit_heads.view" as const,
  INCOMES: "accounting.incomes.view" as const,
  EXPENSES: "accounting.expenses.view" as const,
  CREATE_INCOME: "accounting.incomes.create" as const,
  CREATE_EXPENSE: "accounting.expenses.create" as const,
};

// --- Users ---
export const UserPermission = {
  VIEW: "users.view" as const,
  LIST: "users.list" as const,
  CREATE: "users.create" as const,
  EDIT: "users.edit" as const,
  DETAILS: "users.details.view" as const,
};

// --- Roles & Permissions ---
export const RolePermission = {
  CREATE_ROLES: "roles.create" as const,
  VIEW_ROLES: "roles.view" as const,
  VIEW_PERMISSIONS: "permissions.view" as const,
  VIEW_ROLES_PERMISSIONS: "roles_permissions.view" as const,
  EDIT_ROLES_PERMISSIONS: "roles_permissions.edit" as const,
};

// --- Settings ---
export const SettingsPermission = {
  VIEW: "settings.view" as const,
  PROFILE: "settings.profile.view" as const,
  ACCOUNT: "settings.account.view" as const,
};

// --- Reports ---
export const ReportPermission = {
  VIEW: "reports.view" as const,
  SALES: "reports.sales.view" as const,
  INVENTORY: "reports.inventory.view" as const,
  CUSTOMERS: "reports.customers.view" as const,
  STAFFS: "reports.staffs.view" as const,
};



//   for sidebar
export const PERMISSION_GROUPS = {
  Dashboard: DashboardPermission,
  Products: ProductPermission,
  Customers: CustomerPermission,
  Suppliers: SupplierPermission,
  Staffs: StaffPermission,
  Sales: SalesPermission,
  Accounting: AccountingPermission,
  Users: UserPermission,
  Roles: RolePermission,
  Settings: SettingsPermission,
  Reports: ReportPermission,
} as const;



// --- Helper type ---
export type PermissionType =
  | typeof DashboardPermission[keyof typeof DashboardPermission]
  | typeof ProductPermission[keyof typeof ProductPermission]
  | typeof CustomerPermission[keyof typeof CustomerPermission]
  | typeof SupplierPermission[keyof typeof SupplierPermission]
  | typeof StaffPermission[keyof typeof StaffPermission]
  | typeof SalesPermission[keyof typeof SalesPermission]
  | typeof AccountingPermission[keyof typeof AccountingPermission]
  | typeof UserPermission[keyof typeof UserPermission]
  | typeof RolePermission[keyof typeof RolePermission]
  | typeof SettingsPermission[keyof typeof SettingsPermission]
  | typeof ReportPermission[keyof typeof ReportPermission];
