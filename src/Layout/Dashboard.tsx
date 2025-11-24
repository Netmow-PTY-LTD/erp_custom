
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";

import { AppSidebar } from "../components/app-sidebar";
import { ProfileDropdown } from "../components/dashboard/components/ProfileDropdown";

import { ThemeSwitch } from "../components/theme-switch";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <SidebarProvider className={`bg-white`}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-gray-100 sticky top-0 z-30 bg-background">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1 cursor-pointer" />
            <div className="ml-auto flex items-center gap-4">
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </div>
        </header>
        <main className="p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
