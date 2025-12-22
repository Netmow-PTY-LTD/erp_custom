// backend/permissions.ts

export const Permission = {
  // Dashboard
  VIEW_DASHBOARD: "view_dashboard" as const,

  // Products
  VIEW_PRODUCTS: "view_products" as const,
  VIEW_PRODUCTS_LIST: "view_products_list" as const,
  VIEW_PRODUCT_DETAILS: "view_product_details" as const,
  CREATE_PRODUCT: "create_product" as const,
  EDIT_PRODUCT: "edit_product" as const,
  VIEW_PRODUCT_CATEGORIES: "view_product_categories" as const,
  VIEW_UNITS: "view_units" as const,
  MANAGE_STOCK: "manage_stock" as const,

  // Customers
  VIEW_CUSTOMERS: "view_customers" as const,
  VIEW_CUSTOMER_LIST: "view_customer_list" as const,
  VIEW_CUSTOMER_DETAILS: "view_customer_details" as const,
  CREATE_CUSTOMER: "create_customer" as const,
  EDIT_CUSTOMER: "edit_customer" as const,
  VIEW_ROUTE_DETAILS: "view_route_details" as const,
  ASSIGN_ROUTE: "assign_route" as const,
  VIEW_CUSTOMER_MAP: "view_customer_map" as const,

  // Suppliers
  VIEW_SUPPLIERS: "view_suppliers" as const,
  VIEW_SUPPLIER_LIST: "view_supplier_list" as const,
  CREATE_SUPPLIER: "create_supplier" as const,
  EDIT_SUPPLIER: "edit_supplier" as const,
  VIEW_PURCHASE_ORDERS: "view_purchase_orders" as const,
  VIEW_PURCHASE_ORDER_DETAILS: "view_purchase_order_details" as const,
  CREATE_PURCHASE_ORDER: "create_purchase_order" as const,
  EDIT_PURCHASE_ORDER: "edit_purchase_order" as const,
  VIEW_PURCHASE_INVOICES: "view_purchase_invoices" as const,
  VIEW_PURCHASE_INVOICE_DETAILS: "view_purchase_invoice_details" as const,
  PREVIEW_PURCHASE_INVOICE: "preview_purchase_invoice" as const,
  CREATE_PURCHASE_PAYMENT: "create_purchase_payment" as const,
  VIEW_PURCHASE_PAYMENTS: "view_purchase_payments" as const,
  VIEW_PURCHASE_PAYMENT_DETAILS: "view_purchase_payment_details" as const,
  VIEW_PURCHASE_ORDERS_MAP: "view_purchase_orders_map" as const,

  // Staffs
  VIEW_STAFFS: "view_staffs" as const,
  VIEW_STAFF_LIST: "view_staff_list" as const,
  VIEW_STAFF_DETAILS: "view_staff_details" as const,
  CREATE_STAFF: "create_staff" as const,
  EDIT_STAFF: "edit_staff" as const,
  VIEW_DEPARTMENTS: "view_departments" as const,
  VIEW_ATTENDANCE: "view_attendance" as const,
  VIEW_LEAVE_MANAGEMENT: "view_leave_management" as const,
  MANAGE_LEAVES: "manage_leaves" as const,
  VIEW_STAFF_MAP: "view_staff_map" as const,

  // Sales & Orders
  VIEW_SALES: "view_sales" as const,
  VIEW_ORDERS: "view_orders" as const,
  VIEW_ORDER_DETAILS: "view_order_details" as const,
  CREATE_ORDER: "create_order" as const,
  EDIT_ORDER: "edit_order" as const,
  VIEW_INVOICES: "view_invoices" as const,
  VIEW_INVOICE_DETAILS: "view_invoice_details" as const,
  PREVIEW_INVOICE: "preview_invoice" as const,
  VIEW_PAYMENTS: "view_payments" as const,
  VIEW_PAYMENT_DETAILS: "view_payment_details" as const,
  CREATE_PAYMENT: "create_payment" as const,
  VIEW_DELIVERY: "view_delivery" as const,
  VIEW_SALES_ROUTES: "view_sales_routes" as const,
  CREATE_ROUTE: "create_route" as const,
  ASSIGN_ROUTE_TO_CUSTOMER: "assign_route_to_customer" as const,

  // Accounting
  VIEW_ACCOUNTING: "view_accounting" as const,
  VIEW_ACCOUNTING_OVERVIEW: "view_accounting_overview" as const,
  VIEW_CREDIT_HEADS: "view_credit_heads" as const,
  VIEW_DEBIT_HEADS: "view_debit_heads" as const,
  VIEW_INCOMES: "view_incomes" as const,
  VIEW_EXPENSES: "view_expenses" as const,
  CREATE_INCOME: "create_income" as const,
  CREATE_EXPENSE: "create_expense" as const,

  // Users
  VIEW_USERS: "view_users" as const,
  VIEW_USER_LIST: "view_user_list" as const,
  CREATE_USER: "create_user" as const,
  EDIT_USER: "edit_user" as const,
  VIEW_USER_DETAILS: "view_user_details" as const,

  // Roles & Permissions
  VIEW_ROLES: "view_roles" as const,
  VIEW_PERMISSIONS: "view_permissions" as const,
  VIEW_ROLES_PERMISSIONS: "view_roles_permissions" as const,

  // Settings
  VIEW_SETTINGS: "view_settings" as const,
  VIEW_PROFILE: "view_profile" as const,
  VIEW_ACCOUNT_SETTINGS: "view_account_settings" as const,

  // Reports
  VIEW_REPORTS: "view_reports" as const,
  VIEW_SALES_REPORTS: "view_sales_reports" as const,
  VIEW_INVENTORY_REPORTS: "view_inventory_reports" as const,
  VIEW_CUSTOMER_REPORTS: "view_customer_reports" as const,
  VIEW_STAFF_REPORTS: "view_staff_reports" as const,
};

// Type helper
// export type PermissionType = typeof Permission[keyof typeof Permission];





//   group/module based permission


// backend/permissions.ts

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
  VIEW_ROLES: "roles.view" as const,
  VIEW_PERMISSIONS: "permissions.view" as const,
  VIEW_ROLES_PERMISSIONS: "roles_permissions.view" as const,
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
