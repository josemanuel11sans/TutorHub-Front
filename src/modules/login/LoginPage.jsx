import { useLogin } from "./hooks/useLogin"
import { LoginForm } from "./components/LoginForm"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const { login, loading, error } = useLogin()
  const navigate = useNavigate()

  const onSubmit = async ({ email, password }) => {
    console.log("[v0] Intentando login con:", email)

    const usuario = await login({ email, password })

    if (usuario) {
      console.log("[v0] Login exitoso:", usuario)

      if (usuario.rol === "coordinador") {
        navigate("/coordinador/gestion")
      } else if (usuario.rol === "alumno") {
        navigate("/alumno")
      } else if (usuario.rol === "tutor") {
        navigate("/tutor")
      } else {
        navigate("/home")
      }
    } else {
      console.error("[v0] Login fallido")
    }
  }

  return <LoginForm onSubmit={onSubmit} loading={loading} error={error} />
}
