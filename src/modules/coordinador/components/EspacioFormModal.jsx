import { useState, useEffect } from "react"
import { X } from "./Icons"
import { Button } from "./Button"
import { Input } from "./Input"

export function EspacioFormModal({ espacio, isOpen, onClose, onSubmit, isEditing }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    portada: ""
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEditing && espacio) {
      setFormData({
        nombre: espacio.nombre || "",
        descripcion: espacio.descripcion || "",
        portada: espacio.portada || ""
      })
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        portada: ""
      })
    }
    setErrors({})
  }, [espacio, isEditing, isOpen])

  const validate = () => {
    const newErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres"
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = "El nombre no puede exceder 100 caracteres"
    }

    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = "La descripción no puede exceder 500 caracteres"
    }

    if (formData.portada && !isValidUrl(formData.portada)) {
      newErrors.portada = "Debe ser una URL válida"
    }

    return newErrors
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      // El error ya se maneja en el componente padre
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Editar Espacio" : "Crear Nuevo Espacio"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Espacio <span className="text-red-500">*</span>
            </label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Matemáticas Avanzadas"
              disabled={loading}
              className={errors.nombre ? "border-red-500" : ""}
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.nombre.length}/100 caracteres
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe de qué trata este espacio..."
              rows={4}
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.descripcion ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.descripcion.length}/500 caracteres
            </p>
          </div>

          {/* Portada */}
          <div>
            <label htmlFor="portada" className="block text-sm font-medium text-gray-700 mb-2">
              URL de Portada
            </label>
            <Input
              id="portada"
              name="portada"
              type="url"
              value={formData.portada}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              disabled={loading}
              className={errors.portada ? "border-red-500" : ""}
            />
            {errors.portada && (
              <p className="mt-1 text-sm text-red-600">{errors.portada}</p>
            )}
            {formData.portada && !errors.portada && (
              <div className="mt-3 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.portada}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>{isEditing ? "Actualizar Espacio" : "Crear Espacio"}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}