import { Card, CardContent } from "@/components/ui/card";
import { sidebarItemLink } from "@/config/sidebarItemLInk";

import { Link, Outlet } from "react-router";

// Render sidebar recursively
export default function SettingsSidebarLayout() {
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
          to={item.url}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200"
        >
          {item.icon && <item.icon className="w-4 h-4 opacity-80" />}
          <span>{item.title}</span>
        </Link>
      );
    });

  return (
    <div className="flex h-screen gap-4 ">
      {/* Sidebar */}
      <Card className="w-64 h-full overflow-y-auto">
        <CardContent className="space-y-6">
          {renderSidebarItems(sidebarItemLink.filter((item) => item.layout))}
        </CardContent>
      </Card>

      {/* Main content */}
      <Card className="flex-1 h-full overflow-y-auto">
        <CardContent className="p-6">
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
}
