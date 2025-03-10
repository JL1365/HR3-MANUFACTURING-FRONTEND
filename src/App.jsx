import { Routes, Route, useOutletContext } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminSidebar from "./components/AdminSidebar";
import EmployeeSidebar from "./components/EmployeeSidebar";

import Login from "./public/Login";
import NotFound from "./components/NotFound";
import AdminDashboard from "./private/admin/AdminDashboard";
import EmployeeDashboard from "./private/employee/EmployeeDashboard";
import AdminRoute from "./components/AdminRoute";
import EmployeeRoute from "./components/EmployeeRoute";

/* ADMIN SIDE */
import BenefitsManagement from "./private/admin/benefit/BenefitsManagement";
import BenefitRequested from "./private/admin/benefit/BenefitRequested";
import DeductionManagement from "./private/admin/benefit/DeductionManagement";

import IncentivesManagement from "./private/admin/incentive/IncentivesManagement";
import IncentiveTracking from "./private/admin/incentive/IncentiveTracking";
import RecognitionPrograms from "./private/admin/incentive/RecognitionPrograms";
import CompensationPlanning from "./private/admin/compensation/CompensationPlanning";

import BudgetRequestForm from "./private/admin/payroll/BudgetRequest";

/* EMPLOYEE SIDE */
import BenefitOverview from "./private/employee/eBenefit/BenefitOverview";
import ApplyBenefit from "./private/employee/eBenefit/ApplyBenefitRequest";
import MyDeductions from "./private/employee/eBenefit/MyDeductions";
import PenaltyLevel from "./private/admin/compensation/PenaltyLevel";

import IncentivesOverview from "./private/employee/eIncentive/IncentivesOverview";
import MyIncentivesTracking from "./private/employee/eIncentive/MyIncentiveTracking";
import Profile from "./components/Profile";
import MyRecognitionPrograms from "./private/employee/eIncentive/MyRecognitionPrograms";

import CompensationOverview from "./private/employee/ecompensation/CompensationOverview";
import PenaltyOverview from "./private/employee/ecompensation/PenaltiesOverview";

import RequestSalaryDistribution from "./private/employee/epayroll/RequestSalaryDistribution";
import EmployeeSalaryDistributionRequests from "./private/admin/payroll/EmployeeSalaryDistributionRequests";
import EmployeeBenefitDetails from "./private/admin/benefit/EmployeeBenefitsDetails";
import SendDocuments from "./private/admin/benefit/SendDocuments";
import PayrollOverview from "./private/admin/payroll/PayrollOverview";
import Grievance from "./private/admin/compensation/Grievance";
import SalaryComputation from "./private/admin/payroll/SalaryComputation";
import BehavioralAnalytics from "./private/admin/analytics/BehaviouralAnalytics";
import SalaryPredictions from "./components/SalaryPredictions";

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
        <Route  path="*" element={<NotFound/>}/>
      </Route>

      <Route element={<ProtectedRoute allowedHr={[1,2,3,4]} />}>
        <Route
          path="/dashboard"
          element={
            <LayoutWithSidebar>
              <DashboardContent />
            </LayoutWithSidebar>
          }
        />
        {/* ADMIN SIDE */}
        <Route element={<AdminRoute/>}>
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
          <Route
          path="/employee-benefit-details"
          element={
            <LayoutWithSidebar>
              <EmployeeBenefitDetails />
            </LayoutWithSidebar>
          }
        />
          <Route
          path="/send-documents"
          element={
            <LayoutWithSidebar>
              <SendDocuments />
            </LayoutWithSidebar>
          }
        />
        {/* Incentives */}
        <Route
          path="/incentives-overview"
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

          {/* <Route
          path="/sales-commission"
          element={
            <LayoutWithSidebar>
              <SalesCommission />
            </LayoutWithSidebar>
          }
        /> */}

          <Route
          path="/recognition-programs"
          element={
            <LayoutWithSidebar>
              <RecognitionPrograms />
            </LayoutWithSidebar>
          }
        />

          <Route
          path="/compensation-overview"
          element={
            <LayoutWithSidebar>
              <CompensationPlanning />
            </LayoutWithSidebar>
          }
        />
                <Route
          path="/grievance"
          element={
            <LayoutWithSidebar>
              <Grievance />
            </LayoutWithSidebar>
          }
        />
          <Route
          path="/penalty-level"
          element={
            <LayoutWithSidebar>
              <PenaltyLevel />
            </LayoutWithSidebar>
          }
        />
        {/* PAYROLL */}
        <Route
          path="/payroll-overview"
          element={
            <LayoutWithSidebar>
              <PayrollOverview/>
            </LayoutWithSidebar>
          }
        />

        <Route
          path="/salary-computation"
          element={
            <LayoutWithSidebar>
              <SalaryComputation/>
            </LayoutWithSidebar>
          }
        />

          <Route
          path="/request-budget"
          element={
            <LayoutWithSidebar>
              <BudgetRequestForm />
            </LayoutWithSidebar>
          }
        />
          <Route
          path="/employee-salary-distribution-requests"
          element={
            <LayoutWithSidebar>
              <EmployeeSalaryDistributionRequests />
            </LayoutWithSidebar>
          }
        />

          <Route
          path="/behavioural-analytics"
          element={
            <LayoutWithSidebar>
              <BehavioralAnalytics />
            </LayoutWithSidebar>
          }
        />
          <Route
          path="/salary-predictions"
          element={
            <LayoutWithSidebar>
              <SalaryPredictions />
            </LayoutWithSidebar>
          }
        />

        </Route>
        {/* EMPLOYEE SIDE */}
        <Route element={<EmployeeRoute/>}>
     
        <Route
        path="/profile"
        element={
          <LayoutWithSidebar>
            <Profile />
          </LayoutWithSidebar>
        }
      />
          <Route
          path="/e-benefits-overview"
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
          path="/e-incentives-overview"
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
{/* 
        <Route
          path="/my-sales-commission"
          element={
            <LayoutWithSidebar>
              <MySalesCommission />
            </LayoutWithSidebar>
          }
        /> */}
        <Route
          path="/my-recognition-programs"
          element={
            <LayoutWithSidebar>
              <MyRecognitionPrograms />
            </LayoutWithSidebar>
          }
        />
        {/* Compensation Overview */}
        <Route
          path="/e-compensation-overview"
          element={
            <LayoutWithSidebar>
              <CompensationOverview />
            </LayoutWithSidebar>
          }
        />

        <Route
          path="/penalties-overview"
          element={
            <LayoutWithSidebar>
              <PenaltyOverview />
            </LayoutWithSidebar>
          }
        />
        {/* SALARY */}
        <Route
          path="/my-salary-distribution-requests"
          element={
            <LayoutWithSidebar>
              <RequestSalaryDistribution />
            </LayoutWithSidebar>
          }
        />
      </Route>
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
