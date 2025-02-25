import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import SkeletonLoader from "./Skeleton";

const ProtectedRoute = ({ allowedHr }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:7687/api/auth/check-auth", { withCredentials: true })
      .then((res) => setUser(res.data.user)) 
      .catch(() => setUser(false));
  }, []);

  if (user === null) return <SkeletonLoader />;

  return user && allowedHr.includes(user.Hr) ? (
    <Outlet context={{ user }} />
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
