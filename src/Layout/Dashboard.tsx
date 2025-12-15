import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";

import { AppSidebar } from "../components/app-sidebar";
import { ProfileDropdown } from "../components/dashboard/components/ProfileDropdown";

import { ThemeSwitch } from "../components/theme-switch";
import { Link, Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <SidebarProvider className={`bg-white`}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-gray-100 sticky top-0 z-30 print:hidden">
          <div className="flex items-center gap-2 px-4 w-full bg-background/20 backdrop-blur-lg">
            <SidebarTrigger className="-ml-1 cursor-pointer" />
            <div className="ml-auto flex items-center gap-4">
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </div>
        </header>
        <main className="p-6 max-w-7xl w-full mx-auto flex-1">
          <Outlet />
        </main>
        <footer>
          <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-3">
            &copy; {new Date().getFullYear()} ERP. Designed and Developed by{" "}
            <Link
              to="https://inleadsit.com.my"
              className="flex items-center gap-2"
              target="_blank"
            >
              <img
                src="https://inleadsit.com.my/wp-content/uploads/2023/07/favicon-2.png"
                alt=""
                className="w-5 h-5"
              />
              Inleads IT
            </Link>
            .
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
