"use client"

import { useState } from "react"
import { X, FileText, Folder, Layers } from "lucide-react"

export function AddMaterialModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    nombre: "",
    espacio: "",
    tipo_archivo: "",
    estado: true,
  })

  const [loading, setLoading] = useState(false)

  // Opciones mock (puedes reemplazarlas por props si después lo deseas)
  const espaciosMock = ["Aula 101", "Aula 102", "Lab. Computación", "Biblioteca"]
  const tiposArchivos = ["PDF", "PPT", "DOCX", "Imagen"]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulación de guardado
    setTimeout(() => {
      onAdd(formData)
      setLoading(false)
    }, 500)
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

          {/* Nombre del Material */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <FileText className="h-3.5 w-3.5 text-gray-400" />
              Nombre del material
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej. Material de apoyo Unidad 1"
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
              transition-all text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Espacio (select) */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <Layers className="h-3.5 w-3.5 text-gray-400" />
              Espacio
            </label>
            <select
              name="espacio"
              value={formData.espacio}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            >
              <option value="" disabled>Selecciona un espacio</option>
              {espaciosMock.map((e, idx) => (
                <option key={idx} value={e}>{e}</option>
              ))}
            </select>
          </div>

          {/* Tipo de archivo */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <Folder className="h-3.5 w-3.5 text-gray-400" />
              Tipo de archivo
            </label>
            <select
              name="tipo_archivo"
              value={formData.tipo_archivo}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            >
              <option value="" disabled>Selecciona el tipo</option>
              {tiposArchivos.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Estado (oculto) */}
          <input type="hidden" name="estado" value={formData.estado} />

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
