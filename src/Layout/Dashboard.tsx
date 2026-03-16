import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";

import { AppSidebar } from "../components/app-sidebar";
import { ProfileDropdown } from "../components/dashboard/components/ProfileDropdown";
import { NotificationDropdown } from "../components/dashboard/components/NotificationDropdown";

import { ThemeSwitch } from "../components/theme-switch";
import { Outlet } from "react-router";
import { useAuthUserQuery } from "@/store/features/auth/authApiService";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useGetSettingsInfoQuery } from "@/store/features/admin/settingsApiService";
import { useAppSelector } from "@/store/store";
import type { User } from "@/types/users.types";

export default function DashboardLayout() {
  const { data: settings } = useGetSettingsInfoQuery();
  useAppSettings(settings?.data);

  // Subscribe to auth user to keep permissions in sync when tags are invalidated
  useAuthUserQuery();

  const user = useAppSelector((state) => state.auth.user) as User | null;


  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar className="print:hidden" />
      <SidebarInset className="overflow-y-auto overflow-x-hidden flex flex-col h-full bg-background">
        <header className="flex h-14 shrink-0 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-gray-100 sticky top-0 z-30 print:hidden">
          <div className="flex items-center gap-2 px-4 w-full bg-background/20 backdrop-blur-lg">
            <SidebarTrigger className="-ml-1 cursor-pointer" />
            <div className="ml-auto flex items-center gap-4">
              <span className="text-xs bg-blue-100 px-3 py-1 rounded-full text-blue-600 font-semibold">{user?.role?.display_name}</span>
              {user?.role?.name?.toLowerCase() === 'superadmin' && <NotificationDropdown />}
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </div>
        </header>
        <main className="p-6 lg:p-10 w-full flex-1">
          <Outlet />
        </main>
        <footer>
          <div className="p-4 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-1 print:hidden">
            <div>
              &copy; {new Date().getFullYear()} {settings?.data?.company_name || 'ERP'}. All rights reserved.
            </div>
            <div className="flex items-center gap-1">
              Developed by{" "}
              <a
                href="https://inleadsit.com.my/"
                className="hover:underline text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Inleads IT
              </a>
            </div>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
