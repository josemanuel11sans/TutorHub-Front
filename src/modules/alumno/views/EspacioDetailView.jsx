"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  FolderOpen,
  Eye,
} from "lucide-react"
import { AddAsesoriaModal } from "../modales/AddAsesoriaModal"
import { DeleteAsesoriaModal } from "../modales/DeleteAsesoriaModal"
import { EditAsesoriaModal } from "../modales/EditAsesoriaModal"
import { AttendanceAsesoriaModal } from "../modales/AttendanceAsesoriaModal"
import { useToast } from "../../../context/ToastContext"

const Button = ({ children, onClick, variant = "default", size = "default", className = "" }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "hover:bg-gray-100 text-gray-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
  }
  const sizes = {
    default: "px-4 py-2",
    sm: "px-2 py-1 text-sm",
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  )
}

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-500",
    pdf: "bg-red-100 text-red-800",
    ppt: "bg-orange-100 text-orange-800",
    doc: "bg-blue-100 text-blue-800",
    programada: "bg-blue-100 text-blue-800",
    completada: "bg-green-100 text-green-800",
    cancelada: "bg-red-100 text-red-800",
    default: "bg-gray-200 text-gray-700",
  }

  return (
    <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

// NOTE: removed local mock data — materiales and asesorias should come from backend

export default function EspacioDetailView({ espacio, onBack, initialOpenAddMaterial = false }) {
  const [materiales, setMateriales] = useState([])
  const [asesorias, setAsesorias] = useState([])
  const toast = useToast()

  useEffect(() => {
    console.log('EspacioDetailView mounted or espacio changed:', espacio)
    // Obtener materiales del espacio desde la API
    const fetchMateriales = async () => {
      try {
        if (!espacio?.id) return
        const { getFilesByEspacio } = await import("../../../api/claudinary.api")
        const files = await getFilesByEspacio(espacio.id)
        // Normalizar a la estructura usada localmente
        const normalized = (Array.isArray(files) ? files : []).map((f) => {
          const mt = (f.mimetype || "").toLowerCase()
          let tipo_archivo = "OTRO"
          if (mt.includes("pdf")) tipo_archivo = "PDF"
          else if (mt.includes("presentation") || mt.includes("powerpoint") || (f.originalName || "").toLowerCase().endsWith(".ppt") || (f.originalName || "").toLowerCase().endsWith(".pptx")) tipo_archivo = "PPT"
          else if (mt.includes("word") || (f.originalName || "").toLowerCase().endsWith(".doc") || (f.originalName || "").toLowerCase().endsWith(".docx")) tipo_archivo = "DOC"
          else if (mt.includes("image")) tipo_archivo = "IMG"

          return {
            id: f.id,
            nombre: f.originalName || f.publicId || "Archivo",
            espacioId: f.espacioId ?? f.espacio ?? espacio.id,
            tipo_archivo,
            estado: true,
            fecha: f.createdAt ? f.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
            url: f.url,
            _raw: f,
          }
        })

        setMateriales(normalized)
      } catch (err) {
        console.error('Error al obtener materiales del espacio:', err)
      }
    }

    fetchMateriales()
  }, [espacio])

  // Asesoria modals
  const [showAddAsesoriaModal, setShowAddAsesoriaModal] = useState(false)
  const [showEditAsesoriaModal, setShowEditAsesoriaModal] = useState(false)
  const [showDeleteAsesoriaModal, setShowDeleteAsesoriaModal] = useState(false)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [selectedAsesoria, setSelectedAsesoria] = useState(null)

  // Filtrar por espacio actual
  const espacioMateriales = materiales.filter((m) => m.espacioId === espacio.id)
  const espacioAsesorias = asesorias.filter((a) => a.espacioId === espacio.id)

  const getFileBadgeVariant = (tipo) => {
    if (tipo === "PDF") return "pdf"
    if (tipo === "PPT") return "ppt"
    if (tipo === "DOC") return "doc"
    return "default"
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header con botón de regreso */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a espacios
          </Button>
        </div>

        {/* Banner del espacio */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="relative h-40 overflow-hidden">
            {espacio.portada ? (
              <img src={espacio.portada} alt={`${espacio.nombre} - portada`} className="w-full h-40 object-cover" />
            ) : (
              <div className={`${espacio.color} w-full h-40 flex items-center justify-center`}>
                <svg width="160" height="80" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
                  <rect width="160" height="80" rx="6" fill="#E5E7EB" />
                  <g fill="#9CA3AF">
                    <rect x="12" y="18" width="40" height="28" rx="3" />
                    <rect x="60" y="14" width="88" height="12" rx="2" />
                    <rect x="60" y="32" width="56" height="8" rx="2" />
                  </g>
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{espacio.nombre}</h1>
                <p className="text-sm text-gray-500 mb-4">{espacio.materia}</p>
                <p className="text-gray-600">{espacio.descripcion}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{espacio.alumnos}</div>
                <div className="text-xs text-gray-500">de {espacio.capacidad} alumnos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{espacioMateriales.length}</div>
                <div className="text-sm text-gray-500">Materiales publicados</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{espacioAsesorias.length}</div>
                <div className="text-sm text-gray-500">Asesorías programadas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles (muestra todos los datos del espacio) */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Detalles del espacio</h2>
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2 text-sm text-gray-700">
            {Object.entries(espacio._raw || espacio).map(([k, v]) => {
              let display = v
              try {
                if (v === null || v === undefined) display = "-"
                else if (typeof v === "object") display = JSON.stringify(v)
                else display = String(v)
              } catch (err) {
                display = "(no disponible)"
              }

              // Truncar si es muy largo
              if (typeof display === "string" && display.length > 200) display = display.slice(0, 200) + "..."

              return (
                <div key={k} className="flex items-start gap-2">
                  <div className="w-36 text-gray-500 capitalize">{k.replace(/_/g, " ")}</div>
                  <div className="flex-1 break-words">{display}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sección de Materiales */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Materiales</h2>
          </div>

          <div className="space-y-3">
            {espacioMateriales.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FolderOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No hay materiales publicados</p>
                <p className="text-xs mt-1">Publica el primer material para este espacio</p>
              </div>
            ) : (
              espacioMateriales.map((material) => (
                  <div
                    key={material.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{material.nombre}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <span className="text-xs">{material.fecha}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getFileBadgeVariant(material.tipo_archivo)}>{material.tipo_archivo}</Badge>
                          <Badge variant={material.estado ? "active" : "inactive"}>
                            {material.estado ? "Publicado" : "Borrador"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Visualizar si es PDF o imagen */}
                      {(material.tipo_archivo === "PDF" || material.tipo_archivo === "IMG") && (
                        <a
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Visualizar"
                          className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={async () => {
                          // eliminar el archivo en backend
                          try {
                            const { deleteFile } = await import("../../../api/claudinary.api")
                            await deleteFile(material.id)
                            setMateriales((prev) => prev.filter((m) => m.id !== material.id))
                            try { toast?.showToast?.('Archivo eliminado', 'success') } catch (e) { console.warn(e) }
                          } catch (err) {
                            console.error('Error eliminando archivo:', err)
                            try { toast?.showToast?.('No se pudo eliminar el archivo', 'error') } catch (e) { console.warn(e) }
                          }
                        }}
                        className="text-gray-600 hover:text-red-600 p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sección de Asesorías */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Asesorías</h2>
            <Button onClick={() => setShowAddAsesoriaModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Asesoría
            </Button>
          </div>

          <div className="space-y-3">
            {espacioAsesorias.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No hay asesorías programadas</p>
                <p className="text-xs mt-1">Programa la primera asesoría para este espacio</p>
              </div>
            ) : (
              espacioAsesorias.map((asesoria) => (
                <div
                  key={asesoria.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{asesoria.titulo}</h3>
                        </div>
                        <Badge variant={asesoria.estado}>
                          {asesoria.estado === "programada"
                            ? "Programada"
                            : asesoria.estado === "completada"
                              ? "Completada"
                              : "Cancelada"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{asesoria.fecha}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>
                            {asesoria.hora} ({asesoria.duracion})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          <span>{asesoria.lugar}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4" />
                          <span>{asesoria.asistentes} inscritos</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {asesoria.estado === "programada" && (
                        <button
                          onClick={() => {
                            setSelectedAsesoria(asesoria)
                            setShowAttendanceModal(true)
                          }}
                          className="text-gray-600 hover:text-blue-600 p-2 hover:bg-gray-100 rounded transition-colors"
                          title="Tomar asistencia"
                        >
                          <Users className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedAsesoria(asesoria)
                          setShowEditAsesoriaModal(true)
                        }}
                        className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAsesoria(asesoria)
                          setShowDeleteAsesoriaModal(true)
                        }}
                        className="text-gray-600 hover:text-red-600 p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Asesoria Modals */}
      {showAddAsesoriaModal && (
        <AddAsesoriaModal
          onClose={() => setShowAddAsesoriaModal(false)}
          onAdd={(newAsesoria) => {
            setAsesorias([
              ...asesorias,
              { ...newAsesoria, id: Date.now(), espacioId: espacio.id, asistentes: 0, estado: "programada" },
            ])
            setShowAddAsesoriaModal(false)
          }}
        />
      )}
      {showEditAsesoriaModal && selectedAsesoria && (
        <EditAsesoriaModal
          asesoria={selectedAsesoria}
          onClose={() => setShowEditAsesoriaModal(false)}
          onUpdate={(updated) => {
            setAsesorias(asesorias.map((a) => (a.id === updated.id ? updated : a)))
            setShowEditAsesoriaModal(false)
          }}
        />
      )}
      {showDeleteAsesoriaModal && selectedAsesoria && (
        <DeleteAsesoriaModal
          asesoria={selectedAsesoria}
          onClose={() => setShowDeleteAsesoriaModal(false)}
          onConfirm={() => {
            setAsesorias(asesorias.filter((a) => a.id !== selectedAsesoria.id))
            setShowDeleteAsesoriaModal(false)
          }}
        />
      )}
      {showAttendanceModal && selectedAsesoria && (
        <AttendanceAsesoriaModal asesoria={selectedAsesoria} onClose={() => setShowAttendanceModal(false)} />
      )}
    </>
  )
}