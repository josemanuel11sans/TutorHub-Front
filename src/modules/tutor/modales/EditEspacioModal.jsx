"use client"

import { useState } from "react"
import { X, DoorOpen, FileText, Building2, Users } from "lucide-react"

export function EditEspacioModal({ espacio, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    id_espacio: espacio.id_espacio,
    nombre: espacio.nombre,
    descripcion: espacio.descripcion || "",
    edificio: espacio.edificio,
    capacidad: espacio.capacidad,
    estado: espacio.estado,
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulación de actualización
    setTimeout(() => {
      onUpdate(formData)
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
              <DoorOpen className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">Editar Espacio</h2>
              <p className="text-gray-500 text-xs">Actualiza la información del espacio</p>
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

          {/* Nombre del espacio */}
          <Field
            label="Nombre del espacio"
            icon={<DoorOpen className="h-3.5 w-3.5 text-gray-400" />}
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Aula 101"
            required
          />

          {/* Descripción */}
          <Field
            label="Descripción"
            icon={<FileText className="h-3.5 w-3.5 text-gray-400" />}
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción del espacio"
          />

          {/* Capacidad */}
          <Field
            label="Capacidad"
            icon={<Users className="h-3.5 w-3.5 text-gray-400" />}
            name="capacidad"
            value={formData.capacidad}
            onChange={handleChange}
            placeholder="Ej: 30 personas"
            required
          />

          {/* BUTTONS */}
          <div className="flex gap-3 pt-4">
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
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* COMPONENTE AUXILIAR PARA INPUTS */
function Field({ label, icon, name, value, onChange, placeholder, required }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
        {icon}
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
        focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent 
        outline-none transition-all text-gray-900 placeholder:text-gray-400"
      />
    </div>
  )
}
