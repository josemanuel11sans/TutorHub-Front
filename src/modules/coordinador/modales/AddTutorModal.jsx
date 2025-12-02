"use client"

import { useState } from "react"
import { X, User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react"

export function AddTutorModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    currentPassword: "",
    estado: true,
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    })
  }

  const handleSubmit = async (e) => {
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
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Nuevo Tutor</h2>
              <p className="text-gray-500 text-xs">Registra un nuevo tutor en el sistema</p>
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
          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <User className="h-3.5 w-3.5 text-gray-400" />
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
              placeholder="Ingresa el nombre"
              required
            />
          </div>

          {/* Apellido */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <User className="h-3.5 w-3.5 text-gray-400" />
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
              placeholder="Ingresa el apellido"
              required
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <Phone className="h-3.5 w-3.5 text-gray-400" />
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
              placeholder="123456789"
              required
            />
          </div>

          {/* Correo */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <Mail className="h-3.5 w-3.5 text-gray-400" />
              Correo Electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
              placeholder="ejemplo@escuela.edu"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <Lock className="h-3.5 w-3.5 text-gray-400" />
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="Ingresa la contraseña"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Estado */}
          <div className="flex items-center gap-2 hidden">
            <input
              type="checkbox"
              name="estado"
              checked={formData.estado}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 "
            />
            <label className="text-sm text-gray-700">Activo</label>
          </div>

          {/* Buttons */}
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
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
