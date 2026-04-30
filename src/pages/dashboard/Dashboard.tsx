import { Analytics } from "@/components/dashboard/components/Analytics";
import { Overview } from "@/components/dashboard/components/Overview";
import RecentCustomers from "@/components/dashboard/components/RecentCustomers";
import RecentOrders from "@/components/dashboard/components/RecentOrders";
import StatusOrdersTable from "@/components/dashboard/components/StatusOrdersTable";
import RecentStatusCustomers from "@/components/dashboard/components/RecentStatusCustomers";
import { StaffsSalesOverview } from "@/components/dashboard/components/StaffsSalesOverview";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DashboardPermission, SuperAdminPermission } from "@/config/permissions";
import {
  useGetDashboardStatsQuery,
  useGetDashboardSalesStatsQuery,
  type DashboardStats,
} from "@/store/features/admin/dashboardApiService";
import { useGetProductStatsQuery } from "@/store/features/admin/productsApiService";
import { useAppSelector } from "@/store/store";
import { Users, DollarSign, Clock, AlertTriangle, ChevronDown, PlusCircle } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

export default function Dashboard() {

  const userPermissions = useAppSelector((state) => state.auth.user?.role.permissions || []);

  // Units permissions
  const canGraphShow = userPermissions.includes(DashboardPermission.GRAPH) || userPermissions.includes(SuperAdminPermission.ACCESS_ALL);
  const canRecentCustomersListShow = userPermissions.includes(DashboardPermission.RECENT_CUSTOMERS_LIST) || userPermissions.includes(SuperAdminPermission.ACCESS_ALL);
  const canRecentSalesListShow = userPermissions.includes(DashboardPermission.RECENT_SALES_LIST) || userPermissions.includes(SuperAdminPermission.ACCESS_ALL);
  const canStatsShow = userPermissions.includes(DashboardPermission.STATS) || userPermissions.includes(SuperAdminPermission.ACCESS_ALL);

  const canPendingSalesListShow = userPermissions.includes(DashboardPermission.PENDING_SALES_LIST) || userPermissions.includes(SuperAdminPermission.ACCESS_ALL);
  const canConfirmedSalesListShow = userPermissions.includes(DashboardPermission.CONFIRMED_SALES_LIST) || userPermissions.includes(SuperAdminPermission.ACCESS_ALL);
  const canDeliveredSalesListShow = userPermissions.includes(DashboardPermission.DELIVERED_SALES_LIST) || userPermissions.includes(SuperAdminPermission.ACCESS_ALL);
  const canInTransitSalesListShow = userPermissions.includes(DashboardPermission.INTRANSIT_SALES_LIST) || userPermissions.includes(SuperAdminPermission.ACCESS_ALL);
  const isSuperAdmin = userPermissions.includes(SuperAdminPermission.ACCESS_ALL);
  const canRecentActiveCustomersShow = userPermissions.includes(DashboardPermission.RECENT_ACTIVE_CUSTOMERS_LIST) || isSuperAdmin;
  const canRecentInactiveCustomersShow = userPermissions.includes(DashboardPermission.RECENT_INACTIVE_CUSTOMERS_LIST) || isSuperAdmin;
  const canStaffsChartShow = userPermissions.includes(DashboardPermission.STAFFS_CHART) && !isSuperAdmin;

  const [invoicePeriod, setInvoicePeriod] = useState<"thisMonth" | "lastMonth" | "thisYear">("thisMonth");

  // Map UI dropdown values to API filter param
  const periodFilterMap: Record<string, string> = {
    thisMonth: "thisMonth",
    lastMonth: "lastMonth",
    thisYear: "thisYear",
  };

  const { data: dashboardSalesStatsData, isFetching: isSalesStatsFetching } =
    useGetDashboardSalesStatsQuery(periodFilterMap[invoicePeriod]);

  const salesStats = dashboardSalesStatsData?.data;

  // Compute progress bar widths — capped at 100%
  const salesBarWidth = salesStats
    ? Math.min(100, salesStats.total_sales > 0 ? 100 : 0)
    : 0;
  const collectionsBarWidth = salesStats && salesStats.total_sales > 0
    ? Math.min(100, Math.round((salesStats.total_collections / salesStats.total_sales) * 100))
    : 0;

  const { data: dashboardStatsData } = useGetDashboardStatsQuery();
  const dashboardStats: DashboardStats | undefined = dashboardStatsData?.data;

  const { data: productStatsData } = useGetProductStatsQuery(undefined);
  const totalProductsCount = productStatsData?.data?.filter(
    (p: { label: string; value: number }) => p.label === "Total Products"
  )?.[0]?.value || 0;

  const currency = useAppSelector((state) => state.currency.value);
  // Stats configuration
  const stats = [
    {
      label: "Total Revenue",
      value: `${currency} ${dashboardStats?.revenue || 0}`,
      gradient: "from-blue-600 to-blue-400",
      shadow: "shadow-blue-500/30",
      icon: <DollarSign className="w-6 h-6 text-white" />,
    },
    {
      label: "Total Orders",
      value: dashboardStats?.totalOrders || 0,
      gradient: "from-emerald-600 to-emerald-400",
      shadow: "shadow-emerald-500/30",
      icon: <Users className="w-6 h-6 text-white" />,
    },
    {
      label: "Pending Orders",
      value: dashboardStats?.pendingOrders || 0,
      gradient: "from-amber-600 to-amber-400",
      shadow: "shadow-amber-500/30",
      icon: <Clock className="w-6 h-6 text-white" />,
    },
    {
      label: "Active Customers",
      value: dashboardStats?.activeCustomers || 0,
      gradient: "from-violet-600 to-violet-400",
      shadow: "shadow-violet-500/30",
      icon: <Users className="w-6 h-6 text-white" />,
    },
    {
      label: "Low Stock",
      value: dashboardStats?.lowStock || 0,
      gradient: "from-rose-600 to-rose-400",
      shadow: "shadow-rose-500/30",
      icon: <AlertTriangle className="w-6 h-6 text-white" />,
    },
  ];

  return (
    <>
      <div className="mb-6 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <Tabs
        orientation="vertical"
        defaultValue="overview"
        className="space-y-4"
      >
        <TabsContent value="overview" className="space-y-8">
          {/* Stats Cards */}
          {canStatsShow && <div className="flex flex-wrap gap-4">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className={`relative flex-1 min-w-[200px] overflow-hidden rounded-2xl bg-linear-to-r ${item.gradient} p-6 shadow-lg ${item.shadow} transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1`}
              >
                {/* Background Pattern */}
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-black/10 blur-2xl" />

                <div className="relative flex flex-col justify-between h-full space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {item.value}
                    </h3>
                    <p className="text-xs font-medium text-white/80 uppercase tracking-wider mt-1">{item.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>}

          {/* Sales Summary Cards */}
          {canStaffsChartShow && (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* INVOICE Card */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <h2 className="text-xs font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Invoice</h2>
                  <div className="relative">
                    <select
                      value={invoicePeriod}
                      onChange={(e) => setInvoicePeriod(e.target.value as typeof invoicePeriod)}
                      className="appearance-none rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 pl-3 pr-8 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="thisMonth">This Month</option>
                      <option value="lastMonth">Last Month</option>
                      <option value="thisYear">This Year</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className={`px-5 pb-5 space-y-5 transition-opacity duration-200 ${isSalesStatsFetching ? "opacity-50" : "opacity-100"}`}>
                  {/* Total Sales */}
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {currency} {(salesStats?.total_sales ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      Total {salesStats?.total_invoices ?? 0} Invoices
                    </p>
                    {/* Blue progress bar */}
                    <div className="mt-3 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                        style={{ width: `${salesBarWidth}%` }}
                      />
                    </div>
                  </div>

                  {/* Total Collection */}
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {currency} {(salesStats?.total_collections ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      Total Collection From {salesStats?.total_orders ?? 0} Invoices
                    </p>
                    {/* Green progress bar */}
                    <div className="mt-3 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
                        style={{ width: `${collectionsBarWidth}%` }}
                      />
                    </div>
                  </div>

                  {/* Create Invoice link */}
                  <div className="pt-1 text-right">
                    <Link
                      to="/dashboard/sales/orders/create"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-gray-50 dark:bg-gray-800 p-2 rounded-[30px] px-5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Create an Invoice
                    </Link>
                  </div>
                </div>
              </div>

              {/* CUSTOMER, VENDOR, ITEMS Card */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-5 pt-5 pb-3">
                  <h2 className="text-xs font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Customer, Vendor, Items</h2>
                </div>

                <div className="px-5 pb-5 space-y-3">
                  {/* Customers */}
                  <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 hover:border-green-200 dark:hover:border-green-800 hover:bg-green-50/30 dark:hover:bg-green-900/10 transition-colors">
                    <p className="text-xl font-bold text-green-500">
                      {(dashboardStats?.activeCustomers ?? 0)} Customers
                    </p>
                    <Link
                      to="/dashboard/customers/create/by-staff"
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-1 font-semibold"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Create a new Customer
                    </Link>
                  </div>

                  {/* Vendors */}
                  {/* <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 hover:border-orange-200 dark:hover:border-orange-800 hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-colors">
                    <p className="text-xl font-bold text-orange-500">
                      {Math.floor((dashboardStats?.revenue ?? 0) / 100000) % 100} Vendors
                    </p>
                    <Link
                      to="/dashboard/suppliers"
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-1 font-semibold"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Create a new Vendor
                    </Link>
                  </div> */}

                  {/* Items */}
                  <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 hover:border-orange-200 dark:hover:border-orange-800 hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-colors">
                    <p className="text-xl font-bold text-orange-400">
                      {totalProductsCount} Items
                    </p>
                    <Link
                      to="/dashboard/products"
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-1 font-semibold"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Create a new Item
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}


          {
            canGraphShow && <div className="col-span-1 lg:col-span-4"><Card className="py-6">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>January - December {new Date().getFullYear()}</CardDescription>
              </CardHeader>
              <CardContent className="ps-2">
                <Overview />
              </CardContent>
            </Card>
            </div>
          }

          {/* Staffs Sales Overview - Visible only to Staff (NOT SuperAdmin) */}
          {
            canStaffsChartShow && <div className="col-span-1 lg:col-span-4"><Card className="py-6">
              <CardHeader>
                <CardTitle>Staffs Sales Overview</CardTitle>
                <CardDescription>January - December {new Date().getFullYear()}</CardDescription>
              </CardHeader>
              <CardContent className="ps-2">
                <StaffsSalesOverview />
              </CardContent>
            </Card>
            </div>
          }


          {canRecentCustomersListShow && <Card className="col-span-1 lg:col-span-3 py-6">
            <CardHeader className="flex justify-between gap-4">
              <div>
                <CardTitle>Recent Customers</CardTitle>
                <CardDescription>Latest signups</CardDescription>
              </div>
              <Link to="/dashboard/customers">
                <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-500/40 active:translate-y-0 active:shadow-none">
                  View All
                </button>
              </Link>
            </CardHeader>
            <CardContent>
              <RecentCustomers />
            </CardContent>
          </Card>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {canRecentActiveCustomersShow && <Card className="py-6">
              <CardHeader className="flex justify-between gap-4">
                <div>
                  <CardTitle>Recent Active Customers</CardTitle>
                  <CardDescription>Currently active profiles</CardDescription>
                </div>
                <Link to="/dashboard/customers">
                  <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-violet-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-violet-500/40 active:translate-y-0 active:shadow-none">
                    View All Active
                  </button>
                </Link>
              </CardHeader>
              <CardContent>
                <RecentStatusCustomers status="active" />
              </CardContent>
            </Card>}

            {canRecentInactiveCustomersShow && <Card className="py-6">
              <CardHeader className="flex justify-between gap-4">
                <div>
                  <CardTitle>Recent Inactive Customers</CardTitle>
                  <CardDescription>Currently inactive profiles</CardDescription>
                </div>
                <Link to="/dashboard/customers/inactive">
                  <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-rose-600 to-rose-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-rose-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-rose-500/40 active:translate-y-0 active:shadow-none">
                    View All Inactive
                  </button>
                </Link>
              </CardHeader>
              <CardContent>
                <RecentStatusCustomers status="inactive" />
              </CardContent>
            </Card>}
          </div>
          {
            canRecentSalesListShow && <Card className="pt-6 pb-2">
              <CardHeader className="flex justify-between gap-4 items-center">
                <div>
                  <CardTitle>Recent Sales Orders</CardTitle>
                  <CardDescription>Manage your orders</CardDescription>
                </div>
                <Link to="/dashboard/sales/orders">
                  <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-500/40 active:translate-y-0 active:shadow-none">
                    View All Orders
                  </button>
                </Link>
              </CardHeader>
              <CardContent>
                <RecentOrders />
              </CardContent>
            </Card>
          }

          {/* Pending Sales Orders */}
          {
            canPendingSalesListShow && <Card className="pt-6 pb-2">
              <CardHeader className="flex justify-between gap-4 items-center">
                <div>
                  <CardTitle>Pending Sales Orders</CardTitle>
                  <CardDescription>Sales orders awaiting processing</CardDescription>
                </div>
                <Link to="/dashboard/sales/orders/pending">
                  <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-amber-600 to-amber-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-amber-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-amber-500/40 active:translate-y-0 active:shadow-none">
                    View All Pending
                  </button>
                </Link>
              </CardHeader>
              <CardContent>
                <StatusOrdersTable status="pending" />
              </CardContent>
            </Card>
          }

          {/* Confirmed Sales Orders */}
          {
            canConfirmedSalesListShow && <Card className="pt-6 pb-2">
              <CardHeader className="flex justify-between gap-4 items-center">
                <div>
                  <CardTitle>Confirmed Sales Orders</CardTitle>
                  <CardDescription>Orders confirmed and ready for transit</CardDescription>
                </div>
                <Link to="/dashboard/sales/orders/confirmed">
                  <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-500/40 active:translate-y-0 active:shadow-none">
                    View All Confirmed
                  </button>
                </Link>
              </CardHeader>
              <CardContent>
                <StatusOrdersTable status="confirmed" />
              </CardContent>
            </Card>
          }

          {/* In Transit Sales Orders */}
          {
            canInTransitSalesListShow && <Card className="pt-6 pb-2">
              <CardHeader className="flex justify-between gap-4 items-center">
                <div>
                  <CardTitle>In Transit Sales Orders</CardTitle>
                  <CardDescription>Orders currently on the way</CardDescription>
                </div>
                <Link to="/dashboard/sales/orders/intransit-order">
                  <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-purple-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-purple-500/40 active:translate-y-0 active:shadow-none">
                    View All In Transit
                  </button>
                </Link>
              </CardHeader>
              <CardContent>
                <StatusOrdersTable status="in_transit" />
              </CardContent>
            </Card>
          }

          {/* Delivered Sales Orders */}
          {
            canDeliveredSalesListShow && <Card className="pt-6 pb-2">
              <CardHeader className="flex justify-between gap-4 items-center">
                <div>
                  <CardTitle>Delivered Sales Orders</CardTitle>
                  <CardDescription>Successfully delivered orders</CardDescription>
                </div>
                <Link to="/dashboard/sales/orders/delivered">
                  <button className="flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-emerald-500/40 active:translate-y-0 active:shadow-none">
                    View All Delivered
                  </button>
                </Link>
              </CardHeader>
              <CardContent>
                <StatusOrdersTable status="delivered" />
              </CardContent>
            </Card>
          }
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Analytics />
        </TabsContent>
      </Tabs>
    </>
  );
}
