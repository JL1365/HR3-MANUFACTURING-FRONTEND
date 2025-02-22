import { Routes, Route, useOutletContext } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminSidebar from "./components/AdminSidebar";
import EmployeeSidebar from "./components/EmployeeSidebar";

import Login from "./public/Login";
import AdminDashboard from "./private/admin/AdminDashboard";
import EmployeeDashboard from "./private/employee/EmployeeDashboard";

/* ADMIN SIDE */
import BenefitsManagement from "./private/admin/benefit/BenefitsManagement";
import BenefitRequested from "./private/admin/benefit/BenefitRequested";
import DeductionManagement from "./private/admin/benefit/DeductionManagement";

/* EMPLOYEE SIDE */
import BenefitOverview from "./private/employee/BenefitOverview";
import ApplyBenefit from "./private/employee/ApplyBenefitRequest";
import MyDeductions from "./private/employee/MyDeductions";

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <LayoutWithSidebar>
              <DashboardContent />
            </LayoutWithSidebar>
          }
        />
        {/* ADMIN SIDE */}
        <Route
          path="/benefits-management"
          element={
            <LayoutWithSidebar>
              <BenefitsManagement />
            </LayoutWithSidebar>
          }
        />
          <Route
          path="/applied-request"
          element={
            <LayoutWithSidebar>
              <BenefitRequested />
            </LayoutWithSidebar>
          }
        />
          <Route
          path="/deduction-management"
          element={
            <LayoutWithSidebar>
              <DeductionManagement />
            </LayoutWithSidebar>
          }
        />

        {/* EMPLOYEE SIDE */}
          <Route
          path="/benefits-overview"
          element={
            <LayoutWithSidebar>
              <BenefitOverview />
            </LayoutWithSidebar>
          }
        />
          <Route
          path="/apply-benefit"
          element={
            <LayoutWithSidebar>
              <ApplyBenefit />
            </LayoutWithSidebar>
          }
        />
          <Route
          path="/my-deductions"
          element={
            <LayoutWithSidebar>
              <MyDeductions />
            </LayoutWithSidebar>
          }
        />

      </Route>
    </Routes>
  );
}

function DashboardContent() {
  const { user } = useOutletContext();
  return user.role === "Admin" ? <AdminDashboard /> : <EmployeeDashboard />;
}

function LayoutWithSidebar({ children }) {
  const { user } = useOutletContext();

  return (
    <div className="flex">
      {user.role === "Admin" ? <AdminSidebar /> : <EmployeeSidebar />}
      <div className="flex-1 transition-all duration-300 p-6 bg-gray-100 min-h-screen">
        {children}
      </div>
    </div>
  );
}

export default App;
