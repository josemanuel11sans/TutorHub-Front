import { useLogin } from "./hooks/useLogin";
import { LoginForm } from "./components/LoginForm";
// import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login, loading, error } = useLogin();
//   const navigate = useNavigate();

  const handleLogin = async (form) => {
    const user = await login(form);
    if (user) {
    //   navigate("/dashboard");
    }
  };

  return (
    <div className="login-page">
      <LoginForm
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default LoginPage;
