import api from "./base.api"; // o la ruta donde lo tengas

export const createAula = async (data) => {
  try {
    const res = await api.post("/aulas", data);
    return res.data;
  } catch (error) {
    console.error("Error al crear aula:", error);
    throw error;
  }
};

export const getAulas = async () => {
  try {
    const res = await api.get(`/aulas`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener aulas:", error);
    throw error;
  }
};
