import { Analytics } from "@/components/dashboard/components/Analytics";
import { Overview } from "@/components/dashboard/components/Overview";
import RecentCustomers from "@/components/dashboard/components/RecentCustomers";
import RecentOrders from "@/components/dashboard/components/RecentOrders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  useGetDashboardStatsQuery,
  type DashboardStats,
} from "@/store/features/admin/dashboardApiService";
import { useAppSelector } from "@/store/store";
import { ShoppingCart, Users } from "lucide-react";
import { Link } from "react-router";

export default function Dashboard() {
  const { data: dashboardStatsData } = useGetDashboardStatsQuery();

  const dashboardStats: DashboardStats | undefined = dashboardStatsData?.data;
  // console.log('dashboardStats', dashboardStats);
  const currency = useAppSelector((state) => state.currency.value);
  return (
    <>
      <div className="mb-6 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        {/* <div className="flex items-center space-x-2">
          <Button>Download</Button>
        </div> */}
      </div>
      <Tabs
        orientation="vertical"
        defaultValue="overview"
        className="space-y-4"
      >
        {/* <div className="w-full overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Reports
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
          </TabsList>
        </div> */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="text-muted-foreground h-4 w-4"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currency} {dashboardStats?.revenue}
                </div>
                {/* <p className='text-muted-foreground text-xs'>
                    +20.1% from last month
                  </p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <ShoppingCart className="w-4 h-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats?.totalOrders}
                </div>
                {/* <p className='text-muted-foreground text-xs'>
                    +180.1% from last month
                  </p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Orders
                </CardTitle>
                <ShoppingCart className="w-4 h-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats?.pendingOrders}
                </div>
                {/* <p className='text-muted-foreground text-xs'>
                    +180.1% from last month
                  </p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Customers
                </CardTitle>
                <Users className="w-4 h-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats?.activeCustomers}
                </div>
                {/* <p className='text-muted-foreground text-xs'>
                    +19% from last month
                  </p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="text-muted-foreground h-4 w-4"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats?.lowStock}
                </div>
                {/* <p className='text-muted-foreground text-xs'>
                    +201 since last hour
                  </p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Staffs
                </CardTitle>
                <Users className="w-4 h-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats?.activeStaff}
                </div>
                {/* <p className='text-muted-foreground text-xs'>
                    +180.1% from last month
                  </p> */}
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>January - December {new Date().getFullYear()}</CardDescription>
              </CardHeader>
              <CardContent className="ps-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader className="flex justify-between gap-4">
                <div>
                  <CardTitle>Recent Customers</CardTitle>
                  <CardDescription>Latest signups</CardDescription>
                </div>
                <Link to="/dashboard/customers">
                  <Button variant="outline-info">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                <RecentCustomers />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="flex justify-between gap-4 items-center">
              <div>
                <CardTitle>Recent Sales Orders</CardTitle>
                <CardDescription>Manage your orders</CardDescription>
              </div>
               <Link to="/dashboard/sales/orders">
                  <Button variant="outline-info">View All Orders</Button>
                </Link>
            </CardHeader>
            <CardContent>
              <RecentOrders />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Analytics />
        </TabsContent>
      </Tabs>
    </>
  );
}
