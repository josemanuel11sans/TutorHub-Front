import api from "./base.api";
const endpoint = "/auth";

export const login = async (credenciales) => {
  console.log("Credenciales enviadas para login:", credenciales); // Muestra las credenciales que se envían
  return await api.post(`${endpoint}/login`, credenciales)
    .then(response => {
      // console.log("Respuesta del login:", response); // Muestra la respuesta de la API
      return response;
    })
    .catch(error => {
      // console.error("Error en el login:", error); // Muestra el error en caso de fallo
      throw error;
    });
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