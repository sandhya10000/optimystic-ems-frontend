import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import ProtectedRoute from "./ProtectedRoute";

// --------------------------------------------------
// LAYOUTS
// --------------------------------------------------

const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const EmployeeLayout = lazy(() => import("../layouts/EmployeeLayout"));
const PublicLayout = lazy(() => import("../layouts/PublicLayout"));

// --------------------------------------------------
// AUTH & PUBLIC PAGES
// --------------------------------------------------

const Login = lazy(() => import("../pages/auth/Login"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const Home = lazy(() => import("../pages/Home"));

// --------------------------------------------------
// EMPLOYEE PAGES
// --------------------------------------------------

const EmployeeDashboard = lazy(
  () => import("../pages/employee/EmployeeDashboard"),
);
const Attendance = lazy(
  () => import("../pages/employee/attendance/Attendance"),
);

const Asset = lazy(() => import("../pages/employee/assets/Asset"));

const Kyc = lazy(() => import("../pages/employee/kyc/PanVerification"));

const Payroll = lazy(() => import("../pages/employee/payroll/Payroll"));
const MyProfile = lazy(() => import("../pages/employee/MyProfile"));
const PanVerification = lazy(
  () => import("../pages/employee/kyc/PanVerification"),
);
const DigilockerKyc = lazy(() => import("../pages/employee/kyc/DigilockerKyc"));

// --------------------------------------------------
// ADMIN PAGES
// --------------------------------------------------

const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));

const EmployeeProfile = lazy(() => import("../pages/admin/EmployeeProfile"));
const SalarySlipManagement = lazy(
  () => import("../pages/admin/SalarySlipManagement"),
);
const AssetManagement = lazy(() => import("../pages/admin/AssetManagement"));
const AttendanceManagement = lazy(
  () => import("../pages/admin/AttendanceManagement"),
);

// --------------------------------------------------
// PAGE LOADER
// --------------------------------------------------

const PageLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
        width: "100%",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

// --------------------------------------------------
// APP ROUTES
// --------------------------------------------------

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ----------------------------------------
            PUBLIC ROUTES
        ---------------------------------------- */}

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/attendance" element={<Attendance />} />

          <Route path="/assets" element={<AssetManagement />} />

          <Route path="/kyc" element={<Kyc />} />

          <Route path="/payslips" element={<Payroll />} />
        </Route>

        {/* ----------------------------------------
            PROTECTED ROUTES
        ---------------------------------------- */}

        <Route element={<ProtectedRoute />}>
          {/* ADMIN ROUTES */}

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            <Route path="employee-profile" element={<EmployeeProfile />} />
            <Route path="salary-slips" element={<SalarySlipManagement />} />
            <Route path="assets" element={<AssetManagement />} />
            <Route path="attendance" element={<AttendanceManagement />} />
          </Route>

          {/* EMPLOYEE ROUTES */}

          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<EmployeeDashboard />} />

            <Route path="profile" element={<MyProfile />} />

            <Route path="attendance" element={<Attendance />} />

            <Route path="assets" element={<Asset />} />

            <Route path="payslips" element={<Payroll />} />

            <Route path="kyc">
              <Route path="pan-verification" element={<PanVerification />} />

              <Route path="aadhaar-verification" element={<DigilockerKyc />} />
            </Route>
          </Route>
        </Route>

        {/* ----------------------------------------
            404 PAGE
        ---------------------------------------- */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
