"use client"

import { useState } from "react"
import { X, AlertTriangle } from "lucide-react"
import { deleteEspacio } from "../../../api/espacios.api"

export function DeleteEspacioModal({ onClose, onDeleted, espacio }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)

    try {
      // Usar el ID correcto del espacio (puede venir como id_espacio o id)
      const espacioId = espacio.id_espacio || espacio.id
      
      const res = await deleteEspacio(espacioId)

      if (onDeleted) onDeleted(res)
      onClose()
    } catch (error) {
      console.error("Error al eliminar espacio:", error)
      alert("Error al eliminar el espacio")
    } finally {
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
            <div className="bg-red-600 p-2 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Eliminar Espacio</h2>
              <p className="text-gray-500 text-xs">Esta acción se puede deshacer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-700 mb-4">
            ¿Estás seguro de que deseas cambiarle el estado al espacio <span className="font-semibold">{espacio?.nombre}</span>?
          </p>
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex gap-2 mb-6">
            <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">
              Esta acción eliminará el registro de forma lógica. 
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg 
              hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r 
              from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 
              transition-all shadow-md shadow-red-500/20 disabled:opacity-50 
              disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}