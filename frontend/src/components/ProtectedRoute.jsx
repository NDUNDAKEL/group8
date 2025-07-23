import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "@clerk/clerk-react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const { isSignedIn } = useUser(); // ✅ correct way to check Clerk login

  const roleRedirects = {
    tm: "/admin/dashboard",
    admin: "/admin/dashboard",
    student: "/student/dashboard",
    clerk: "/landing", // just in case
  };

  // ✅ Clerk user logged in but not in your backend
  if (isSignedIn && !isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  // Not logged in (neither via Clerk nor backend)?
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check roles (optional)
  if (allowedRoles?.length > 0) {
    if (!allowedRoles.includes(user?.role)) {
      const redirectPath = roleRedirects[user?.role] || "/";
      return <Navigate to={redirectPath} replace />;
    }
  }

  // ✅ Access granted
  return <>{children}</>;
};

export default ProtectedRoute;
