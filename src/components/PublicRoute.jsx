import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import SkeletonLoader from "./Skeleton";

const AUTH_URL = process.env.NODE_ENV === "development" 
? "http://localhost:7687/api/auth" 
: "https://backend-hr3.jjm-manufacturing.com/api/auth";

const PublicRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    setTimeout(() => {
    axios.get(`${AUTH_URL}/check-auth`, { withCredentials: true })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
    }, 2000);
  }, []);

  if (isAuthenticated === null) return <SkeletonLoader />;

  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
