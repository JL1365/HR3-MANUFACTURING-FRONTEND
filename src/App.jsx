import { Routes, Route, useOutletContext } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminSidebar from "./components/AdminSidebar";
import EmployeeSidebar from "./components/EmployeeSidebar";

import Login from "./public/Login";

import AdminDashboard from "./private/admin/AdminDashboard";
import EmployeeDashboard from "./private/employee/EmployeeDashboard";

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardWithSidebar />} />
      </Route>
    </Routes>
  );
}

function DashboardWithSidebar() {
  const { user } = useOutletContext();

  return (
    <div className="flex">
      {user.role === "Admin" ? <AdminSidebar /> : <EmployeeSidebar />}
      <div className="flex-1 transition-all duration-300 p-6 bg-gray-100 min-h-screen">
        {user.role === "Admin" ? <AdminDashboard /> : <EmployeeDashboard />}
      </div>
    </div>
  );
}

export default App;
