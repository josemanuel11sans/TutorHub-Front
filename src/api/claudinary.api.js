import api from './base.api'

/**
 * Sube un archivo al endpoint /files/upload
 * @param {File} file
 * @param {number|string} usuarioId
 * @returns {Promise<any>} respuesta del servidor
 */
export const uploadFile = async (file, usuarioId) => {
	try {
		const formData = new FormData()
		formData.append('file', file)
		formData.append('usuarioId', String(usuarioId))

		const res = await api.post('/files/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})

		return res.data
	} catch (error) {
		console.error('Error al subir archivo:', error)
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

