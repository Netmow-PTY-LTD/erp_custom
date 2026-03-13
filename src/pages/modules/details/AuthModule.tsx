import { Link } from "react-router";

const AuthModule = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">🔐</div>
            <div>
              <h1 className="text-4xl font-bold text-indigo-600">Auth Module</h1>
              <p className="text-gray-600 text-lg">Authentication & Authorization</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/modules-functionality"
            className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-300"
          >
            ← Back to Modules
          </Link>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-700">
              The Auth Module handles all authentication and authorization operations within the ERP system.
              It provides secure login, logout, token management, and permission verification.
            </p>
          </div>

          {/* Key Features */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>User authentication with JWT tokens</li>
              <li>Role-based access control (RBAC)</li>
              <li>Permission verification</li>
              <li>Session management</li>
              <li>Password encryption</li>
            </ul>
          </div>

          {/* API Endpoints */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">API Endpoints</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Endpoint</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Auth Required</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4"><span className="bg-green-500 text-white px-2 py-1 rounded text-sm">POST</span></td>
                    <td className="py-3 px-4 font-mono text-sm">/auth/login</td>
                    <td className="py-3 px-4">User login</td>
                    <td className="py-3 px-4">No</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4"><span className="bg-green-500 text-white px-2 py-1 rounded text-sm">POST</span></td>
                    <td className="py-3 px-4 font-mono text-sm">/auth/logout</td>
                    <td className="py-3 px-4">User logout</td>
                    <td className="py-3 px-4">Yes</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4"><span className="bg-green-500 text-white px-2 py-1 rounded text-sm">POST</span></td>
                    <td className="py-3 px-4 font-mono text-sm">/auth/register</td>
                    <td className="py-3 px-4">User registration</td>
                    <td className="py-3 px-4">No</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4"><span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">GET</span></td>
                    <td className="py-3 px-4 font-mono text-sm">/auth/me</td>
                    <td className="py-3 px-4">Get current user</td>
                    <td className="py-3 px-4">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Frontend Routes */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frontend Routes</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">/login</span>
                <span>Login page</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">/register</span>
                <span>Registration page</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">/forgot-password</span>
                <span>Password recovery</span>
              </li>
            </ul>
          </div>

          {/* Database Models */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Models</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">User</span>
                <span>User accounts</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">Role</span>
                <span>User roles</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">Permission</span>
                <span>Access permissions</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white text-sm">
            © {new Date().getFullYear()} ERP System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModule;
