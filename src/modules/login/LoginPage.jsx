import { useLogin } from "./hooks/useLogin";
import { LoginForm } from "./components/LoginForm";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function LoginPage() {
  const { login, loading, error } = useLogin();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirigir si ya está logueado
  useEffect(() => {
    if (user) {
      const roleRoutes = {
        coordinator: "/coordinador",
        student: "/alumno",
        tutor: "/tutor",
        admin: "/admin",
      };
      const redirectTo = roleRoutes[user.rol] || "/";
      console.log("[v0] Usuario ya logueado, redirigiendo a:", redirectTo);
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async ({ email, password }) => {
    console.log("[v0] Intentando login con:", email);

    const usuario = await login({ email, password });

    if (usuario) {
      console.log("[v0] Login exitoso:", usuario);
      console.log("[v0] Rol del usuario:", usuario.rol);

      // Mapeo de roles normalizados a rutas
      const roleRoutes = {
        coordinator: "/coordinador",
        student: "/alumno",
        tutor: "/tutor",
        admin: "/admin",
      };

      const redirectTo = roleRoutes[usuario.rol] || "/";
      console.log("[v0] Redirigiendo a:", redirectTo);

      navigate(redirectTo, { replace: true });
    } else {
      console.error("[v0] Login fallido");
    }
  };

  return <LoginForm onSubmit={onSubmit} loading={loading} error={error} />;
}
