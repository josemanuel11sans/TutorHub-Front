import api from "./base.api"; // o la ruta donde lo tengas

export const createEspacio = async (data) => {
  try {
    const res = await api.post("/espacios/create", data);
    return res.data;
  } catch (error) {
    console.error("Error al crear espacio:", error);
    throw error;
  }
};

export const getEspaciosByTutor = async (tutorId) => {
  try {
    const res = await api.get(`/espacios/tutor/${tutorId}`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener espacios por tutor:", error);
    throw error;
  }
};
