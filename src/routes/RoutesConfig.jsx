import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
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
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/alumno" element={<AlumnoPage />} />
      <Route path="/coordinador/gestion" element={<EspaciosTutorPage />} />
      <Route path="/tutor" element={<TutorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
