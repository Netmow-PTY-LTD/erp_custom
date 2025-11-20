import { Outlet } from "react-router";


const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-xl font-bold border-b">ERP Dashboard</div>
        <nav className="p-4 space-y-2">
          <a href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-200">Dashboard</a>
          <a href="/products" className="block px-4 py-2 rounded hover:bg-gray-200">Products</a>
          <a href="/customers" className="block px-4 py-2 rounded hover:bg-gray-200">Customers</a>
          <a href="/orders" className="block px-4 py-2 rounded hover:bg-gray-200">Orders</a>
          <a href="/accounting" className="block px-4 py-2 rounded hover:bg-gray-200">Accounting</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-end items-center bg-white shadow px-6 h-16">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold">
              U
            </div>
            <button className="text-gray-600 hover:text-gray-900">
              🔔
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white p-6 rounded shadow max-w-7xl mx-auto min-h-[60vh]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
