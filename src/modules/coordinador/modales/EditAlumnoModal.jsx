"use client"

import { useState, useEffect } from "react"
import { X, User, Mail, Phone, Lock, ShieldCheck, Eye, EyeOff, BookOpen } from "lucide-react"
import { getCarreras } from "../../../api/carreras.api"

export function EditAlumnoModal({ alumno, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    id: alumno.id,
    nombre: alumno.nombre,
    apellido: alumno.apellido,
    email: alumno.email,
    telefono: alumno.telefono,
    carrera_id: alumno.carrera_id || "",
    newPassword: "",
    confirmPassword: "",
    estado: alumno.estado,
  })
  const [carreras, setCarreras] = useState([])
  const [carrerasLoading, setCarrerasLoading] = useState(false)

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCarreras()
  }, [])

  const loadCarreras = async () => {
    try {
      setCarrerasLoading(true)
      const data = await getCarreras()
      setCarreras(data)
    } catch (err) {
      console.error("Error al cargar carreras:", err)
    } finally {
      setCarrerasLoading(false)
    }
  }

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
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 relative">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Editar Alumno</h2>
              <p className="text-gray-500 text-xs">Actualiza la información del alumno</p>
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
              placeholder="Ingresa el nombre"
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
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
              placeholder="Ingresa el apellido"
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@escuela.edu"
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
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
              placeholder="123456789"
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Carrera */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <BookOpen className="h-3.5 w-3.5 text-gray-400" />
              Carrera
            </label>
            <select
              name="carrera_id"
              value={formData.carrera_id}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
              disabled={carrerasLoading}
            >
              <option value="">Selecciona una carrera</option>
              {carreras.map(carrera => (
                <option key={carrera.id_carrera} value={carrera.id_carrera}>
                  {carrera.nombre_carrera}
                </option>
              ))}
            </select>
          </div>

          {/* Nueva Contraseña */}
          <PasswordField
            label="Nueva Contraseña"
            name="newPassword"
            value={formData.newPassword}
            show={showPasswords.new}
            onToggle={() => togglePasswordVisibility("new")}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
          />

          {/* Confirmar Nueva Contraseña */}
          <PasswordField
            label="Confirmar Nueva Contraseña"
            name="confirmPassword"
            value={formData.confirmPassword}
            show={showPasswords.confirm}
            onToggle={() => togglePasswordVisibility("confirm")}
            onChange={handleChange}
            placeholder="Repite la nueva contraseña"
          />

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
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Componente auxiliar para campos de contraseña
function PasswordField({ label, name, value, show, onToggle, onChange, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
        <Lock className="h-3.5 w-3.5 text-gray-400" />
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
