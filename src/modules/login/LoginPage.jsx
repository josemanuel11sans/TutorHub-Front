import { useLogin } from "./hooks/useLogin";
import { LoginForm } from "./components/LoginForm";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { login, loading, error } = useLogin();

  const handleLogin = async (form) => {
    const user = await login(form);
    if (user) {
      toast.success("¡Login exitoso!");
      // navigate("/dashboard");
    } else {
      toast.error(error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-page">
      <LoginForm
        onSubmit={handleLogin}
        loading={loading}
        error={error} // opcional, ahora también usamos toast
      />
    </div>
  );
};

export default LoginPage;
