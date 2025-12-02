import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.rol)) {
    const roleRoutes = {
      student: "/alumno",
      tutor: "/tutor",
      coordinator: "/coordinador",
      admin: "/admin",
    };

    const redirectTo = roleRoutes[user.rol] || "/";
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};