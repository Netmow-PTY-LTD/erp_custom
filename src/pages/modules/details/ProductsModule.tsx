import { Link } from "react-router";

const ProductsModule = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">📦</div>
            <div>
              <h1 className="text-4xl font-bold text-green-600">Products Module</h1>
              <p className="text-gray-600 text-lg">Inventory & Catalog</p>
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
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-700">
              The Products Module manages the complete product inventory including finished goods, raw materials,
              and production items. It provides comprehensive tracking of stock levels, pricing, and product details.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Product catalog management</li>
              <li>Inventory tracking</li>
              <li>Stock level alerts</li>
              <li>Price management</li>
              <li>Product categories</li>
              <li>Barcode/QR code support</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frontend Routes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/dashboard/products" className="flex items-center gap-2 text-indigo-600 hover:underline">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">/dashboard/products</span>
                <span>Products List</span>
              </Link>
              <Link to="/dashboard/raw-materials" className="flex items-center gap-2 text-indigo-600 hover:underline">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">/dashboard/raw-materials</span>
                <span>Raw Materials</span>
              </Link>
              <Link to="/dashboard/production" className="flex items-center gap-2 text-indigo-600 hover:underline">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">/dashboard/production</span>
                <span>Production</span>
              </Link>
              <Link to="/dashboard/units" className="flex items-center gap-2 text-indigo-600 hover:underline">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">/dashboard/units</span>
                <span>Units</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Models</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">Product</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">RawMaterial</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">Category</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">Unit</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">API Documentation</h2>
            <a
              href="http://localhost:5000/module-docs/products"
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

export default ProductsModule;
