import React, { useContext} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// aqui van todas las importaciones
import LoginPage from "../modules/login/LoginPage";
import NotFoundPage from "../modules/notFoundPage/NotFoundPage";
import ProtectedRoute from "../context/ProtectedRoute";
const Home = () => <h1>Home</h1>;

export const RoutesConfig = () => {
  const { user } = useContext(AuthContext);
  // console.log(user)
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/home" />} />

      {/* Rutas privadas por rol */}
      <Route element={<ProtectedRoute user={user} allowedRoles={['admin', 'manager']} />}>
        <Route path="/home" element={<Home />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Route>

      <Route element={<ProtectedRoute user={user} allowedRoles={['user']} />}>
        {/* <Route path="/perfil" element={<Perfil />} /> */}
      </Route>

      {/* Rutas 404 y no autorizadas */}
      <Route path="/unauthorized" element={<h1>403 - No autorizado</h1>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};