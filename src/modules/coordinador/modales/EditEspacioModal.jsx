"use client"

import { useState, useEffect } from "react"
import { X, FileText, Image, Users, BookOpen } from "lucide-react"

export function EditEspacioModal({ onClose, onEdit, espacio, tutores = [], materias = [] }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    portada: "",
    tutorId: "",
    materiaId: "",
    estado: true,
  })

  useEffect(() => {
    if (espacio) {
      setFormData({
        nombre: espacio.nombre || "",
        descripcion: espacio.descripcion || "",
        portada: espacio.portada || "",
        tutorId: espacio.tutorId || "",
        materiaId: espacio.materiaId || "",
        estado: espacio.estado ?? true,
      })
    }
  }, [espacio])

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      onEdit(formData)
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
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 relative">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Editar Espacio</h2>
              <p className="text-gray-500 text-xs">
                Actualiza la información del espacio
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

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* NOMBRE */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <FileText className="h-3.5 w-3.5 text-gray-400" />
              Nombre del espacio
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
              placeholder="Nombre del espacio"
              required
            />
          </div>

          {/* DESCRIPCION */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <FileText className="h-3.5 w-3.5 text-gray-400" />
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400"
              rows={3}
              placeholder="Escribe una descripción..."
              required
            ></textarea>
          </div>

          {/* PORTADA */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <Image className="h-3.5 w-3.5 text-gray-400" />
              Portada (opcional)
            </label>
            <input
              type="url"
              name="portada"
              value={formData.portada}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
              placeholder="https://imagen.com/portada.jpg"
            />
          </div>

          {/* SELECT MATERIA */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <BookOpen className="h-3.5 w-3.5 text-gray-400" />
              Materia
            </label>

            <select
              name="materiaId"
              value={formData.materiaId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
            >
              <option value="">Seleccione una materia</option>
              {materias.map((materia) => (
                <option key={materia.id} value={materia.id}>
                  {materia.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* SELECT TUTORES */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <Users className="h-3.5 w-3.5 text-gray-400" />
              Tutor encargado
            </label>
            <select
              name="tutorId"
              value={formData.tutorId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
            >
              <option value="">Seleccione un tutor</option>
              {tutores.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.nombre} {tutor.apellido}
                </option>
              ))}
            </select>
          </div>

          {/* ESTADO */}
          <div className="flex items-center gap-2 hidden">
            <input
              type="checkbox"
              name="estado"
              checked={formData.estado}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">Activo</label>
          </div>

          {/* BOTONES */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg 
              hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r 
              from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 
              transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}