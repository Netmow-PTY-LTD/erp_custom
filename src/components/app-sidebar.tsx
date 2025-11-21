"use client";


import {
  AudioWaveform,

  Bell,
  Car,

  Command,

  GalleryVerticalEnd,
  HandCoins,
  LayoutDashboard,
  LineChart,

  Monitor,
  Package,
  Palette,

  Settings,

  ShoppingCart,

  UserPlus,
  Users,
  Wrench,
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "./ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";





// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/tenant",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      url: "#",
      icon: Package,
      items: [
        {
          title: "Products",
          url: "/dashboard/products",
        },
        {
          title: "Add Product",
          url: "/dashboard/products/create",
        },
        {
          title: "Categories",
          url: "/dashboard/products/categories",
        },
        {
          title: "Stock Management",
          url: "/dashboard/products/stock",
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
        },
        {
          title: "Add Customer",
          url: "/dashboard/customers/create",
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
        },
        {
          title: "Add Supplier",
          url: "/dashboard/suppliers/create",
        },
        {
          title: "Purchase Orders",
          url: "/dashboard/suppliers/purchase-orders",
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
        },
        {
          title: "Create Order",
          url: "/dashboard/orders/create",
        },
        {
          title: "Invoices",
          url: "/dashboard/invoices",
        },
        {
          title: "Payments",
          url: "/dashboard/payments",
        },
        {
          title: "Warehouses",
          url: "/dashboard/warehouses",
        },
        {
          title: "Delivery",
          url: "/dashboard/delivery",
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
        },
        {
          title: "Incomes",
          url: "/dashboard/accounting/incomes",
        },
        {
          title: "Expenses",
          url: "/dashboard/accounting/expenses",
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
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "/dashboard/settings",
          icon: UserPlus,
        },
        {
          title: "Account",
          url: "/dashboard/settings/account",
          icon: Wrench,
        },
        {
          title: "Appearance",
          url: "/dashboard/settings/appearance",
          icon: Palette,
        },
        {
          title: "Notifications",
          url: "/dashboard/settings/notifications",
          icon: Bell,
        },
        {
          title: "Display",
          url: "/dashboard/settings/display",
          icon: Monitor,
        },
      ],
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: LineChart,
      items: [
        {
          title: "Sales Reports",
          url: "/dashboard/reports/sales",
        },
        {
          title: "Inventory Reports",
          url: "/dashboard/reports/inventory",
        },
        {
          title: "Customers Reports",
          url: "/dashboard/reports/customers",
        },
        {
          title: "Suppliers Reports",
          url: "/dashboard/reports/suppliers",
        },
        {
          title: "Purchase Reports",
          url: "/dashboard/reports/purchases",
        },
        {
          title: "Payments",
          url: "/dashboard/reports/payments",
        },
        {
          title: "Staff Reports",
          url: "/dashboard/reports/staff",
        },
      ],
    },
  ],
};



export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
