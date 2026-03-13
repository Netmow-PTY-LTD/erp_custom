import { Link } from "react-router";

const ModulesFunctionality = () => {
  // Organized modules by category matching sidebar structure
  const moduleCategories = [
    {
      title: "General",
      icon: "🏠",
      modules: [
        { name: "Dashboard", icon: "📊", description: "Analytics & Overview", path: "/dashboard", color: "dashboard", apiPath: "/module-docs/dashboard" },
        { name: "My Gallery", icon: "🖼️", description: "Gallery & Media", path: "/dashboard/gallery", color: "general", apiPath: "/module-docs/upload" },
      ],
    },
    {
      title: "Products",
      icon: "📦",
      modules: [
        { name: "Products List", icon: "📦", description: "View all products", path: "/dashboard/products", color: "products", apiPath: "/module-docs/products-list" },
        { name: "Products for Staff", icon: "👥", description: "Staff products view", path: "/dashboard/products-by-staff", color: "products", apiPath: "/module-docs/products-staff" },
        { name: "Add Product", icon: "➕", description: "Create new product", path: "/dashboard/products/create", color: "products", apiPath: "/module-docs/products-create" },
        { name: "Categories", icon: "🏷️", description: "Product categories", path: "/dashboard/products/categories", color: "products", apiPath: "/module-docs/products-categories" },
        { name: "Units", icon: "📏", description: "Measurement units", path: "/dashboard/products/units", color: "products", apiPath: "/module-docs/products-units" },
        { name: "Stock Management", icon: "📊", description: "Inventory tracking", path: "/dashboard/products/stock", color: "products", apiPath: "/module-docs/products-stock" },
      ],
    },
    {
      title: "Customers",
      icon: "👤",
      modules: [
        { name: "Active Customers", icon: "✅", description: "View active customers", path: "/dashboard/customers", color: "customers", apiPath: "/module-docs/customers-active" },
        { name: "Inactive Customers", icon: "⭕", description: "View inactive customers", path: "/dashboard/customers/inactive", color: "customers", apiPath: "/module-docs/customers-inactive" },
        { name: "Add Customer", icon: "➕", description: "Create new customer", path: "/dashboard/customers/create", color: "customers", apiPath: "/module-docs/customers-create" },
        { name: "Add Customer (Staff)", icon: "👥", description: "Staff add customer", path: "/dashboard/customers/create/by-staff", color: "customers", apiPath: "/module-docs/customers-staff" },
        { name: "Customer Maps", icon: "🗺️", description: "Customer locations", path: "/dashboard/customers/map", color: "customers", apiPath: "/module-docs/customers-maps" },
      ],
    },
    {
      title: "Suppliers",
      icon: "🏭",
      modules: [
        { name: "Suppliers List", icon: "📋", description: "View all suppliers", path: "/dashboard/suppliers", color: "suppliers", apiPath: "/module-docs/suppliers" },
        { name: "Add Supplier", icon: "➕", description: "Create new supplier", path: "/dashboard/suppliers/create", color: "suppliers", apiPath: "/module-docs/suppliers" },
      ],
    },
    {
      title: "Staff",
      icon: "👔",
      modules: [
        { name: "All Staffs", icon: "👥", description: "View all staff", path: "/dashboard/staffs", color: "staffs", apiPath: "/module-docs/staff" },
        { name: "Add New Staff", icon: "➕", description: "Create staff account", path: "/dashboard/staffs/add", color: "staffs", apiPath: "/module-docs/staff" },
        { name: "Departments", icon: "🏢", description: "Manage departments", path: "/dashboard/departments", color: "staffs", apiPath: "/module-docs/departments" },
        { name: "Attendance", icon: "⏰", description: "Time tracking", path: "/dashboard/staffs/attendance", color: "staffs", apiPath: "/module-docs/attendance" },
        { name: "Check In", icon: "✅", description: "Staff check-in", path: "/dashboard/staff/check-in", color: "staffs", apiPath: "/module-docs/checkin" },
        { name: "Check In List", icon: "📋", description: "View check-ins", path: "/dashboard/staff/check-in-list", color: "staffs", apiPath: "/module-docs/checkin" },
        { name: "Staff Wise Checkin", icon: "👤", description: "Individual check-ins", path: "/dashboard/staff/staff-wise-check-in-list", color: "staffs", apiPath: "/module-docs/checkin" },
        { name: "Leaves", icon: "🏖️", description: "Leave management", path: "/dashboard/staffs/leaves", color: "staffs", apiPath: "/module-docs/leaves" },
        { name: "Sales Routes", icon: "🗺️", description: "Delivery routes", path: "/dashboard/sales/sales-routes", color: "staffs", apiPath: "/module-docs/salesroutes" },
      ],
    },
    {
      title: "Purchase",
      icon: "📦",
      modules: [
        { name: "List of Purchase Orders", icon: "📋", description: "All purchase orders", path: "/dashboard/purchase-orders", color: "purchase", apiPath: "/module-docs/purchase" },
        { name: "Pending Purchase Order", icon: "⏳", description: "Pending approvals", path: "/dashboard/purchase-orders/pending", color: "purchase", apiPath: "/module-docs/purchase" },
        { name: "Approved Purchase Order", icon: "✅", description: "Approved purchases", path: "/dashboard/purchase-orders/approved", color: "purchase", apiPath: "/module-docs/purchase" },
        { name: "Rejected Purchase Order", icon: "❌", description: "Rejected purchases", path: "/dashboard/purchase-orders/rejected", color: "purchase", apiPath: "/module-docs/purchase" },
        { name: "Add New Purchase Order", icon: "➕", description: "Create purchase order", path: "/dashboard/purchase-orders/create", color: "purchase", apiPath: "/module-docs/purchase" },
        { name: "Purchase Invoices", icon: "📄", description: "Manage invoices", path: "/dashboard/purchase-invoices", color: "purchase", apiPath: "/module-docs/purchase" },
        { name: "Purchase Payments", icon: "💳", description: "Payment tracking", path: "/dashboard/purchase-payments", color: "purchase", apiPath: "/module-docs/purchase" },
        { name: "Purchase Orders Map", icon: "🗺️", description: "View on map", path: "/dashboard/purchase-orders-map", color: "purchase", apiPath: "/module-docs/purchase" },
      ],
    },
    {
      title: "Purchase Return",
      icon: "🔄",
      modules: [
        { name: "Purchase Returns", icon: "🔄", description: "Return management", path: "/dashboard/purchase-orders/returned", color: "purchase-return", apiPath: "/module-docs/purchase-return" },
        { name: "Approved Purchase Returns", icon: "✅", description: "Approved returns", path: "/dashboard/purchase-orders/returned/approved", color: "purchase-return", apiPath: "/module-docs/purchase-return" },
        { name: "Pending Purchase Return", icon: "⏳", description: "Pending returns", path: "/dashboard/purchase-orders/returned/pending", color: "purchase-return", apiPath: "/module-docs/purchase-return" },
        { name: "Create Purchase Return", icon: "➕", description: "Create return request", path: "/dashboard/purchase-orders/return/create", color: "purchase-return", apiPath: "/module-docs/purchase-return" },
        { name: "Purchase Return Refunds", icon: "💰", description: "Refund management", path: "/dashboard/purchase-returns/payments", color: "purchase-return", apiPath: "/module-docs/purchase-return" },
      ],
    },
    {
      title: "Sales & Orders",
      icon: "🛒",
      modules: [
        { name: "POS Order", icon: "🖥️", description: "Point of sale", path: "/dashboard/sales/pos", color: "sales", apiPath: "/module-docs/sales-pos" },
        { name: "Orders", icon: "📋", description: "All sales orders", path: "/dashboard/sales/orders", color: "sales", apiPath: "/module-docs/sales-orders" },
        { name: "Add New Sales Order", icon: "➕", description: "Create sales order", path: "/dashboard/sales/orders/create", color: "sales", apiPath: "/module-docs/sales-orders-create" },
        { name: "Add New Sales Order (Any)", icon: "➕", description: "Create any order", path: "/dashboard/sales/orders/create-any", color: "sales", apiPath: "/module-docs/sales-orders-create-any" },
        { name: "Edit Sales Order", icon: "✏️", description: "Edit pending orders", path: "/dashboard/sales/orders/:id/edit", color: "sales", apiPath: "/module-docs/sales-orders-edit" },
        { name: "Pending Orders", icon: "⏳", description: "Pending sales", path: "/dashboard/sales/orders/pending", color: "sales", apiPath: "/module-docs/sales-orders-pending" },
        { name: "Confirmed Orders", icon: "✅", description: "Confirmed sales", path: "/dashboard/sales/orders/confirmed", color: "sales", apiPath: "/module-docs/sales-orders-confirmed" },
        { name: "In-Transit Orders", icon: "🚚", description: "In-transit items", path: "/dashboard/sales/orders/intransit-order", color: "sales", apiPath: "/module-docs/sales-orders-intransit" },
        { name: "Delivered Orders", icon: "📦", description: "Delivered items", path: "/dashboard/sales/orders/delivered", color: "sales", apiPath: "/module-docs/sales-orders-delivered" },
        { name: "Return Orders", icon: "🔄", description: "Return orders", path: "/dashboard/sales/orders/return", color: "sales-return", apiPath: "/module-docs/sales-return" },
        { name: "Invoices", icon: "📄", description: "Sales invoices", path: "/dashboard/sales/invoices", color: "sales", apiPath: "/module-docs/sales-invoices" },
        { name: "E-Invoices", icon: "📱", description: "Electronic invoices", path: "/dashboard/sales/einvoices", color: "sales", apiPath: "/module-docs/sales-einvoices" },
        { name: "Payments", icon: "💳", description: "Payment tracking", path: "/dashboard/sales/invoices/payments", color: "sales", apiPath: "/module-docs/sales-payments" },
        { name: "Delivery", icon: "🚚", description: "Delivery management", path: "/dashboard/sales/delivery", color: "sales", apiPath: "/module-docs/sales-delivery" },
      ],
    },
    {
      title: "Sales Return",
      icon: "🔄",
      modules: [
        { name: "Sales Return Orders", icon: "🔄", description: "Return orders", path: "/dashboard/sales/returns", color: "sales-return", apiPath: "/module-docs/sales-return" },
        { name: "Approved Sales Returns", icon: "✅", description: "Approved returns", path: "/dashboard/sales/returns/approved", color: "sales-return", apiPath: "/module-docs/sales-return" },
        { name: "Pending Sales Return", icon: "⏳", description: "Pending returns", path: "/dashboard/sales/returns/pending", color: "sales-return", apiPath: "/module-docs/sales-return" },
        { name: "Create New Sales Return", icon: "➕", description: "Create return request", path: "/dashboard/sales/returns/create", color: "sales-return", apiPath: "/module-docs/sales-return" },
        { name: "Sales Return Refunds", icon: "💰", description: "Refund management", path: "/dashboard/sales/returns/payments", color: "sales-return", apiPath: "/module-docs/sales-return" },
      ],
    },
    {
      title: "Accounting",
      icon: "💰",
      modules: [
        { name: "Dashboard", icon: "📊", description: "Financial overview", path: "/dashboard/accounting", color: "accounting", apiPath: "/module-docs/accounting" },
        { name: "Transactions", icon: "📝", description: "All transactions", path: "/dashboard/accounting/transactions", color: "accounting", apiPath: "/module-docs/accounting" },
        { name: "Chart of Accounts", icon: "📊", description: "Account structure", path: "/dashboard/accounting/accounts", color: "accounting", apiPath: "/module-docs/accounting" },
        { name: "Income List", icon: "💵", description: "Income records", path: "/dashboard/accounting/income", color: "accounting", apiPath: "/module-docs/accounting" },
        { name: "Expense List", icon: "💸", description: "Expense records", path: "/dashboard/accounting/expenses", color: "accounting", apiPath: "/module-docs/accounting" },
        { name: "Journal Report", icon: "📒", description: "Journal records", path: "/dashboard/accounting/reports/journal", color: "accounting", apiPath: "/module-docs/accounting" },
        { name: "Ledger Report", icon: "📋", description: "Ledger records", path: "/dashboard/accounting/reports/ledger", color: "accounting", apiPath: "/module-docs/accounting" },
        { name: "Trial Balance", icon: "⚖️", description: "Trial balance", path: "/dashboard/accounting/reports/trial-balance", color: "accounting", apiPath: "/module-docs/accounting" },
        { name: "Profit & Loss", icon: "📈", description: "P&L statement", path: "/dashboard/accounting/reports/profit-and-loss", color: "accounting", apiPath: "/module-docs/accounting" },
        { name: "Balance Sheet", icon: "📊", description: "Balance sheet", path: "/dashboard/accounting/reports/balance-sheet", color: "accounting", apiPath: "/module-docs/accounting" },
        { name: "Profit by Item", icon: "💎", description: "Item profitability", path: "/dashboard/accounting/reports/profit-by-item", color: "accounting", apiPath: "/module-docs/accounting" },
        { name: "Tax Submissions", icon: "📄", description: "Tax management", path: "/dashboard/accounting/tax-submissions", color: "accounting", apiPath: "/module-docs/accounting" },
      ],
    },
    {
      title: "HR & Payroll",
      icon: "💵",
      modules: [
        { name: "Overview", icon: "📊", description: "HR & Payroll overview", path: "/dashboard/payroll", color: "payroll", apiPath: "/module-docs/payroll" },
        { name: "Manual Attendance", icon: "📅", description: "Attendance management", path: "/dashboard/payroll/attendance", color: "payroll", apiPath: "/module-docs/payroll" },
        { name: "Payslips", icon: "📄", description: "Payslip management", path: "/dashboard/payroll/payslips", color: "payroll", apiPath: "/module-docs/payroll" },
        { name: "Payroll Reports", icon: "📈", description: "Payroll analytics", path: "/dashboard/payroll/payroll-reports", color: "payroll", apiPath: "/module-docs/payroll" },
      ],
    },
    {
      title: "Users",
      icon: "👥",
      modules: [
        { name: "User List", icon: "👥", description: "View all users", path: "/dashboard/users/list", color: "users", apiPath: "/module-docs/users" },
        { name: "Add Users", icon: "➕", description: "Create new user", path: "/dashboard/users/add", color: "users", apiPath: "/module-docs/users" },
      ],
    },
    {
      title: "Roles & Permissions",
      icon: "🎭",
      modules: [
        { name: "Roles", icon: "🎭", description: "Role management", path: "/dashboard/roles", color: "roles", apiPath: "/module-docs/roles" },
      ],
    },
    {
      title: "Reports",
      icon: "📈",
      modules: [
        { name: "Sales Reports", icon: "💰", description: "Sales analytics", path: "/dashboard/reports/sales", color: "reports", apiPath: "/module-docs/reports" },
        { name: "Inventory Reports", icon: "📦", description: "Inventory analytics", path: "/dashboard/reports/inventory", color: "reports", apiPath: "/module-docs/reports" },
        { name: "Customer Reports", icon: "👥", description: "Customer analytics", path: "/dashboard/reports/customers", color: "reports", apiPath: "/module-docs/reports" },
        { name: "Customer Wise Report", icon: "📊", description: "Customer-wise data", path: "/dashboard/reports/customer-wise", color: "reports", apiPath: "/module-docs/reports" },
        { name: "Staff Reports", icon: "👔", description: "Staff analytics", path: "/dashboard/reports/staff-wise-sales", color: "reports", apiPath: "/module-docs/reports" },
        { name: "Staff Wise Sales", icon: "💵", description: "Staff sales data", path: "/dashboard/reports/staff-wise-sales", color: "reports", apiPath: "/module-docs/reports" },
        { name: "Staff Wise Invoices", icon: "📄", description: "Staff invoice data", path: "/dashboard/reports/staff-wise-invoices", color: "reports", apiPath: "/module-docs/reports" },
        { name: "My Reports", icon: "📋", description: "Personal analytics", path: "/dashboard/reports/my-sales", color: "reports", apiPath: "/module-docs/reports" },
        { name: "My Sales", icon: "💰", description: "My sales data", path: "/dashboard/reports/my-sales", color: "reports", apiPath: "/module-docs/reports" },
        { name: "My Invoices", icon: "📄", description: "My invoice data", path: "/dashboard/reports/my-invoices", color: "reports", apiPath: "/module-docs/reports" },
      ],
    },
    {
      title: "Route Operations",
      icon: "🗺️",
      modules: [
        { name: "Route Wise Order", icon: "📍", description: "Route-based orders", path: "/dashboard/route-operations/route-wise-order", color: "route-operations", apiPath: "/module-docs/dashboard" },
        { name: "Order Manage", icon: "⚙️", description: "Order management", path: "/dashboard/route-operations/order-manage", color: "route-operations", apiPath: "/module-docs/dashboard" },
        { name: "Staff Wise Route", icon: "👥", description: "Staff routes", path: "/dashboard/route-operations/staff-route", color: "route-operations", apiPath: "/module-docs/dashboard" },
      ],
    },
    {
      title: "Settings",
      icon: "⚙️",
      modules: [
        { name: "Edit Profile", icon: "👤", description: "Edit your profile", path: "/dashboard/settings", color: "settings", apiPath: "/module-docs/settings" },
        { name: "My Profile", icon: "👤", description: "Profile settings", path: "/dashboard/settings/profile", color: "settings", apiPath: "/module-docs/settings" },
        { name: "Layout Settings", icon: "🎨", description: "Layout configuration", path: "/dashboard/settings/layout", color: "settings", apiPath: "/module-docs/settings" },
        { name: "E-Invoice Settings", icon: "📱", description: "E-invoice config", path: "/dashboard/settings/einvoice", color: "settings", apiPath: "/module-docs/settings" },
        { name: "Google API Settings", icon: "🔧", description: "Google API config", path: "/dashboard/settings/google-api", color: "settings", apiPath: "/module-docs/settings" },
        { name: "Prefix Settings", icon: "🔖", description: "Prefix configuration", path: "/dashboard/settings/prefixes", color: "settings", apiPath: "/module-docs/settings" },
      ],
    },
    {
      title: "Database",
      icon: "🗄️",
      modules: [
        { name: "All Tables", icon: "📊", description: "Database tables", path: "/dashboard/database", color: "database", apiPath: "/module-docs/database" },
      ],
    },
  ];

  const colorStyles: Record<string, string> = {
    general: "border-l-blue-500 hover:bg-blue-50",
    dashboard: "border-l-indigo-500 hover:bg-indigo-50",
    products: "border-l-green-500 hover:bg-green-50",
    customers: "border-l-pink-500 hover:bg-pink-50",
    suppliers: "border-l-cyan-500 hover:bg-cyan-50",
    staffs: "border-l-violet-500 hover:bg-violet-50",
    purchase: "border-l-blue-400 hover:bg-blue-50",
    "purchase-return": "border-l-sky-500 hover:bg-sky-50",
    sales: "border-l-rose-500 hover:bg-rose-50",
    "sales-return": "border-l-red-500 hover:bg-red-50",
    accounting: "border-l-emerald-500 hover:bg-emerald-50",
    payroll: "border-l-teal-500 hover:bg-teal-50",
    users: "border-l-slate-500 hover:bg-slate-50",
    roles: "border-l-purple-500 hover:bg-purple-50",
    reports: "border-l-amber-500 hover:bg-amber-50",
    "route-operations": "border-l-orange-500 hover:bg-orange-50",
    settings: "border-l-gray-500 hover:bg-gray-50",
    database: "border-l-blue-600 hover:bg-blue-50",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-10 mb-8 text-center">
          <h1 className="text-5xl font-bold text-indigo-600 mb-3">📚 Module Documentation</h1>
          <p className="text-gray-600 text-lg">Explore detailed documentation for each system module</p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-300"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Module Categories */}
        {moduleCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-10">
            {/* Category Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{category.icon}</div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
                  <p className="text-gray-600">{category.modules.length} module{category.modules.length > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {/* Modules Grid for this Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.modules.map((module, moduleIndex) => (
                <div
                  key={`${categoryIndex}-${moduleIndex}`}
                  className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${colorStyles[module.color]}
                           transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
                           text-gray-800`}
                >
                  <div className="text-4xl mb-3">{module.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{module.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{module.description}</p>

                  <div className="flex flex-col gap-2">
                    <Link
                      to={module.path}
                      className="text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold"
                    >
                      View Details
                    </Link>
                    <a
                      href={module.apiPath}
                      className="text-center py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                    >
                      API Docs
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white text-sm">
            © {new Date().getFullYear()} ERP System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModulesFunctionality;
