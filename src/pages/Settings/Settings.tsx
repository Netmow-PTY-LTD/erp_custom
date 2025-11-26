
import { Card, CardContent } from "@/components/ui/card";
import { sidebarItemLink } from "@/config/sidebarItemLInk";
import { Link, Outlet } from "react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Hamburger & close icons

export default function SettingsSidebarLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Recursive rendering of sidebar items
  const renderSidebarItems = (items: typeof sidebarItemLink) =>
    items.map((item) => {
      if (item.items && item.items.length > 0) {
        return (
          <div key={item.title} className="mb-4">
            <div className="font-semibold px-3 py-1 flex items-center gap-2">
              {item.icon && <item.icon className="w-4 h-4 opacity-80" />}
              <span>{item.title}</span>
            </div>
            <div className="ml-4">{renderSidebarItems(item.items as typeof sidebarItemLink)}</div>
          </div>
        );
      }

      return (
        <Link
          key={item.url}
          to={item.url!}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200"
        >
          {item.icon && <item.icon className="w-4 h-4 opacity-80" />}
          <span>{item.title}</span>
        </Link>
      );
    });

  return (
    <div className="flex h-screen ">
      {/* Sidebar toggle button for mobile */}
      <button
        className="absolute top-14 left-6 z-50   rounded-md md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Sidebar */}
      <Card
        className={`fixed top-0 right-0 h-full w-64 overflow-y-auto bg-white z-40 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0 md:relative md:flex`}
      >
        <CardContent className="space-y-6 p-4">
          {renderSidebarItems(sidebarItemLink.filter((item) => item.layout))}
        </CardContent>
      </Card>

      {/* Main content */}
      <Card className="flex-1 h-full overflow-y-auto  md:ml-4">
        <CardContent >
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
}
