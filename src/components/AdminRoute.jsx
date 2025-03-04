import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import SkeletonLoader from "./Skeleton";

const AUTH_URL = process.env.NODE_ENV === "development" 
? "http://localhost:7687/api/auth" 
: "https://backend-hr3.jjm-manufacturing.com/api/auth";

const AdminRoute = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${AUTH_URL}/check-auth`, { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(false));
  }, []);

  if (user === null) return <SkeletonLoader />;

  return user && user.role === "Admin" ? (
    <Outlet context={{ user }} />
  ) : (
    <Navigate to="/" />
  );
};

export default AdminRoute;
