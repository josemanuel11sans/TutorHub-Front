import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRoles }) => {
  if (!user) return <Navigate to="/" replace />; // No logueado

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />; // Rol no permitido
  }

  return <Outlet />; // Usuario autorizado
};

export default ProtectedRoute;
