import api from "./base.api";

const endpoint = "/materias";

// Obtener todas las materias
export const getMaterias = async () => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error al obtener materias:", error);
    throw error;
  }
};

// Obtener una materia por ID
export const getMateriaById = async (id) => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener materia:", error);
    throw error;
  }
};

// Crear una nueva materia
export const createMateria = async (materiaData) => {
  try {
    const response = await api.post(`${endpoint}/create`, materiaData);
    return response.data;
  } catch (error) {
    console.error("Error al crear materia:", error);
    throw error;
  }
};

// Actualizar una materia
export const updateMateria = async (id, materiaData) => {
  try {
    const response = await api.put(`${endpoint}/${id}`, materiaData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar materia:", error);
    throw error;
  }
};

// Eliminar una materia
export const deleteMateria = async (id) => {
  try {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar materia:", error);
    throw error;
  }
};

// Obtener materias por carrera
export const getMateriasByCarrera = async (carreraId) => {
  try {
    const response = await api.get(`${endpoint}/carrera/${carreraId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener materias por carrera:", error);
    throw error;
  }
};