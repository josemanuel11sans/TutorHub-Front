import api from "./base.api";
const endpoint = "/auth";

export const login = async (credenciales) => {
  console.log("Credenciales enviadas para login:", credenciales);

  try {
    const response = await api.post(`${endpoint}/login`, credenciales);
        
    const { token, usuario } = response.data;

    // Guardar token y usuario en localStorage
    if (token) {
      localStorage.setItem("jwt", token);
    }
    
    if (usuario) {
      localStorage.setItem("user", JSON.stringify(usuario));
    }

    // Devolver SOLO response.data (no toda la respuesta de axios)
    return response.data; // { token, usuario }
  } catch (error) {
    console.error("Error en el login:", error);
    throw error;
  }
};

export const logout = async () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
};