import api from "./base.api";
const endpoint = "/auth";

export const login = async (credenciales) => {
  console.log("Credenciales enviadas para login:", credenciales);
  try {
    const response = await api.post(`${endpoint}/login`, credenciales);
    // Asumiendo que la respuesta incluye { jwt, username, role, expiration }
    const { token, usuario } = response.data;
    // Guardar en localStorage
    localStorage.setItem("jwt", token);
    localStorage.setItem("user", JSON.stringify({ usuario}));
    // localStorage.setItem("expiration", Date.now() + expiration); // expiración en milisegundos
    return response.data; // opcional: devolver la respuesta
  } catch (error) {
    console.error("Error en el login:", error);
    throw error;
  }
};

export const requestPasswordReset = async (email) => {
  console.log("[v0] Solicitando código de recuperación para:", email)
  try {
    const response = await api.post("/request-reset", { email })
    console.log("[v0] Respuesta de request-code:", response.data)
    return response.data
  } catch (error) {
    console.error("[v0] Error en request-code:", error)
    throw error
  }
}
export const verifyResetCode = async (email, code) => {
  console.log("[v0] Verificando código:", { email, code })
  try {
    const response = await api.post("/auth/password/verify-code", {
      email,
      code: Number.parseInt(code),
    })
    return response.data
  } catch (error) {
    console.error("[v0] Error al verificar código:", error)
    throw error
  }
}


export const resetPassword = async (email, code, newPassword) => {
  console.log("[v0] Reseteando contraseña para:", email)
  try {
    const response = await api.post("/auth/password/reset", {
      email,
      code: Number.parseInt(code),
      newPassword,
    })
    return response.data
  } catch (error) {
    console.error("[v0] Error al resetear contraseña:", error)
    throw error
  }
}

export const logout = async () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
};