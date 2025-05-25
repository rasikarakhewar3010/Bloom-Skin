import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-200 flex flex-col items-center justify-center text-center px-6 py-20">
      <h1 className="text-6xl font-extrabold text-pink-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-pink-500 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
