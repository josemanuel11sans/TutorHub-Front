import api from "./base.api";

const endpoint = "/carreras";

// Obtener todas las carreras
export const getCarreras = async () => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error al obtener carreras:", error);
    throw error;
  }
};

// Obtener una carrera por ID
export const getCarreraById = async (id) => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener carrera:", error);
    throw error;
  }
};