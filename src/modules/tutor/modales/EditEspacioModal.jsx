"use client"

import { useState, useEffect, useContext } from "react"
import { X, DoorOpen, FileText, Building2, Users } from "lucide-react"
import { updateEspacio } from "../../../api/espacios.api"
import { getMaterias } from "../../../api/materias.api"
import { useToast } from "../../../context/ToastContext"
import { AuthContext } from "../../../context/AuthContext"

export function EditEspacioModal({ espacio, onClose, onUpdate }) {
  const toast = useToast()
  const { user } = useContext(AuthContext)
  const [materias, setMaterias] = useState([])

  const [formData, setFormData] = useState({
    id_espacio: espacio.id_espacio ?? espacio.id,
    nombre: espacio.nombre ?? "",
    descripcion: espacio.descripcion || "",
    portada: espacio.portada || (espacio._raw && (espacio._raw.portada || espacio._raw.cover)) || "",
    materia_id: espacio._raw?.materia_id ?? espacio._raw?.materiaId ?? espacio.materia_id ?? espacio._raw?.materia ?? "",
    capacidad: espacio.capacidad ?? espacio._raw?.capacidad ?? "",
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadMaterias = async () => {
      try {
        const data = await getMaterias()
        setMaterias(data || [])
      } catch (err) {
        console.warn('No se pudieron cargar materias:', err)
      }
    }
    loadMaterias()
  }, [])

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const id = formData.id_espacio
      // usar user.id como tutor_id (sesión)
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        portada: formData.portada,
        tutor_id: user?.id,
        materia_id: Number(formData.materia_id) || null,
      }
      const res = await updateEspacio(id, payload)
      // Respuesta esperada: { message, espacio: {...} }
      const updatedRaw = res?.espacio ?? res
      const normalized = {
        id: updatedRaw.id_espacio ?? updatedRaw.id ?? id,
        nombre: updatedRaw.nombre ?? formData.nombre,
        descripcion: updatedRaw.descripcion ?? formData.descripcion,
        portada: updatedRaw.portada ?? formData.portada,
        alumnos: espacio.alumnos ?? 0,
        capacidad: updatedRaw.capacidad ?? espacio.capacidad ?? 0,
        materiales: espacio.materiales ?? 0,
        color: espacio.color ?? "bg-blue-500",
        _raw: updatedRaw,
      }
      try { toast?.showToast?.('Espacio actualizado', 'success') } catch (e) { console.warn(e) }
      onUpdate(normalized)
      setLoading(false)
      onClose()
    } catch (err) {
      console.error('Error actualizando espacio:', err)
      try { toast?.showToast?.(err?.response?.data?.message || 'No se pudo actualizar el espacio', 'error') } catch (e) { console.warn(e) }
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

          {/* Portada URL */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <FileText className="h-3.5 w-3.5 text-gray-400" />
              URL de portada
            </label>
            <input
              type="text"
              name="portada"
              value={formData.portada}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
              transition-all text-gray-900 placeholder:text-gray-400"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {/* Materia */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <Building2 className="h-3.5 w-3.5 text-gray-400" />
              Materia
            </label>
            <select
              name="materia_id"
              value={formData.materia_id}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
              transition-all text-gray-900"
              required
            >
              <option value="">Selecciona una materia</option>
              {materias.map((m) => (
                <option key={m.id_materia ?? m.id} value={m.id_materia ?? m.id}>
                  {m.nombre_materia ?? m.nombre}
                </option>
              ))}
            </select>
          </div>

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
