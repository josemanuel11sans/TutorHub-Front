import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import LoginPage from "../modules/login/LoginPage";
import EspaciosTutorPage from "../modules/coordinador/GestionCoordinador";
import NotFoundPage from "../modules/notFoundPage/NotFoundPage";
import AlumnoPage from "../modules/alumno/Alumno";

const Home = () => <h1 className="text-center mt-10 text-2xl">Bienvenido a TutorHub</h1>;

export const RoutesConfig = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
      <Route path="/alumno" element={user ? <AlumnoPage /> : <Navigate to="/" />} />
      <Route path="/coordinador/gestion" element={user ? <EspaciosTutorPage /> : <Navigate to="/" />} />
      <Route path="*" element={<NotFoundPage />} />
       
    </Routes>
  );
};
