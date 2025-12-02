import api from "./base.api";

const endpoint = "/usuarios";

// Obtener todos los tutores
export const getTutores = async () => {
  try {
    const response = await api.get(`${endpoint}/role/tutor`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener tutores:", error);
    throw error;
  }
};

// Obtener un tutor por ID
export const getTutorById = async (id) => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener tutor:", error);
    throw error;
  }
};

// Crear un nuevo tutor
export const createTutor = async (tutorData) => {
  try {
    const response = await api.post(endpoint, {
      ...tutorData,
      role: "tutor", // Asegurar que el rol sea tutor
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear tutor:", error);
    throw error;
  }
};

// Actualizar un tutor
export const updateTutor = async (id, tutorData) => {
  try {
    const response = await api.put(`${endpoint}/${id}`, tutorData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar tutor:", error);
    throw error;
  }
};

// Eliminar un tutor
export const deleteTutor = async (id) => {
  try {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar tutor:", error);
    throw error;
  }
};