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

export const updateEspacio = async (id, data) => {
  try {
    const res = await api.put(`/espacios/update/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error al actualizar espacio:", error);
    throw error;
  }
};

export const deleteEspacio = async (id) => {
  try {
    const res = await api.delete(`/espacios/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error al eliminar espacio:", error);
    throw error;
  }
};
