"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { PERMISSION_GROUPS } from "@/config/permissions";
import { Link, useParams } from "react-router";
import { useGetRoleByIdQuery, useUpdateRoleMutation } from "@/store/features/role/roleApiService";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader,
  Eye,
  PlusCircle,
  Pencil,
  Trash2,
  CheckCircle,
  Shield,
  Search,
  LayoutDashboard,
  Package,
  Users,
  Truck,
  ShoppingCart,
  UserCog,
  Calculator,
  Settings,
  FileText,
  TrendingUp,
  Route,
  DollarSign,
  HelpCircle,
  Database,
  Image,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

const roleSchema = z.object({
  role: z.string().min(1, "Required"),
  display_name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  status: z.enum(["active", "inactive"]),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

export type RoleFormValues = z.infer<typeof roleSchema>;

// Permission type categories with icons and colors
const PERMISSION_CATEGORIES: Record<
  string,
  {
    icon: typeof LayoutDashboard;
    color: string;
    bgColor: string;
    description: string;
  }
> = {
  Dashboard: {
    icon: LayoutDashboard,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    description: "Main dashboard access and statistics",
  },
  Gallery: {
    icon: Image,
    color: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-950",
    description: "Image gallery management",
  },
  Products: {
    icon: Package,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
    description: "Product catalog, categories, and inventory",
  },
  Customers: {
    icon: Users,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-950",
    description: "Customer management and relationships",
  },
  Suppliers: {
    icon: Truck,
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    description: "Supplier and vendor management",
  },
  Purchase: {
    icon: ShoppingCart,
    color: "text-violet-500",
    bgColor: "bg-violet-50 dark:bg-violet-950",
    description: "Purchase orders and procurement",
  },
  PurchaseReturn: {
    icon: ArrowLeft,
    color: "text-rose-500",
    bgColor: "bg-rose-50 dark:bg-rose-950",
    description: "Purchase returns and refunds",
  },
  Sales: {
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950",
    description: "Sales orders, invoices, and payments",
  },
  SalesReturn: {
    icon: ArrowLeft,
    color: "text-lime-500",
    bgColor: "bg-lime-50 dark:bg-lime-950",
    description: "Sales returns and refunds",
  },
  Staffs: {
    icon: UserCog,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950",
    description: "Staff management, attendance, and departments",
  },
  Accounting: {
    icon: Calculator,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    description: "Financial records and reports",
  },
  Users: {
    icon: Users,
    color: "text-sky-500",
    bgColor: "bg-sky-50 dark:bg-sky-950",
    description: "System user management",
  },
  Roles: {
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950",
    description: "Role and permission configuration",
  },
  Settings: {
    icon: Settings,
    color: "text-gray-500",
    bgColor: "bg-gray-50 dark:bg-gray-950",
    description: "System settings and preferences",
  },
  Reports: {
    icon: FileText,
    color: "text-teal-500",
    bgColor: "bg-teal-50 dark:bg-teal-950",
    description: "Business reports and analytics",
  },
  RouteOperations: {
    icon: Route,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
    description: "Delivery route management",
  },
  Payroll: {
    icon: DollarSign,
    color: "text-fuchsia-500",
    bgColor: "bg-fuchsia-50 dark:bg-fuchsia-950",
    description: "HR and payroll management",
  },
  Help: {
    icon: HelpCircle,
    color: "text-slate-500",
    bgColor: "bg-slate-50 dark:bg-slate-950",
    description: "Help and support access",
  },
  System: {
    icon: Database,
    color: "text-zinc-500",
    bgColor: "bg-zinc-50 dark:bg-zinc-950",
    description: "System database access",
  },
};

// Permission action definitions
const PERMISSION_ACTIONS: Record<
  string,
  { label: string; icon: typeof Eye; description: string; color: string }
> = {
  view: {
    label: "View",
    icon: Eye,
    description: "Can view and browse",
    color: "text-blue-500",
  },
  list: {
    label: "List",
    icon: FileText,
    description: "Can view list of items",
    color: "text-cyan-500",
  },
  create: {
    label: "Create",
    icon: PlusCircle,
    description: "Can add new items",
    color: "text-green-500",
  },
  edit: {
    label: "Edit",
    icon: Pencil,
    description: "Can modify existing items",
    color: "text-amber-500",
  },
  delete: {
    label: "Delete",
    icon: Trash2,
    description: "Can remove items",
    color: "text-red-500",
  },
  details: {
    label: "Details",
    icon: Info,
    description: "Can view detailed information",
    color: "text-purple-500",
  },
  approve: {
    label: "Approve",
    icon: CheckCircle,
    description: "Can approve or reject",
    color: "text-emerald-500",
  },
  manage: {
    label: "Manage",
    icon: Settings,
    description: "Full management access",
    color: "text-violet-500",
  },
};

// Get readable permission label and description
function getPermissionInfo(permission: string): {
  label: string;
  description: string;
  action?: string;
} {
  // Remove the prefix and convert to readable format
  const parts = permission.split(".");
  const lastPart = parts[parts.length - 1];

  // Map common patterns to readable labels
  const actionMap: Record<string, string> = {
    view: "View",
    list: "View List",
    create: "Create New",
    edit: "Edit",
    delete: "Delete",
    details: "View Details",
    stats: "View Statistics",
    graph: "View Graphs",
    manage: "Manage",
    by: "Access By Staff",
    inactive: "View Inactive",
    active: "View Active",
    map: "View Map",
    stock: "Stock Management",
    categories: "Categories",
    units: "Units",
    pending: "Pending",
    confirmed: "Confirmed",
    delivered: "Delivered",
    intransit: "In Transit",
    returned: "Returned",
    recent: "Recent",
    preview: "Preview/Print",
    overview: "Overview",
    transactions: "Transactions",
    chart: "Chart of Accounts",
    journal: "Journal Report",
    ledger: "Ledger Report",
    trial: "Trial Balance",
    profit: "Profit & Loss",
    balance: "Balance Sheet",
    tax: "Tax Submission",
    profit_by_item: "Profit by Item",
    payroll_runs: "Payroll Runs",
    payslips: "Payslips",
    payroll_reports: "Payroll Reports",
    employment_details: "Employment Details",
    staff: "Staff Statistics",
    staff_charts: "Staff Charts",
    check_in: "Check In",
    check_in_list: "Check In List",
    assign: "Assign",
    mark_as_paid: "Mark as Paid",
    pos: "POS",
    sales_returns: "Sales Returns",
    invoices: "Invoices",
    payments: "Payments",
    routes: "Routes",
    delivery: "Delivery",
    purchase_orders: "Purchase Orders",
    purchase_returns: "Purchase Returns",
    purchase_invoices: "Purchase Invoices",
    purchase_payments: "Purchase Payments",
    departments: "Departments",
    attendance: "Attendance",
    leaves: "Leave Management",
    credit_heads: "Credit Heads",
    debit_heads: "Debit Heads",
    incomes: "Income",
    expenses: "Expenses",
    reports: "Reports",
    staffwise_sales: "Staff Wise Sales",
    staffwise_invoices: "Staff Wise Invoices",
    myreports: "My Reports",
    mysales: "My Sales",
    myinvoices: "My Invoices",
    route_wise: "Route Wise",
    order_manage: "Order Manage",
    staff_wise: "Staff Wise",
    tables: "Database Tables",
    permission: "Permission",
    roles_permissions: "Roles & Permissions",
    account: "Account",
    layout: "Layout",
    profile: "Profile",
    route_details: "Route Details",
    sales_return_invoices: "Sales Return Invoices",
    sales_return_payments: "Sales Return Payments",
    purchase_return_invoices: "Purchase Return Invoices",
    purchase_return_payments: "Purchase Return Payments",
  };

  // Generate label from permission string
  const label = actionMap[lastPart] || lastPart.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  // Generate description
  const module = parts[0];
  const moduleMap: Record<string, string> = {
    dashboard: "Dashboard",
    products: "Products",
    customers: "Customers",
    suppliers: "Suppliers",
    purchases: "Purchase Orders",
    sales: "Sales",
    staffs: "Staff",
    accounting: "Accounting",
    users: "Users",
    roles: "Roles",
    settings: "Settings",
    reports: "Reports",
    departments: "Departments",
    attendance: "Attendance",
    leaves: "Leave Management",
    payroll: "Payroll",
    gallery: "Gallery",
    system: "System",
    help: "Help",
    route_operations: "Route Operations",
  };

  const moduleName = moduleMap[module] || module;

  let description = "";
  if (lastPart.includes("view") || lastPart.includes("list") || lastPart.includes("stats") || lastPart.includes("graph")) {
    description = `Can view ${label.toLowerCase()} for ${moduleName}`;
  } else if (lastPart.includes("create")) {
    description = `Can create new ${moduleName.toLowerCase()}`;
  } else if (lastPart.includes("edit")) {
    description = `Can edit existing ${moduleName.toLowerCase()}`;
  } else if (lastPart.includes("delete")) {
    description = `Can delete ${moduleName.toLowerCase()}`;
  } else if (lastPart.includes("manage")) {
    description = `Full management access to ${moduleName}`;
  } else {
    description = `Access to ${label} in ${moduleName}`;
  }

  return { label, description };
}

// Permission Checkbox Component
function PermissionCheckbox({
  permission,
  checked,
  onChange,
  disabled = false,
}: {
  permission: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  const { label, description } = getPermissionInfo(permission);

  // Determine action type for icon
  const actionKey = Object.keys(PERMISSION_ACTIONS).find((key) =>
    permission.toLowerCase().includes(key)
  );
  const action = actionKey ? PERMISSION_ACTIONS[actionKey] : null;
  const ActionIcon = action?.icon || Eye;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <label
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02]",
              checked
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <Checkbox
              checked={checked}
              disabled={disabled}
              onCheckedChange={(val) => onChange(Boolean(val))}
              className="pointer-events-none"
            />
            <ActionIcon className={cn("w-4 h-4 shrink-0", checked ? action?.color || "text-gray-500" : "text-gray-400")} />
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium truncate", checked ? "text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400")}>
                {label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                {description}
              </p>
            </div>
          </label>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs bg-gray-900 text-white border-gray-700">
          <p className="font-medium">{label}</p>
          <p className="text-xs text-gray-300 mt-1">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Permission Group Card Component
function PermissionGroupCard({
  groupName,
  permissions,
  selectedPermissions,
  onTogglePermission,
  onToggleGroup,
}: {
  groupName: string;
  permissions: string[];
  selectedPermissions: string[];
  onTogglePermission: (permission: string) => void;
  onToggleGroup: (permissions: string[]) => void;
}) {
  const category = PERMISSION_CATEGORIES[groupName];
  const CategoryIcon = category?.icon || Shield;
  const allSelected = permissions.every((p) => selectedPermissions.includes(p));
  const someSelected = permissions.some((p) => selectedPermissions.includes(p));

  const groupTitles: Record<string, string> = {
    RouteOperations: "Route Operations",
    PurchaseReturn: "Purchase Returns",
    SalesReturn: "Sales Returns",
    Payroll: "HR & Payroll",
    Roles: "Roles & Permissions",
    System: "Database",
  };

  const displayName = groupTitles[groupName] || groupName;

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardHeader
        className={cn(
          "flex flex-row items-center justify-between py-4 px-5 border-b",
          category?.bgColor
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg bg-white/50 dark:bg-black/20", category?.color)}>
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">{displayName}</CardTitle>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {category?.description}
            </p>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          variant={allSelected ? "default" : someSelected ? "secondary" : "outline"}
          onClick={() => onToggleGroup(permissions)}
          className="gap-2"
        >
          {allSelected ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Deselect All
            </>
          ) : someSelected ? (
            <>
              <span className="w-4 h-4" />
              Select All
            </>
          ) : (
            <>
              <span className="w-4 h-4" />
              Select All
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {permissions.map((permission) => (
            <PermissionCheckbox
              key={permission}
              permission={permission}
              checked={selectedPermissions.includes(permission)}
              onChange={() => onTogglePermission(permission)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PermissionsPage() {
  const { roleId } = useParams();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useGetRoleByIdQuery(roleId as string, {
    skip: !roleId,
  });
  const [updateRole, { isLoading: updateRoleIsLoading }] =
    useUpdateRoleMutation();

  const roleView = data?.data;

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role: "",
      display_name: "",
      description: "",
      status: "active",
      permissions: [],
    },
  });

  // Update form when API data is loaded
  useEffect(() => {
    if (roleView && Object.keys(roleView).length) {
      form.reset({
        role: roleView.role || "",
        display_name: roleView.display_name || "",
        description: roleView.description || "",
        status: roleView.status as "active" | "inactive",
        permissions: roleView.permissions || [],
      });
    }
  }, [roleView, form]);

  // Watch permissions for checkboxes
  const permissions = useWatch({
    control: form.control,
    name: "permissions",
  });

  const togglePermission = (value: string) => {
    const current = form.getValues("permissions");
    form.setValue(
      "permissions",
      current.includes(value)
        ? current.filter((p) => p !== value)
        : [...current, value]
    );
  };

  const toggleGroup = (groupPermissions: string[]) => {
    const current = form.getValues("permissions");
    const allSelected = groupPermissions.every((p) => current.includes(p));

    form.setValue(
      "permissions",
      allSelected
        ? current.filter((p) => !groupPermissions.includes(p))
        : Array.from(new Set([...current, ...groupPermissions]))
    );
  };

  const onSubmit = async (values: RoleFormValues) => {
    if (!roleId) return;

    try {
      const response = await updateRole({ roleId, body: values }).unwrap();
      if (response.status) {
        console.log("Role updated successfully:", response);
        toast.success(response.message || "Role updated successfully");
      }
    } catch (error) {
      console.error("Failed to update role:", error);
      const errorMessage = (error as { data?: { message?: string } })?.data?.message;
      alert(
        errorMessage ||
          "Something went wrong while updating the role."
      );
    }
  };

  // Filter permissions based on search
  const filteredGroups = Object.entries(PERMISSION_GROUPS).filter(
    ([, perms]) => {
      if (!searchQuery) return true;
      const values = Object.values(perms);
      return values.some((p) =>
        p.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Loading role...</span>
        </div>
      </div>
    );
  }

  // Role not found
  if (!roleView) {
    return (
      <div className="p-6 text-center text-red-500">
        Role not found or data is missing.
      </div>
    );
  }

  // Calculate stats
  const totalPermissions = Object.values(PERMISSION_GROUPS).flatMap(
    (perms) => Object.values(perms)
  ).length;
  const selectedCount = permissions.length;
  const percentage = Math.round((selectedCount / totalPermissions) * 100);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-wrap items-center justify-between gap-4 border-b bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">
                Edit Role & Permissions
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Configure role details and manage access permissions
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="default" className="gap-2">
            <Link to="/dashboard/roles">
              <ArrowLeft className="h-4 w-4" />
              Back to Roles
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        Role Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ADMIN"
                          className="font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="display_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <UserCog className="w-4 h-4 text-gray-400" />
                        Display Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="System Administrator"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-gray-400" />
                        Description
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Short description of this role"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-gray-400" />
                        Status
                      </FormLabel>
                      <Select
                        key={field.value}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-full">
                          <SelectItem value="active">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Active
                            </div>
                          </SelectItem>
                          <SelectItem value="inactive">
                            <div className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full bg-gray-400" />
                              Inactive
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Permissions */}
              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <div className="space-y-4">
                      {/* Permissions Header with Search */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <FormLabel className="text-lg font-semibold flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Permissions Configuration
                        </FormLabel>

                        {/* Search */}
                        <div className="relative w-full sm:w-72">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="Search permissions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      {/* Permission Summary */}
                      <Card className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-blue-800">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className="text-sm px-3 py-1 bg-white dark:bg-gray-800"
                                >
                                  {selectedCount} / {totalPermissions}
                                </Badge>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  permissions selected
                                </span>
                              </div>
                              <div className="hidden sm:block h-8 w-px bg-gray-300 dark:bg-gray-700" />
                              <div className="hidden sm:flex items-center gap-2">
                                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {percentage}%
                                </span>
                              </div>
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="w-5 h-5 text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">
                                    Select the permissions this role should have
                                    access to
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Permission Groups */}
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-gray-100 dark:bg-gray-800">
                          <TabsTrigger
                            value="dashboard"
                            className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                          </TabsTrigger>
                          <TabsTrigger
                            value="modules"
                            className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900"
                          >
                            <Package className="w-4 h-4" />
                            <span>Modules</span>
                          </TabsTrigger>
                          <TabsTrigger
                            value="management"
                            className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900"
                          >
                            <UserCog className="w-4 h-4" />
                            <span>Management</span>
                          </TabsTrigger>
                          <TabsTrigger
                            value="system"
                            className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900"
                          >
                            <Settings className="w-4 h-4" />
                            <span>System</span>
                          </TabsTrigger>
                        </TabsList>

                        {/* Dashboard Tab */}
                        <TabsContent value="dashboard" className="space-y-4 mt-4">
                          <PermissionGroupCard
                            groupName="Dashboard"
                            permissions={Object.values(PERMISSION_GROUPS.Dashboard)}
                            selectedPermissions={permissions}
                            onTogglePermission={togglePermission}
                            onToggleGroup={toggleGroup}
                          />
                        </TabsContent>

                        {/* Modules Tab */}
                        <TabsContent value="modules" className="space-y-4 mt-4">
                          {filteredGroups
                            .filter(
                              ([name]) =>
                                [
                                  "Products",
                                  "Customers",
                                  "Suppliers",
                                  "Purchase",
                                  "PurchaseReturn",
                                  "Sales",
                                  "SalesReturn",
                                  "Staffs",
                                  "Accounting",
                                ].includes(name)
                            )
                            .map(([groupName, perms]) => (
                              <PermissionGroupCard
                                key={groupName}
                                groupName={groupName}
                                permissions={Object.values(perms)}
                                selectedPermissions={permissions}
                                onTogglePermission={togglePermission}
                                onToggleGroup={toggleGroup}
                              />
                            ))}
                        </TabsContent>

                        {/* Management Tab */}
                        <TabsContent value="management" className="space-y-4 mt-4">
                          {filteredGroups
                            .filter(
                              ([name]) =>
                                [
                                  "Users",
                                  "Roles",
                                  "RouteOperations",
                                  "Payroll",
                                  "Reports",
                                  "Gallery",
                                ].includes(name)
                            )
                            .map(([groupName, perms]) => (
                              <PermissionGroupCard
                                key={groupName}
                                groupName={groupName}
                                permissions={Object.values(perms)}
                                selectedPermissions={permissions}
                                onTogglePermission={togglePermission}
                                onToggleGroup={toggleGroup}
                              />
                            ))}
                        </TabsContent>

                        {/* System Tab */}
                        <TabsContent value="system" className="space-y-4 mt-4">
                          {filteredGroups
                            .filter(
                              ([name]) =>
                                ["Settings", "Help", "System"].includes(name)
                            )
                            .map(([groupName, perms]) => (
                              <PermissionGroupCard
                                key={groupName}
                                groupName={groupName}
                                permissions={Object.values(perms)}
                                selectedPermissions={permissions}
                                onTogglePermission={togglePermission}
                                onToggleGroup={toggleGroup}
                              />
                            ))}
                        </TabsContent>
                      </Tabs>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset Changes
                </Button>
                <Button type="submit" disabled={updateRoleIsLoading} className="gap-2">
                  {updateRoleIsLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Save Role Permissions
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}







//  old code for reference



// "use client";

// import { useForm, useWatch } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// // role.schema.ts

// import { z } from "zod";
// import { PERMISSION_GROUPS } from "@/config/permissions";
// import { Link, useParams } from "react-router";
// import { useGetRoleByIdQuery, useUpdateRoleMutation } from "@/store/features/role/roleApiService";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { ArrowLeft, Loader } from "lucide-react";


// const roleSchema = z.object({
//   role: z.string().min(1, "Required"),
//   display_name: z.string().min(1, "Required"),
//   description: z.string().min(1, "Required"),
//   status: z.enum(["active", "inactive"]),
//   permissions: z.array(z.string()).min(1, "Select at least one permission"),
// });

// export type RoleFormValues = z.infer<typeof roleSchema>;


// export default function PermissionsPage() {

//   const { roleId } = useParams();
//   const [activeTab, setActiveTab] = useState("dashboard");

//   const groupTitles: Record<string, string> = {
//     RouteOperations: "Route Operations",
//     PurchaseReturn: "Purchase Return",
//     SalesReturn: "Sales Return",
//     Payroll: "HR & Payroll",
//     Roles: "Roles & Permissions",
//     System: "Database",
//     Gallery: "Gallery",
//   };

//   const formatGroupName = (name: string) =>
//     groupTitles[name] ?? name.replace(/([a-z])([A-Z])/g, "$1 $2");

//   const { data, isLoading } = useGetRoleByIdQuery(roleId as string, { skip: !roleId });
//   const [updateRole, { isLoading: updateRoleIsLoading }] = useUpdateRoleMutation()

//   const roleView = data?.data


//   const form = useForm<RoleFormValues>({
//     resolver: zodResolver(roleSchema),
//     defaultValues: {
//       role: "",
//       display_name: "",
//       description: "",
//       status: "active",
//       permissions: [],
//     },
//   });



//   // Update form when API data is loaded
//   useEffect(() => {
//     if (roleView && Object.keys(roleView).length) {
//       form.reset({
//         role: roleView.role || "",
//         display_name: roleView.display_name || "",
//         description: roleView.description || "",
//         status: roleView.status as "active" | "inactive",
//         permissions: roleView.permissions || [],
//       });

//     }
//   }, [roleView, form]);




//   // Watch permissions for checkboxes
//   const permissions = useWatch({
//     control: form.control,
//     name: "permissions",
//   });

//   const togglePermission = (value: string) => {
//     const current = form.getValues("permissions");
//     form.setValue(
//       "permissions",
//       current.includes(value)
//         ? current.filter(p => p !== value)
//         : [...current, value]
//     );
//   };

//   const toggleGroup = (groupPermissions: string[]) => {
//     const current = form.getValues("permissions");
//     const allSelected = groupPermissions.every(p =>
//       current.includes(p)
//     );

//     form.setValue(
//       "permissions",
//       allSelected
//         ? current.filter(p => !groupPermissions.includes(p))
//         : Array.from(new Set([...current, ...groupPermissions]))
//     );
//   };

//   const onSubmit = async (values: RoleFormValues) => {
//     if (!roleId) return;

//     try {
//       // Call the API mutation
//       const response = await updateRole({ roleId, body: values }).unwrap();
//       // Success feedback (you can replace with toast or modal)
//       if (response.status) {
//         console.log("Role updated successfully:", response);
//         toast.success(response.message || "Role updated successfully")

//       }


//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       // Error handling
//       console.error("Failed to update role:", error);
//       alert(
//         error?.data?.message || "Something went wrong while updating the role."
//       );
//     }
//   };


//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">
//         <div className="flex items-center gap-3 text-muted-foreground">
//           <Loader className="h-5 w-5 animate-spin" />
//           <span className="text-sm font-medium">Loading role...</span>
//         </div>
//       </div>
//     );
//   }


//   // Role not found
//   if (!roleView) {
//     return (
//       <div className="p-6 text-center text-red-500">
//         Role not found or data is missing.
//       </div>
//     );
//   }


//   return (
//     <div className="space-y-6">
//       <Card className="py-6">
//         <CardHeader className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
//           {/* Title */}
//           <div className="flex flex-col">
//             <CardTitle className="text-lg font-semibold">
//               Edit Role & Permissions
//             </CardTitle>
//             <p className="text-sm text-muted-foreground">
//               Update role details and manage permissions
//             </p>
//           </div>

//           {/* Back Button */}
//           <Button asChild variant="outline" size="sm" className="gap-2">
//             <Link to="/dashboard/roles">
//               <ArrowLeft className="h-4 w-4" />
//               Back to Roles
//             </Link>
//           </Button>
//         </CardHeader>

//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

//               {/* Role Info */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="role"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Role Code</FormLabel>
//                       <FormControl>
//                         <Input placeholder="ADMIN" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="display_name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Display Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="System Administrator" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Description</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Short description" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="status"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="block w-full">Status</FormLabel>
//                       <Select key={field.value} onValueChange={field.onChange} value={field.value}>
//                         <FormControl>
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select status" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent className="w-full">
//                           <SelectItem value="active">Active</SelectItem>
//                           <SelectItem value="inactive">Inactive</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Permissions */}
//               <FormField
//                 control={form.control}
//                 name="permissions"
//                 render={() => (
//                   <FormItem>
//                     <FormLabel className="text-lg font-semibold">
//                       Permissions
//                     </FormLabel>

//                     <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                       <TabsList className="grid w-full grid-cols-2">
//                         <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
//                         <TabsTrigger value="role-permissions">Role Permissions</TabsTrigger>
//                       </TabsList>

//                       {/* Dashboard Tab */}
//                       <TabsContent value="dashboard" className="space-y-4">
//                         {(() => {
//                           const dashboardPerms = PERMISSION_GROUPS.Dashboard;
//                           const values = Object.values(dashboardPerms);
//                           const allChecked = values.every(p =>
//                             permissions.includes(p)
//                           );

//                           return (
//                             <Card className="py-10">
//                               <CardHeader className="flex flex-row items-center justify-between py-3">
//                                 <CardTitle className="text-sm">
//                                   Dashboard
//                                 </CardTitle>
//                                 <Button
//                                   type="button"
//                                   size="sm"
//                                   variant="outline"
//                                   onClick={() => toggleGroup(values)}
//                                 >
//                                   {allChecked ? "Unselect All" : "Select All"}
//                                 </Button>
//                               </CardHeader>

//                               <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                                 {values.map(permission => (
//                                   <label
//                                     key={permission}
//                                     className="flex items-center gap-2 text-sm"
//                                   >
//                                     <Checkbox
//                                       checked={permissions.includes(permission)}
//                                       onCheckedChange={() =>
//                                         togglePermission(permission)
//                                       }
//                                     />
//                                     {permission}
//                                   </label>
//                                 ))}
//                               </CardContent>
//                             </Card>
//                           );
//                         })()}
//                       </TabsContent>

//                       {/* Role Permissions Tab */}
//                       <TabsContent value="role-permissions" className="space-y-4">
//                         {Object.entries(PERMISSION_GROUPS)
//                           .filter(([groupName]) => groupName !== "Dashboard")
//                           .map(([groupName, perms]) => {
//                             const values = Object.values(perms);
//                             const allChecked = values.every(p =>
//                               permissions.includes(p)
//                             );

//                             return (
//                               <Card key={groupName} className="py-10" >
//                                 <CardHeader className="flex flex-row items-center justify-between py-3">
//                                   <CardTitle className="text-sm">
//                                     {formatGroupName(groupName)}
//                                   </CardTitle>
//                                   <Button
//                                     type="button"
//                                     size="sm"
//                                     variant="outline"
//                                     onClick={() => toggleGroup(values)}
//                                   >
//                                     {allChecked ? "Unselect All" : "Select All"}
//                                   </Button>
//                                 </CardHeader>

//                                 <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 ">
//                                   {values.map(permission => (
//                                     <label
//                                       key={permission}
//                                       className="flex items-center gap-2 text-sm"
//                                     >
//                                       <Checkbox
//                                         checked={permissions.includes(permission)}
//                                         onCheckedChange={() =>
//                                           togglePermission(permission)
//                                         }
//                                       />
//                                       {permission}
//                                     </label>
//                                   ))}
//                                 </CardContent>
//                               </Card>
//                             );
//                           })}
//                       </TabsContent>
//                     </Tabs>

//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex justify-end">
//                 <Button type="submit" disabled={updateRoleIsLoading}>
//                   {updateRoleIsLoading ? "Saving..." : "Save Role"}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }






