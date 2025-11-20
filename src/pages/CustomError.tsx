import { Link } from "react-router";


const CustomError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
      <p className="text-gray-700 mb-6 text-center">
        Sorry, you are not authorized to access this page.
      </p>
      <Link to="/">
        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Back Home
        </button>
      </Link>
    </div>
  );
};

export default CustomError;
