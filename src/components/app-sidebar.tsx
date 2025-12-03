"use client";

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenuButton } from "./ui/sidebar";
import { NavMain } from "./nav-main";
import { sidebarItemLink } from "../config/sidebarItemLink";




export function AppSidebar({ ...props }) {


  // Dummy team data
  const activeTeam = {
    name: "Inleads IT",
    plan: "Free",
    logo: () => (
      <div className="w-6 h-6 object-contain rounded-full">
        <img src="https://inleadsit.com.my/wp-content/uploads/2023/07/favicon-2.png" alt="" />
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
          <div className="text-sidebar-primary-foreground flex aspect-square size-8 justify-center rounded-lg">
            <activeTeam.logo />
          </div>
          <div className="grid flex-1 text-start text-sm leading-tight">
            <span className="truncate font-semibold">{activeTeam.name}</span>
            <span className="truncate text-xs">{activeTeam.plan}</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItemLink ?? []} />
      </SidebarContent>


    </Sidebar>
  );
}
