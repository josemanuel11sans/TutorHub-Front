"use client"

import { useState, useEffect } from "react"
import { X, FileText, Image, Users, BookOpen } from "lucide-react"
import { updateEspacio } from "../../../api/espacios.api"
import { getMaterias } from "../../../api/materias.api"
import { getTutores } from "../../../api/tutores.api"

export function EditEspacioModal({ onClose, onEdited, espacio }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    portada: "",
    tutor_id: "",
    materia_id: "",
    estado: true,
  })

  const [tutores, setTutores] = useState([])
  const [materias, setMaterias] = useState([])
  const [loading, setLoading] = useState(false)

  // Cargar tutores y materias al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  // Cargar datos del espacio cuando cambie
  useEffect(() => {
    if (espacio) {
      setFormData({
        nombre: espacio.nombre || "",
        descripcion: espacio.descripcion || "",
        portada: espacio.portada || "",
        tutor_id: espacio.tutor_id || espacio.tutorId || "",
        materia_id: espacio.materia_id || espacio.materiaId || "",
        estado: espacio.estado ?? true,
      })
    }
  }, [espacio])

  const cargarDatos = async () => {
    try {
      const [tutoresData, materiasData] = await Promise.all([
        getTutores(),
        getMaterias()
      ])
      setTutores(tutoresData)
      setMaterias(materiasData)
    } catch (error) {
      console.error("Error al cargar datos:", error)
      alert("Error al cargar tutores y materias")
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convertir IDs a números antes de enviar
      const espacioData = {
        ...formData,
        tutor_id: Number(formData.tutor_id),
        materia_id: Number(formData.materia_id)
      }

      const res = await updateEspacio(espacio.id_espacio || espacio.id, espacioData)

      if (onEdited) onEdited(res)
      onClose()
    } catch (error) {
      console.error("Error al actualizar espacio:", error)
      alert("Error al actualizar el espacio")
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
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
              transition-all text-gray-900 placeholder:text-gray-400"
              placeholder="Ej. Aula 101"
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
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
              transition-all resize-none text-gray-900 placeholder:text-gray-400"
              rows={3}
              placeholder="Ej. Laboratorio de computación"
              required
            />
          </div>

          {/* PORTADA */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <Image className="h-3.5 w-3.5 text-gray-400" />
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
              required
            />
          </div>

          {/* SELECT MATERIA */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <BookOpen className="h-3.5 w-3.5 text-gray-400" />
              Materia
            </label>
            <select
              name="materia_id"
              value={formData.materia_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
              transition-all text-gray-900"
            >
              <option value="">Selecciona una materia</option>
              {materias.map((materia) => (
                <option key={materia.id_materia} value={materia.id_materia}>
                  {materia.nombre_materia}
                  {materia.carrera && ` - ${materia.carrera.nombre_carrera}`}
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
              name="tutor_id"
              value={formData.tutor_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
              transition-all text-gray-900"
            >
              <option value="">Selecciona un tutor</option>
              {tutores.map((tutor) => (
                <option key={tutor.id_usuario} value={tutor.id_usuario}>
                  {tutor.nombre} {tutor.apellido}
                </option>
              ))}
            </select>
          </div>

          {/* ESTADO (oculto) */}
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
              transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 
              disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}