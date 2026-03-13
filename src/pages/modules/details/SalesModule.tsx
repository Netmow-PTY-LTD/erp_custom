import { Link } from "react-router";

const SalesModule = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">🛒</div>
            <div>
              <h1 className="text-4xl font-bold text-pink-600">Sales Module</h1>
              <p className="text-gray-600 text-lg">Orders, Invoices & Deliveries</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Link
            to="/modules-functionality"
            className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-300"
          >
            ← Back to Modules
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-700">
              The Sales Module manages all sales-related operations including orders, invoices, deliveries, and returns.
              It provides comprehensive tracking of sales transactions and customer interactions.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Sales order management</li>
              <li>Invoice generation</li>
              <li>Delivery tracking</li>
              <li>Return order processing</li>
              <li>Customer order history</li>
              <li>Payment tracking</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500 lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frontend Routes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/dashboard/sales-orders" className="flex items-center gap-2 text-indigo-600 hover:underline">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">/dashboard/sales-orders</span>
                <span>Sales Orders</span>
              </Link>
              <Link to="/dashboard/sales-invoices" className="flex items-center gap-2 text-indigo-600 hover:underline">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">/dashboard/sales-invoices</span>
                <span>Sales Invoices</span>
              </Link>
              <Link to="/dashboard/deliveries" className="flex items-center gap-2 text-indigo-600 hover:underline">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">/dashboard/deliveries</span>
                <span>Deliveries</span>
              </Link>
              <Link to="/dashboard/sales-returns" className="flex items-center gap-2 text-indigo-600 hover:underline">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">/dashboard/sales-returns</span>
                <span>Sales Returns</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Models</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">SalesOrder</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">SalesInvoice</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">Delivery</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">SalesReturn</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">API Documentation</h2>
            <a
              href="http://localhost:5000/module-docs/sales"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View API Docs →
            </a>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-white text-sm">
            © {new Date().getFullYear()} ERP System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesModule;
