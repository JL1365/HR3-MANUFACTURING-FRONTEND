const SkeletonLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 text-lg font-semibold">Redirecting...</p>
    </div>
  );
};

export default SkeletonLoader;
