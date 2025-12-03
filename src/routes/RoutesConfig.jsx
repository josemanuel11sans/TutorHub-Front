import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "../modules/login/LoginPage";
import EspaciosTutorPage from "../modules/coordinador/GestionCoordinador";
import NotFoundPage from "../modules/notFoundPage/NotFoundPage";
import AlumnoPage from "../modules/alumno/Alumno";
import TutorPage from "../modules/tutor/tutor";

const Home = () => (
  <h1 className="text-center mt-10 text-2xl">Bienvenido a TutorHub</h1>
);

// Componente que redirige a usuarios logueados
const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user) {
    const roleRoutes = {
      student: "/alumno",
      tutor: "/tutor",
      coordinator: "/coordinador",
      admin: "/admin",
    };
    const redirectTo = roleRoutes[user.rol] || "/";
    console.log("🔓 Usuario ya logueado, redirigiendo a:", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export const RoutesConfig = () => {
  return (
    <Routes>
      {/* Ruta raíz - redirige a dashboard si ya está logueado */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Ruta home solo para usuarios logueados */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["student", "tutor", "coordinator", "admin"]}>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/alumno"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <AlumnoPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tutor"
        element={
          <ProtectedRoute allowedRoles={["tutor"]}>
            <TutorPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/coordinador"
        element={
          <ProtectedRoute allowedRoles={["coordinator"]}>
            <EspaciosTutorPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <div>Panel de Administrador</div>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};