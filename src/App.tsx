import { Link } from "react-router";
import { useAuthUserQuery } from "./store/features/auth/authApiService";
import { Loader } from "lucide-react";
import { useGetSettingsInfoQuery } from "./store/features/admin/settingsApiService";
import { useAppSettings } from "./hooks/useAppSettings";
import { useEffect } from "react";

import { useAppSelector } from "./store/store";
import { sidebarItemLink } from "./config/sidebarItemLInk";
import { getFirstAllowedRoute } from "./utils/permissionUtils";


const APP = () => {
  const token = useAppSelector((state) => state.auth.token);
  const { data: user, isLoading } = useAuthUserQuery(undefined, {
    skip: !token,
  });

  const { data: settings } = useGetSettingsInfoQuery();
  const isLoggedIn = user?.data?.user?.email;

  useAppSettings(settings?.data);

  // Update document title dynamically based on settings
  useEffect(() => {
    if (settings?.data?.company_name) {
      document.title = `${settings.data.company_name} | ERP`;
    } else {
      document.title = 'ERP System';
    }
  }, [settings]);





  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-linear-to-r from-blue-600 to-indigo-600 text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Manage Your Business Effortlessly
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          {settings?.data?.company_name || 'ERP'} helps you streamline Products, Customers, Orders, Accounting, and HR, all in one unified platform.
        </p>
        <div className="flex gap-4">
          {isLoading ? (
            <div className="px-8 py-3 text-white"><Loader /></div>
          ) : isLoggedIn ? (
            <Link
              to={getFirstAllowedRoute(sidebarItemLink, user?.data?.user?.role?.permissions || [])}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded shadow hover:bg-green-700 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded shadow hover:bg-gray-100 transition"
              >
                Sign In
              </Link>
              {/* <Link
                to="/register"
                className="px-8 py-3 bg-blue-500 bg-opacity-20 text-white font-semibold rounded shadow hover:bg-opacity-30 transition"
              >
                Sign Up
              </Link> */}
            </>
          )}
        </div>

      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Core Features
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Complete ERP solution with 20+ integrated modules to manage every aspect of your business
        </p>
        <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {/* Dashboard */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-blue-600 text-4xl mb-4">📊</div>
            <h3 className="font-semibold text-lg mb-2">Dashboard</h3>
            <p className="text-gray-600 text-sm">Real-time analytics and business overview</p>
          </div>

          {/* Sales Management */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-green-600 text-4xl mb-4">🛒</div>
            <h3 className="font-semibold text-lg mb-2">Sales Management</h3>
            <p className="text-gray-600 text-sm">Orders, invoices, returns & payments</p>
          </div>

          {/* Product Management */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-purple-600 text-4xl mb-4">📦</div>
            <h3 className="font-semibold text-lg mb-2">Product Management</h3>
            <p className="text-gray-600 text-sm">Inventory, categories, units & stock</p>
          </div>

          {/* Customer Management */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-pink-600 text-4xl mb-4">👥</div>
            <h3 className="font-semibold text-lg mb-2">Customer Management</h3>
            <p className="text-gray-600 text-sm">CRM, contacts & location tracking</p>
          </div>

          {/* Supplier Management */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-orange-600 text-4xl mb-4">🏢</div>
            <h3 className="font-semibold text-lg mb-2">Supplier Management</h3>
            <p className="text-gray-600 text-sm">Vendor relationships & purchases</p>
          </div>

          {/* Purchase Management */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-teal-600 text-4xl mb-4">🛍️</div>
            <h3 className="font-semibold text-lg mb-2">Purchase Management</h3>
            <p className="text-gray-600 text-sm">Purchase orders, returns & invoices</p>
          </div>

          {/* Accounting */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-indigo-600 text-4xl mb-4">💰</div>
            <h3 className="font-semibold text-lg mb-2">Accounting</h3>
            <p className="text-gray-600 text-sm">Financial reports, ledger & transactions</p>
          </div>

          {/* HR & Payroll */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-red-600 text-4xl mb-4">👔</div>
            <h3 className="font-semibold text-lg mb-2">HR & Payroll</h3>
            <p className="text-gray-600 text-sm">Staff, attendance & salary management</p>
          </div>

          {/* Production */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-amber-600 text-4xl mb-4">🏭</div>
            <h3 className="font-semibold text-lg mb-2">Production</h3>
            <p className="text-gray-600 text-sm">Manufacturing & bill of materials</p>
          </div>

          {/* Raw Materials */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-lime-600 text-4xl mb-4">🧱</div>
            <h3 className="font-semibold text-lg mb-2">Raw Materials</h3>
            <p className="text-gray-600 text-sm">Material tracking & procurement</p>
          </div>

          {/* Reports */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-cyan-600 text-4xl mb-4">📈</div>
            <h3 className="font-semibold text-lg mb-2">Reports</h3>
            <p className="text-gray-600 text-sm">Sales, inventory & financial analytics</p>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-gray-600 text-4xl mb-4">⚙️</div>
            <h3 className="font-semibold text-lg mb-2">Settings</h3>
            <p className="text-gray-600 text-sm">System configuration & preferences</p>
          </div>

          {/* Authentication */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-violet-600 text-4xl mb-4">🔐</div>
            <h3 className="font-semibold text-lg mb-2">Authentication</h3>
            <p className="text-gray-600 text-sm">Secure login & access control</p>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-fuchsia-600 text-4xl mb-4">👤</div>
            <h3 className="font-semibold text-lg mb-2">User Management</h3>
            <p className="text-gray-600 text-sm">System users & administration</p>
          </div>

          {/* Role Management */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-rose-600 text-4xl mb-4">🛡️</div>
            <h3 className="font-semibold text-lg mb-2">Role Management</h3>
            <p className="text-gray-600 text-sm">Permissions & access rights</p>
          </div>

          {/* Department Management */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-emerald-600 text-4xl mb-4">🏛️</div>
            <h3 className="font-semibold text-lg mb-2">Department Management</h3>
            <p className="text-gray-600 text-sm">Organization structure</p>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-sky-600 text-4xl mb-4">📁</div>
            <h3 className="font-semibold text-lg mb-2">File Upload</h3>
            <p className="text-gray-600 text-sm">Document & media management</p>
          </div>

          {/* Data Management */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-slate-600 text-4xl mb-4">💾</div>
            <h3 className="font-semibold text-lg mb-2">Data Management</h3>
            <p className="text-gray-600 text-sm">Backup, restore & export</p>
          </div>

          {/* Attendance Tracking */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-yellow-600 text-4xl mb-4">⏰</div>
            <h3 className="font-semibold text-lg mb-2">Attendance Tracking</h3>
            <p className="text-gray-600 text-sm">Check-in/out & location monitoring</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center px-6 gap-3">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-1">
              &copy; {new Date().getFullYear()} {settings?.data?.company_name || 'ERP'}. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
              Developed by{" "}
              <a
                href="https://inleadsit.com.my/"
                className="hover:text-gray-800 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Inleads IT
              </a>
            </div>
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="text-gray-500 hover:text-gray-800 text-sm">Privacy</a>
            <a href="/terms" className="text-gray-500 hover:text-gray-800 text-sm">Terms</a>
            <a href="/contact" className="text-gray-500 hover:text-gray-800 text-sm">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default APP;
