import api from "./base.api";

const endpoint = "/asesorias";

// Obtener todas las asesorías
export const getAsesorias = async () => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error al obtener asesorías:", error);
    throw error;
  }
};

// Obtener asesorías de un espacio específico
export const getAsesoriasEspacio = async (espacioId) => {
  try {
    const response = await api.get(`${endpoint}/espacio/${espacioId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener asesorías del espacio ${espacioId}:`, error);
    throw error;
  }
};

// Obtener una asesoría por ID
export const getAsesoriaById = async (id) => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener asesoría:", error);
    throw error;
  }
};

// Crear una nueva asesoría
export const createAsesoria = async (asesoriaData) => {
  try {
    const response = await api.post(endpoint, asesoriaData);
    return response.data;
  } catch (error) {
    console.error("Error al crear asesoría:", error);
    throw error;
  }
};

// Actualizar una asesoría
export const updateAsesoria = async (id, asesoriaData) => {
  try {
    const response = await api.put(`${endpoint}/${id}`, asesoriaData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar asesoría:", error);
    throw error;
  }
};

// Eliminar una asesoría
export const deleteAsesoria = async (id) => {
  try {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar asesoría:", error);
    throw error;
  }
};

// Registrar asistencia en una asesoría (PUT)
export const registerAttendance = async (asesoriaId, asistencia = true) => {
  try {
    const response = await api.put(`${endpoint}/${asesoriaId}/attendance`, {
      asistencia,
    });
    return response.data;
  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    throw error;
  }
};

// Confirmar/Aceptar una asesoría
export const confirmAsesoria = async (id, aceptada = true) => {
  try {
    const response = await api.put(`${endpoint}/${id}/status`, {
      aceptada,
    });
    return response.data;
  } catch (error) {
    console.error("Error al confirmar asesoría:", error);
    throw error;
  }
};
