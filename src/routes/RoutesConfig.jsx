import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import LoginPage from "../modules/login/LoginPage";
import NotFoundPage from "../modules/notFoundPage/NotFoundPage";
import AlumnoPage from "../modules/alumno/alumno";

const Home = () => <h1 className="text-center mt-10 text-2xl">Bienvenido a TutorHub</h1>;

export const RoutesConfig = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
      <Route path="/alumno" element={user ? <AlumnoPage /> : <Navigate to="/" />} />
      <Route path="*" element={<NotFoundPage />} />
       
    </Routes>
  );
};
