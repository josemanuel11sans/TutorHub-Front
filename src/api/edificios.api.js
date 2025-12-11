import api from "./base.api"; // Usa tu archivo existente

const endpoint = "/edificios";

// Obtener todos los edificios
export const getEdificios = async () => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error al obtener edificios:", error);
    
    // Manejo específico de errores
    if (error.response?.status ===  401) {
      throw new Error("No autenticado. Por favor, inicia sesión nuevamente.");
    } else if (error.response?.status === 403) {
      throw new Error("No tienes permiso para realizar esta acción.");
    } else if (error.response?.status === 404) {
      return []; // Retorna array vacío si no hay edificios
    }
    
    throw error;
  }
};

// Obtener un edificio por ID
export const getEdificioById = async (id) => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener edificio:", error);
    
    if (error.response?.status === 404) {
      throw new Error("Edificio no encontrado");
    }
    
    throw error;
  }
};

// Crear nuevo edificio
export const createEdificio = async (edificioData) => {
  try {
    // Asegurar que el cuerpo tenga el formato correcto
    const dataToSend = {
      nombre: edificioData.nombre?.trim(),
      ubicacion: edificioData.ubicacion?.trim(),
      descripcion: edificioData.descripcion?.trim() || null,
      estado: edificioData.estado ?? true
    };

    const response = await api.post(`${endpoint}/create`, dataToSend);
    return response.data;
  } catch (error) {
    console.error("Error al crear edificio:", error);
    
    if (error.response?.data) {
      // Pasar el error completo para que el componente pueda mostrar los mensajes específicos
      throw error.response.data;
    }
    
    throw error;
  }
};

// Actualizar edificio
export const updateEdificio = async (id, edificioData) => {
  try {
    const response = await api.put(`${endpoint}/${id}`, edificioData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar edificio:", error);
    
    if (error.response?.data) {
      throw error.response.data;
    }
    
    throw error;
  }
};

// Eliminar edificio
export const deleteEdificio = async (id) => {
  try {
    await api.delete(`${endpoint}/${id}`);
    return true;
  } catch (error) {
    console.error("Error al eliminar edificio:", error);
    
    if (error.response?.data) {
      throw error.response.data;
    }
    
    throw error;
  }
};

// Desactivar edificio
export const deactivateEdificio = async (id) => {
  try {
    const response = await api.patch(`${endpoint}/${id}/deactivate`);
    return response.data;
  } catch (error) {
    console.error("Error al desactivar edificio:", error);
    
    if (error.response?.data) {
      throw error.response.data;
    }
    
    throw error;
  }
};