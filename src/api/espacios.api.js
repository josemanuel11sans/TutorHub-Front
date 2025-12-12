import api from "./base.api";

const endpoint = "/espacios";

// Obtener todos los espacios
export const getEspacios = async () => {
  try {
    const response = await api.get(`${endpoint}/all`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener espacios:", error);
    throw error;
  }
};

// Obtener espacios de un tutor específico
export const getEspaciosByTutor = async (tutorId, options = {}) => {
  // options: { includeDeleted: boolean }
  const params = {}
  if (options.includeDeleted) params.estado = 0

  try {
    const response = await api.get(`${endpoint}/tutor/${tutorId}`, { params })
    return response.data
  } catch (error) {
    console.error("Error al obtener espacios del tutor:", error)
    throw error
  }
}

// Buscar espacios por nombre
export const searchEspacios = async (nombre) => {
  try {
    const response = await api.get(`${endpoint}/search`, {
      params: { nombre }
    });
    return response.data;
  } catch (error) {
    console.error("Error al buscar espacios:", error);
    throw error;
  }
};

// Obtener un espacio por ID
export const getEspacioById = async (id) => {
  try {
    const response = await api.get(`${endpoint}/id/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener espacio:", error);
    throw error;
  }
};

// Crear un nuevo espacio
export const createEspacio = async (espacioData) => {
  console.log("Data cruda recibida en createEspacio:", espacioData);
  console.log("Tipo tutor_id:", typeof espacioData.tutor_id);
  console.log("Tipo materia_id:", typeof espacioData.materia_id);

  try {
    const response = await api.post(`${endpoint}/create`, espacioData);
    return response.data;
  } catch (error) {
    console.error("Error al crear espacio:", error);
    throw error;
  }
};


// Actualizar un espacio
export const updateEspacio = async (id, espacioData) => {
  try {
    const response = await api.put(`${endpoint}/update/${id}`, espacioData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar espacio:", error);
    throw error;
  }
};

// Eliminar un espacio (soft delete)
export const deleteEspacio = async (id) => {
  try {
    const response = await api.delete(`${endpoint}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar espacio:", error);
    throw error;
  }
};


// Obtener espacios de un alumno específico
export const getEspaciosByStudent = async (alumnoId) => {
  try {
    const response = await api.get(`${endpoint}/alumno/${alumnoId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener espacios del alumno:", error);
    throw error;
  }
};

// Obtener espacios de un carrera específico
export const getEspaciosBySCarrera = async (alumnoId) => {
  try {
    const response = await api.get(`${endpoint}/alumno/${alumnoId}/carrera`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener espacios de la carrera:", error);
    throw error;
  }
};