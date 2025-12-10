"use client"

import { useState, useContext } from "react"
import { X, FileText } from "lucide-react"
import { AuthContext } from "../../../context/AuthContext"
import { uploadFile } from "../../../api/claudinary.api"
import { useToast } from "../../../context/ToastContext"

export function AddMaterialModal({ onClose, onUploaded, espacioId }) {
  const { user } = useContext(AuthContext)
  const toast = useToast()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    setError(null)
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

    // Determinar espacioId: preferir el prop, sino usar el último seleccionado guardado
    let espacioIdToSend = espacioId
    try {
      if (!espacioIdToSend) {
        const last = localStorage.getItem('lastSelectedEspacioId')
        if (last) espacioIdToSend = Number(last)
      }
    } catch (err) {
      /* noop */
    }

    if (!espacioIdToSend) {
      setError('No se pudo determinar el espacio al que pertenece el material.')
      return
    }

    try {
      setLoading(true)
      console.log('Iniciando upload desde modal. usuarioId:', usuarioId, 'espacioId:', espacioIdToSend, 'file:', file.name)
      const res = await uploadFile(file, usuarioId, espacioIdToSend)
      console.log('Upload respuesta:', res)
      setLoading(false)
      // Notificar éxito
      try {
        toast?.showToast?.('Material subido correctamente', 'success')
      } catch (err) {
        console.warn('toast.showToast fallo:', err)
      }
      // Si el padre pidió la info subida, enviarla
      if (onUploaded) onUploaded(res)
      onClose()
    } catch (err) {
      console.error(err)
      setError("Error al subir el archivo")
      try {
        // Mostrar mensaje y detalle si está disponible
        const msg = err?.response?.data?.message || err?.message || 'No se pudo subir el material'
        toast?.showToast?.(msg, 'error')
      } catch (err) {
        console.warn('toast.showToast fallo:', err)
      }
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
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Nuevo Material</h2>
              <p className="text-gray-500 text-xs">Registra un nuevo material en el sistema</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>


        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Archivo */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <FileText className="h-3.5 w-3.5 text-gray-400" />
              Archivo
            </label>
            <input
              type="file"
              name="file"
              accept="*/*"
              onChange={handleFileChange}
              className="w-full text-sm"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 
              bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white 
              bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg 
              hover:from-blue-700 hover:to-blue-800 transition-all shadow-md 
              shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
