import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import LoginPage from "../modules/login/LoginPage";
import EspaciosTutorPage from "../modules/coordinador/GestionCoordinador";
import NotFoundPage from "../modules/notFoundPage/NotFoundPage";
import AlumnoPage from "../modules/alumno/Alumno";
import TutorPage from "../modules/tutor/tutor";

const Home = () => (
  <h1 className="text-center mt-10 text-2xl">Bienvenido a TutorHub</h1>
);

export const RoutesConfig = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to={getRoleRoute(user.rol)} replace /> : <LoginPage />} 
      />

      <Route
        path="/home"
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

// Usar roles en INGLÉS
const getRoleRoute = (rol) => {
  const routes = {
    student: "/alumno",
    tutor: "/tutor",
    coordinator: "/coordinador",
    admin: "/admin",
  };
  return routes[rol] || "/";
};