import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const location = useLocation();

  // Login required
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Only employees can access employee routes
  if (
    location.pathname.startsWith("/employee") &&
    user.role?.toLowerCase() !== "employee"
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Only admin roles can access admin routes
  const adminRoles = ["super_admin", "hr_admin", "finance_payroll", "manager"];

  if (
    location.pathname.startsWith("/admin") &&
    !adminRoles.includes(user.role?.toLowerCase())
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
