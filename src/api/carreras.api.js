import api from "./base.api";

const endpoint = "/carreras";

// Obtener todas las carreras (activas e inactivas)
export const getCarreras = async () => {
  try {
    const response = await api.get(endpoint);
    // Mapear 'activo' a 'estado' para consistencia con el frontend
    return response.data.map(carrera => ({
      ...carrera,
      estado: carrera.activo !== undefined ? carrera.activo : true
    }));
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

// Crear una nueva carrera
export const createCarrera = async (carreraData) => {
  try {
    const response = await api.post(`${endpoint}/create`, carreraData);
    return response.data;
  } catch (error) {
    console.error("Error al crear carrera:", error);
    throw error;
  }
};

// Actualizar una carrera
export const updateCarrera = async (id, carreraData) => {
  try {
    const response = await api.put(`${endpoint}/update/${id}`, carreraData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar carrera:", error);
    throw error;
  }
};

// Cambiar estado (toggle) o eliminar lógicamente una carrera
export const deleteCarrera = async (id) => {
  try {
    const response = await api.delete(`${endpoint}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar carrera:", error);
    throw error;
  }
};