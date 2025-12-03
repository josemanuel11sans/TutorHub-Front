import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useContext(AuthContext);

  console.log("🔒 ProtectedRoute - Usuario:", user);
  console.log("🔒 ProtectedRoute - Rol del usuario:", user?.rol);
  console.log("🔒 ProtectedRoute - Roles permitidos:", allowedRoles);

  if (!user) {
    console.log("🔒 No hay usuario, redirigiendo a /");
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.rol)) {
    console.log(`🔒 Rol ${user.rol} no permitido. Redirigiendo...`);
    
    const roleRoutes = {
      student: "/alumno",
      tutor: "/tutor",
      coordinator: "/coordinador",
      admin: "/admin",
    };

    const redirectTo = roleRoutes[user.rol] || "/";
    console.log(`🔒 Redirigiendo a: ${redirectTo}`);
    return <Navigate to={redirectTo} replace />;
  }

  console.log("🔒 Acceso permitido");
  return children;
};