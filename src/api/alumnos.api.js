import api from "./base.api";

const endpoint = "/usuarios";

// Obtener todos los alumnos
export const getAlumnos = async () => {
  try {
    const response = await api.get(`${endpoint}/role/student`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener alumnos:", error);
    throw error;
  }
};

// Obtener un alumno por ID
export const getAlumnoById = async (id) => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener alumno:", error);
    throw error;
  }
};

// Crear un nuevo alumno
export const createAlumno = async (alumnoData) => {
  try {
    const response = await api.post(endpoint, {
      ...alumnoData,
      role: "student", // Asegurar que el rol sea student
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear alumno:", error);
    throw error;
  }
};

// Actualizar un alumno
export const updateAlumno = async (id, alumnoData) => {
  try {
    const response = await api.put(`${endpoint}/${id}`, alumnoData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar alumno:", error);
    throw error;
  }
};

// Eliminar un alumno
export const deleteAlumno = async (id) => {
  try {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar alumno:", error);
    throw error;
  }
};