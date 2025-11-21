"use client";

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenuButton } from "./ui/sidebar";
import { NavMain } from "./nav-main";
import { sidebarItemLInk } from "../config/sidebarItemLInk";




export function AppSidebar({ ...props }) {


  // Dummy team data
  const activeTeam = {
    name: "Dummy Team",
    plan: "Free",
    logo: () => (
      <div className="bg-gray-400 text-white flex items-center justify-center w-6 h-6 rounded-full">
        ERP
      </div>
    ),
  };




  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <activeTeam.logo />
          </div>
          <div className="grid flex-1 text-start text-sm leading-tight">
            <span className="truncate font-semibold">{activeTeam.name}</span>
            <span className="truncate text-xs">{activeTeam.plan}</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItemLInk ?? []} />
      </SidebarContent>


    </Sidebar>
  );
}
