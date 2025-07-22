import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  const roleRedirects = {
    tm: "/admin/dashboard",
    admin: "/admin/dashboard",
    student: "/student/dashboard",
  };

  // Not logged in? Force login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Only do role checking if allowedRoles is explicitly provided
  if (allowedRoles?.length > 0) {
    if (!allowedRoles.includes(user?.role)) {
      const redirectPath = roleRedirects[user?.role] || "/";
      return <Navigate to={redirectPath} replace />;
    }
  }

  // Otherwise, just allow access (e.g., for `/home`)
  return <>{children}</>;
};

export default ProtectedRoute;
