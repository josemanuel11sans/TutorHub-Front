import api from './base.api'

/**
 * Sube un archivo al endpoint /files/upload
 * @param {File} file
 * @param {number|string} usuarioId
 * @returns {Promise<any>} respuesta del servidor
 * 
 */
export const uploadFile = async (file, usuarioId, espacioId) => {
	try {
		const formData = new FormData()
		formData.append('file', file)
		formData.append('usuarioId', String(usuarioId))
		formData.append('espacioId', String(espacioId))

		console.log('Subiendo archivo:', file.name, 'para usuarioId:', usuarioId, 'y espacioId:', espacioId)

		// Let axios set the correct Content-Type (with boundary) for FormData
		const res = await api.post('/files/upload', formData)

		return res.data
	} catch (error) {
		console.error('Error al subir archivo:', error)
		console.log('Archivo que se intentó subir:', file, 'usuarioId:', usuarioId, 'espacioId:', espacioId)
		throw error
	}
}

export default {
	uploadFile,
}

export const getFilesByUser = async (usuarioId) => {
	try {
		const res = await api.get(`/files/user/${usuarioId}`)
		return res.data
	} catch (error) {
		console.error('Error al obtener archivos por usuario:', error)
		throw error
	}
}

export const getFilesByEspacio = async (espacioId) => {
	try {
		const res = await api.get(`/files/espacio/${espacioId}`)
		return res.data
	} catch (error) {
		console.error('Error al obtener archivos por espacio:', error)
		throw error
	}
}

export const deleteFile = async (fileId) => {
	try {
		const res = await api.delete(`/files/${fileId}`)
		return res.data
	} catch (error) {
		console.error('Error al eliminar archivo:', error)
		throw error
	}
}

