import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outlet, useLocation, useNavigate } from "react-router";


export default function SettingsLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Profile", path: "profile" },
    { label: "Billing Details", path: "billing" },
    { label: "My Credits", path: "credits" },
    { label: "Lead Settings", path: "lead-settings" },
    { label: "Services", path: "services" },
  ];

  // Active tab from last segment of URL
  const activeTab = location.pathname.split("/").pop() || "profile";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <Tabs value={activeTab} className="w-full">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.path}
              value={tab.path}
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
}
