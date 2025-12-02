import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

const LoginPage = () => {
  const { handleLogin, loading, error } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async ({ email, password }) => {
    console.log("🔐 Intentando login con:", email);
    const usuario = await handleLogin(email, password);

    console.log("👤 Usuario devuelto por handleLogin:", usuario);
    console.log("👤 Rol del usuario:", usuario?.rol);

    if (usuario) {
      showToast("¡Login exitoso!", "success");

      console.log("🚀 Redirigiendo según rol:", usuario.rol);

      if (usuario?.rol === "coordinator") {
        console.log("Navegando a /coordinador");
        navigate("/coordinador");
      }
      else if (usuario?.rol === "student") {
        console.log("Navegando a /alumno");
        navigate("/alumno");
      }
      else if (usuario?.rol === "tutor") {
        console.log("Navegando a /tutor");
        navigate("/tutor");
      }
      else {
        console.log("Navegando a /home (rol no reconocido)");
        navigate("/home");
      }
    } else {
      const mensaje = error || "Credenciales incorrectas";
      showToast(mensaje, "error");
    }
  };

  return <LoginForm onSubmit={onSubmit} loading={loading} error={error} />;
};

export default LoginPage;