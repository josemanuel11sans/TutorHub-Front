import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { handleLogin, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async ({ email, password }) => {
    const usuario = await handleLogin(email, password);
    if (usuario) {
      toast.success("¡Login exitoso!");
      // Redirigir según rol normalizado (mapeado en AuthContext)
      if (usuario?.rol === "coordinador") {
        navigate("/coordinador/gestion");
      } else if (usuario?.rol === "alumno") {
        navigate("/alumno");
      } else if (usuario?.rol === "tutor") {
        navigate("/tutor");
      } else {
        navigate("/home");
      }
    } else {
      toast.error(error);
    }
  };

  return <LoginForm onSubmit={onSubmit} loading={loading} error={error} />;
};

export default LoginPage;
