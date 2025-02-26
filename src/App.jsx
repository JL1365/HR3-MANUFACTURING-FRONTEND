import { Routes, Route, useOutletContext } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminSidebar from "./components/AdminSidebar";
import EmployeeSidebar from "./components/EmployeeSidebar";

import Login from "./public/Login";
import NotFound from "./components/NotFound";
import AdminDashboard from "./private/admin/AdminDashboard";
import EmployeeDashboard from "./private/employee/EmployeeDashboard";

/* ADMIN SIDE */
import BenefitsManagement from "./private/admin/benefit/BenefitsManagement";
import BenefitRequested from "./private/admin/benefit/BenefitRequested";
import DeductionManagement from "./private/admin/benefit/DeductionManagement";

import IncentivesManagement from "./private/admin/incentive/IncentivesManagement";
import IncentiveTracking from "./private/admin/incentive/IncentiveTracking";
import SalesCommission from "./private/admin/incentive/SalesCommission";
import RecognitionPrograms from "./private/admin/incentive/RecognitionPrograms";

/* EMPLOYEE SIDE */
import BenefitOverview from "./private/employee/eBenefit/BenefitOverview";
import ApplyBenefit from "./private/employee/eBenefit/ApplyBenefitRequest";
import MyDeductions from "./private/employee/eBenefit/MyDeductions";

import IncentivesOverview from "./private/employee/eIncentive/IncentivesOverview";
import MyIncentivesTracking from "./private/employee/eIncentive/MyIncentiveTracking";
import Profile from "./components/Profile";
import MySalesCommission from "./private/employee/eIncentive/MySalesCommission";
import MyRecognitionPrograms from "./private/employee/eIncentive/MyRecognitionPrograms";

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
        {/* <Route  path="*" element={<NotFound/>}/> */}
      </Route>

      <Route element={<ProtectedRoute allowedHr={[3]} />}>
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
        path="/profile"
        element={
          <LayoutWithSidebar>
            <Profile />
          </LayoutWithSidebar>
        }
      />
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
        {/* Incentives */}
        <Route
          path="/incentives-management"
          element={
            <LayoutWithSidebar>
              <IncentivesManagement />
            </LayoutWithSidebar>
          }
        />
        <Route
          path="/incentive-tracking"
          element={
            <LayoutWithSidebar>
              <IncentiveTracking />
            </LayoutWithSidebar>
          }
        />

          <Route
          path="/sales-commission"
          element={
            <LayoutWithSidebar>
              <SalesCommission />
            </LayoutWithSidebar>
          }
        />

          <Route
          path="/recognition-programs"
          element={
            <LayoutWithSidebar>
              <RecognitionPrograms />
            </LayoutWithSidebar>
          }
        />
        {/* EMPLOYEE SIDE */}
        <Route
        path="/profile"
        element={
          <LayoutWithSidebar>
            <Profile />
          </LayoutWithSidebar>
        }
      />
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
        {/* Incentives */}
        <Route
          path="/incentives-overview"
          element={
            <LayoutWithSidebar>
              <IncentivesOverview />
            </LayoutWithSidebar>
          }
        />

        <Route
          path="/my-incentives-tracking"
          element={
            <LayoutWithSidebar>
              <MyIncentivesTracking />
            </LayoutWithSidebar>
          }
        />

        <Route
          path="/my-sales-commission"
          element={
            <LayoutWithSidebar>
              <MySalesCommission />
            </LayoutWithSidebar>
          }
        />
        <Route
          path="/my-recognition-programs"
          element={
            <LayoutWithSidebar>
              <MyRecognitionPrograms />
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
