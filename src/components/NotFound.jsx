import React from 'react';

function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="mt-4 text-xl text-gray-600">Oops! Page not found.</p>
        <div className="mt-6">
          <button
            className="btn btn-primary"
            onClick={() => window.location.href = '/'}
          >
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
