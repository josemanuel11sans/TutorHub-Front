"use client"

import { useState, useEffect, useContext } from "react"
import { Search, Plus, Edit, Trash2, Users, FolderOpen, RotateCcw, Archive } from "lucide-react"
import  {AddEspacioModal}   from "../modales/AddEspacioModal"
import { DeleteEspacioModal } from "../modales/DeleteEspacioModal"
import { EditEspacioModal } from "../modales/EditEspacioModal"
import { AuthContext } from "../../../context/AuthContext"
import { getEspaciosByTutor, updateEspacio } from "../../../api/espacios.api"
import { useToast } from "../../../context/ToastContext"

const Button = ({ children, onClick, variant = "default", size = "default", className = "" }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "hover:bg-gray-100 text-gray-700",
  }
  const sizes = {
    default: "px-4 py-2",
    sm: "px-2 py-1 text-xs",
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  )
}

const Input = ({ className = "", icon, ...props }) => (
  <div className="relative w-full">
    {icon && <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />}
    <input
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${icon ? "pl-10" : ""} ${className}`}
      {...props}
    />
  </div>
)

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-500",
    default: "bg-gray-200 text-gray-700",
  }

  return (
    <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

// NOTE: removed local mock data — espacios now come from backend via getEspaciosByTutor

export default function EspaciosView({ onSelectEspacio, tutorId: propTutorId }) {
  const { user } = useContext(AuthContext)
  const [espacios, setEspacios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeletedModal, setShowDeletedModal] = useState(false)
  const [selectedEspacio, setSelectedEspacio] = useState(null)
  const [deletedEspacios, setDeletedEspacios] = useState([])
  const [loadingDeleted, setLoadingDeleted] = useState(false)
  const { showToast } = useToast() || {}

  // fetchEspacios moved to component scope so we can call it on demand
  const fetchEspacios = async () => {
    try {
      const id = propTutorId ?? user?.id
      if (!id) return
      const data = await getEspaciosByTutor(id)

      // Normalizar la respuesta a un arreglo y mapear campos esperados
      let raw = []
      if (Array.isArray(data)) raw = data
      else if (Array.isArray(data.espacios)) raw = data.espacios
      else if (Array.isArray(data.data)) raw = data.data
      else {
        console.warn('Respuesta inesperada al obtener espacios:', data)
      }

      const normalized = raw.map((r) => {
        // alumnos: campo manual desde el modelo (no hay contador automático)
        let alumnosCount = 0
        if (typeof r.alumnos === 'number') alumnosCount = r.alumnos
        else if (typeof r.alumnos === 'string' && !isNaN(Number(r.alumnos))) alumnosCount = Number(r.alumnos)

        // materiales: puede venir como materialesCount desde el backend
        let materialesCount = 0
        if (typeof r.materialesCount === 'number') materialesCount = r.materialesCount
        else if (typeof r.materialesCount === 'string') materialesCount = Number(r.materialesCount)
        else if (Array.isArray(r.materiales)) materialesCount = r.materiales.length
        else if (Array.isArray(r.files)) materialesCount = r.files.length
        else if (typeof r.materiales === 'number') materialesCount = r.materiales

        return {
          id: r.id_espacio ?? r.id ?? r._id ?? null,
          nombre: r.nombre ?? r.name ?? "",
          materia: r.materia ?? r.subject ?? "",
          descripcion: r.descripcion ?? r.descripcion_corta ?? r.description ?? "",
          portada: r.portada ?? r.cover ?? r.image ?? null,
          alumnos: Number(alumnosCount ?? 0),
          capacidad: Number(r.capacidad ?? r.capacity ?? 0),
          materiales: Number(materialesCount ?? 0),
          color: r.color ?? r.bgColor ?? "bg-blue-500",
          estado: r.estado ?? r.active ?? r.activo ?? r.isActive ?? 1,
          _raw: r,
        }
      })

      console.log('Espacios (normalizados):', normalized.map((x) => ({ id: x.id, nombre: x.nombre, alumnos: x.alumnos, materiales: x.materiales })))
      setEspacios(normalized)

      // Guardar ids de espacios en localStorage para referencia posterior
      try {
        const ids = normalized.map((e) => e.id)
        console.log('Espacios obtenidos:', ids)
        if (ids.length) localStorage.setItem('espaciosIds', JSON.stringify(ids))
      } catch (err) {
        console.warn('No se pudo guardar espaciosIds en localStorage', err)
      }
    } catch (err) {
      console.error('Error al obtener espacios:', err)
    }
  }

  const fetchDeletedEspacios = async () => {
    try {
      setLoadingDeleted(true)
      const id = propTutorId ?? user?.id
      if (!id) return
      const data = await getEspaciosByTutor(id, { includeDeleted: true })

      let raw = []
      if (Array.isArray(data)) raw = data
      else if (Array.isArray(data.espacios)) raw = data.espacios
      else if (Array.isArray(data.data)) raw = data.data

      const normalized = raw
        .map((r) => ({
          id: r.id_espacio ?? r.id ?? r._id ?? null,
          nombre: r.nombre ?? r.name ?? "",
          materia: r.materia ?? r.subject ?? "",
          descripcion: r.descripcion ?? r.descripcion_corta ?? r.description ?? "",
          capacidad: Number(r.capacidad ?? r.capacity ?? 0),
          estado: r.estado ?? r.active ?? r.activo ?? r.isActive ?? 1,
        }))
        .filter((r) => r.estado === 0 || r.estado === false || String(r.estado) === "0")

      setDeletedEspacios(normalized)
    } catch (err) {
      console.error('Error al obtener espacios borrados:', err)
      setDeletedEspacios([])
    } finally {
      setLoadingDeleted(false)
    }
  }

  const filteredEspacios = espacios.filter((e) => {
    const nombre = (e.nombre || "").toString().toLowerCase()
    const materia = (e.materia || "").toString().toLowerCase()
    const descripcion = (e.descripcion || "").toString().toLowerCase()
    const term = (searchTerm || "").toLowerCase()
    return nombre.includes(term) || materia.includes(term) || descripcion.includes(term)
  })

  const handleEdit = (espacio) => {
    console.log('Abrir EditEspacioModal para espacio:', espacio)
    setSelectedEspacio(espacio)
    setShowEditModal(true)
  }

  const handleDelete = (espacio) => {
    console.log('Abrir DeleteEspacioModal para espacio:', espacio)
    setSelectedEspacio(espacio)
    setShowDeleteModal(true)
  }

  // handleAddEspacio now se define más abajo y recibe la respuesta del API

  const handleUpdateEspacio = (updated) => {
    console.log('Actualizar espacio local:', updated)
    setEspacios(espacios.map((e) => (e.id === updated.id ? updated : e)))
    setShowEditModal(false)
    showToast?.("Espacio actualizado", "success")
  }

  useEffect(() => {
    fetchEspacios()
  }, [user?.id, propTutorId])

  const handleConfirmDelete = () => {
    const doDelete = async () => {
      try {
        // Llamar a la API para eliminar el espacio
        const { deleteEspacio } = await import("../../../api/espacios.api")
        await deleteEspacio(selectedEspacio.id)
        setEspacios(espacios.filter((e) => e.id !== selectedEspacio.id))
        showToast?.("Espacio eliminado", "success")
      } catch (err) {
        console.error('Error eliminando espacio:', err)
        showToast?.("No se pudo eliminar el espacio", "error")
      } finally {
        setShowDeleteModal(false)
      }
    }

    doDelete()
  }

  const handleAddEspacio = (createdResponse) => {
    // createdResponse puede ser { message, espacio: {...} } o solo el espacio
    let r = createdResponse
    if (!r) {
      setShowAddModal(false)
      return
    }
    if (r.espacio) r = r.espacio

    const normalized = {
      id: r.id_espacio ?? r.id ?? r._id ?? Date.now(),
      nombre: r.nombre ?? r.name ?? "Nuevo Espacio",
      materia: r.materia ?? r.subject ?? "",
      descripcion: r.descripcion ?? r.descripcion_corta ?? r.description ?? "",
      portada: r.portada ?? r.cover ?? r.image ?? null,
      alumnos: Number(r.alumnos ?? 0),
      capacidad: Number(r.capacidad ?? 0),
      materiales: Number(r.materiales ?? 0),
      color: r.color ?? "bg-blue-500",
      estado: r.estado ?? r.active ?? r.activo ?? r.isActive ?? 1,
      _raw: r,
    }

    setEspacios((prev) => [normalized, ...prev])
    setShowAddModal(false)
    showToast?.("Espacio creado", "success")
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Mis Espacios</h2>
            <p className="text-sm text-gray-500 mt-1">Selecciona un espacio para ver sus materiales y asesorías</p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => fetchEspacios()} variant="ghost" size="sm" className="shrink-0">
              <RotateCcw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
            <Button
              onClick={() => {
                fetchDeletedEspacios()
                setShowDeletedModal(true)
              }}
              variant="ghost"
              size="sm"
              className="shrink-0"
            >
              <Archive className="mr-2 h-4 w-4" />
              Espacios borrados
            </Button>
            <Button onClick={() => setShowAddModal(true)} size="sm" className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Crear Espacio
            </Button>
          </div>
        </div>

        {/* Buscador */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Input
            placeholder="Buscar espacios por nombre o materia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon
          />
        </div>

        {/* Grid de tarjetas tipo Classroom */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEspacios.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">
                <p className="text-sm">No se encontraron espacios</p>
                <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
              </div>
            </div>
          ) : (
            filteredEspacios.map((espacio, _idx) => (
              <div
                key={espacio.id ?? `espacio-${_idx}`}
                onClick={() => {
                  try {
                    localStorage.setItem('lastSelectedEspacioId', String(espacio.id))
                  } catch (err) {
                    /* noop */
                  }
                  onSelectEspacio(espacio)
                }}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                {/* Header con portada o color */}
                <div className={`h-24 relative overflow-hidden ${!espacio.portada ? espacio.color : ''}`}>
                  {espacio.portada ? (
                    <img src={espacio.portada} alt={`${espacio.nombre} - portada`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg width="120" height="60" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
                        <rect width="160" height="80" rx="6" fill="#F3F4F6" />
                        <g fill="#9CA3AF">
                          <rect x="12" y="18" width="40" height="28" rx="3" />
                          <rect x="60" y="14" width="88" height="12" rx="2" />
                          <rect x="60" y="32" width="56" height="8" rx="2" />
                        </g>
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(espacio)
                      }}
                      className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm transition-colors"
                    >
                      <Edit className="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(espacio)
                      }}
                      className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">{espacio.nombre}</h3>
                  <p className="text-xs text-gray-500 mb-2">{espacio.materia}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{espacio.descripcion}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 border-t pt-3">
                    <div className="flex items-center gap-1.5">
                      <FolderOpen className="h-4 w-4" />
                      <span>{espacio.materiales} materiales</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modales */}
      {showAddModal && <AddEspacioModal onClose={() => setShowAddModal(false)} onCreated={handleAddEspacio} />}
      {showEditModal && selectedEspacio && (
        <EditEspacioModal
          espacio={selectedEspacio}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateEspacio}
        />
      )}
      {showDeleteModal && selectedEspacio && (
        <DeleteEspacioModal
          espacio={selectedEspacio}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {showDeletedModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Archive className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Espacios borrados</h3>
                <p className="text-sm text-gray-500">Mostrando espacios que fueron eliminados</p>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-200 px-6">
              {loadingDeleted ? (
                <p className="text-sm text-gray-500 py-6 text-center">Cargando...</p>
              ) : deletedEspacios.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">No hay espacios borrados</p>
              ) : (
                deletedEspacios.map((e) => (
                  <div key={e.id} className="py-3 flex items-start gap-3">
                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-semibold uppercase">
                      {String(e.nombre || "?").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 line-clamp-1">{e.nombre}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{e.materia}</p>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">{e.descripcion}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="shrink-0"
                        onClick={async () => {
                          try {
                            await updateEspacio(e.id, { estado: true })
                            setDeletedEspacios((prev) => prev.filter((x) => x.id !== e.id))
                            fetchEspacios()
                            showToast?.("Espacio restaurado", "success")
                          } catch (err) {
                            console.error('Error restaurando espacio:', err)
                            showToast?.("No se pudo restaurar el espacio", "error")
                          }
                        }}
                      >
                        Restaurar
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 flex justify-end px-6 pb-5">
              <Button onClick={() => setShowDeletedModal(false)} variant="ghost" size="sm" className="shrink-0">
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
