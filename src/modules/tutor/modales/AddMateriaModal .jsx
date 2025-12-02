"use client"

import { useState } from "react"
import { X, BookOpen } from "lucide-react"

export function AddMateriaModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    nombre: "",
    estado: true,
  })

  const [loading, setLoading] = useState(false)

  // Materias disponibles para seleccionar
  const materiasDisponibles = [
    "Arquitecturas de Software",
    "Bases de Datos",
    "Desarrollo Web",
    "Ingeniería de Software",
    "Cálculo Integral",
  ]

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
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Agregar Materia</h2>
              <p className="text-gray-500 text-xs">
                Selecciona una materia que el tutor impartirá
              </p>
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

          {/* Select de Materias Existentes */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <BookOpen className="h-3.5 w-3.5 text-gray-400" />
              Materia existente
            </label>

            <select
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
              transition-all text-gray-900"
            >
              <option value="" disabled>Selecciona una materia</option>

              {materiasDisponibles.map((mat, idx) => (
                <option key={idx} value={mat}>{mat}</option>
              ))}
            </select>
          </div>

          {/* Estado - oculto */}
          <input type="hidden" name="estado" value={formData.estado} />

          {/* Botones */}
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
