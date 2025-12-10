"use client"

import { useState, useContext } from "react"
import { X, Upload } from "lucide-react"
import { AuthContext } from "../../../context/AuthContext"
import { uploadFile } from "../../../api/claudinary.api"
import { useToast } from "../../../context/ToastContext"

export function UploadFileModal({ onClose, espacioId }) {
  const { user } = useContext(AuthContext)
  const toast = useToast()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    setError(null)
    // Solo permitimos un archivo
    setFile(e.target.files?.[0] ?? null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!file) {
      setError("Selecciona un archivo para subir")
      return
    }

    const usuarioId = user?.id
    if (!usuarioId) {
      setError("No se pudo identificar al usuario. Inicia sesión.")
      return
    }

    try {
      setLoading(true)
      console.log('UploadFileModal: iniciando upload', { usuarioId: user?.id, espacioId, file: file?.name })
      await uploadFile(file, usuarioId, espacioId)
      console.log('UploadFileModal: upload completado')
      try { toast?.showToast?.('Archivo subido correctamente', 'success') } catch (e) { console.warn(e) }
      setLoading(false)
      // Cerrar modal tras subida correcta
      onClose()
    } catch (err) {
      console.error(err)
      setError("Error al subir el archivo")
      try { toast?.showToast?.(err?.response?.data?.message || 'No se pudo subir el archivo', 'error') } catch (e) { console.warn(e) }
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 relative">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Subir Archivo</h2>
              <p className="text-gray-500 text-xs">Selecciona un archivo para subir y se guardará con tu usuario</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">Archivo</label>
            <input
              type="file"
              name="file"
              accept="*/*"
              onChange={handleFileChange}
              className="w-full text-sm"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? "Subiendo..." : "Subir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
