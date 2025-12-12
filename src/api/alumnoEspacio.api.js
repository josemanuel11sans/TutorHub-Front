import api from "./base.api";

const endpoint = "/espacios";

// Obtener espacios en los que el alumno está inscrito
export const getEspaciosDeAlumno = async (alumnoId) => {
  try {
    const response = await api.get(`${endpoint}/alumno/${alumnoId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener espacios del alumno:", error);
    throw error;
  }
};

// Obtener espacios disponibles por carrera del alumno
export const getEspaciosPorCarreraDeAlumno = async (alumnoId) => {
  try {
    const response = await api.get(`${endpoint}/alumno/${alumnoId}/carrera`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener espacios por carrera del alumno:", error);
    throw error;
  }
};

// Inscribir alumno en un espacio
export const inscribirAlumnoEnEspacio = async (espacioId, alumnoId) => {
  try {
    const response = await api.post(
      `${endpoint}/${espacioId}/alumnos/${alumnoId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al inscribir alumno en espacio:", error);
    throw error;
  }
};

// Listar alumnos de un espacio
export const listarAlumnosDeEspacio = async (espacioId) => {
  try {
    const response = await api.get(`${endpoint}/${espacioId}/alumnos`);
    return response.data;
  } catch (error) {
    console.error("Error al listar alumnos de un espacio:", error);
    throw error;
  }
};

// Listar espacios de un alumno
export const listarEspaciosDeAlumno = async (alumnoId) => {
  try {
    const response = await api.get(`${endpoint}/alumno/${alumnoId}`);
    return response.data;
  } catch (error) {
    console.error("Error al listar espacios de un alumno:", error);
    throw error;
  }
};

// Listar espacios de un alumno por carrera
export const listarEspaciosPorCarreraDeAlumno = async (alumnoId) => {
  try {
    const response = await api.get(`${endpoint}/alumno/${alumnoId}/carrera`);
    return response.data;
  } catch (error) {
    console.error("Error al listar espacios por carrera de un alumno:", error);
    throw error;
  }
};

// Desinscribir alumno de un espacio
export const desinscribirAlumnoDeEspacio = async (espacioId, alumnoId) => {
  try {
    const response = await api.delete(
      `${endpoint}/${espacioId}/alumnos/${alumnoId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al desinscribir alumno de un espacio:", error);
    throw error;
  }
};
