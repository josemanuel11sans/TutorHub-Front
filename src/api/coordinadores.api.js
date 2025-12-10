import api from "./base.api";

const endpoint = "/usuarios";

// Obtener todos los coordinadores
export const getCoordinadores = async () => {
  try {
    const response = await api.get(`${endpoint}/role/coordinator`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener coordinadores:", error);
    throw error;
  }
};

// Obtener un coordinador por ID
export const getCoordinadorById = async (id) => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener coordinador:", error);
    throw error;
  }
};

// Crear un nuevo coordinador
export const createCoordinador = async (coordinadorData) => {
  try {
    const response = await api.post(`${endpoint}/create`, {
      ...coordinadorData,
      role: "coordinator", // Asegurar que el rol sea coordinator
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear coordinador:", error);
    throw error;
  }
};

// Actualizar un coordinador
export const updateCoordinador = async (id, coordinadorData) => {
  try {
    const response = await api.put(`${endpoint}/update/${id}`, coordinadorData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar coordinador:", error)``;
    throw error;
  }
};

// Eliminar un coordinador
export const deleteCoordinador = async (id) => {
  try {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar coordinador:", error);
    throw error;
  }
};