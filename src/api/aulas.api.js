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

export const updateAula = async (id, data) => {
  try {
    const res = await api.put(`/aulas/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error al actualizar aula:", error);
    throw error;
  }
};

export const deleteAula = async (id) => {
  try {
    const res = await api.delete(`/aulas/${id}`);
    return res.data ?? true;
  } catch (error) {
    console.error("Error al eliminar aula:", error);
    throw error;
  }
};
