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

    return response; // opcional: devolver la respuesta
  } catch (error) {
    console.error("Error en el login:", error);
    throw error; // para que el hook o componente lo capture
  }
};


export const logout = async () => {
  return await api.post(`${endpoint}/logout`)
    .then(response => {
      // console.log("Respuesta de logout:", response);
      return response;
    })
    .catch(error => {
      // console.error("Error en el logout:", error);
      throw error;
    });
};