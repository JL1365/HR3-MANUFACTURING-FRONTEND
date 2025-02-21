import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import SkeletonLoader from "./Skeleton";

const PublicRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    setTimeout(() => {
    axios.get("http://localhost:7687/api/auth/check-auth", { withCredentials: true })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
    }, 3000);
  }, []);

  if (isAuthenticated === null) return <SkeletonLoader />;

  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
