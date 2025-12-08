"use client"

import { useState } from "react"
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
} from "lucide-react"
import { AddMaterialModal } from "../modales/AddMaterialModal"
import { DeleteMaterialModal } from "../modales/DeleteMaterialModal"
import { EditMaterialModal } from "../modales/EditMaterialModal"
import  {AddAsesoriaModal}  from "../modales/AddAsesoriaModal"
import { DeleteAsesoriaModal } from "../modales/DeleteAsesoriaModal"
import { EditAsesoriaModal } from "../modales/EditAsesoriaModal"
import { AttendanceAsesoriaModal } from "../modales/AttendanceAsesoriaModal"

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

// Mock data filtrado por espacio
const MATERIALES_MOCK = [
  {
    id: 1,
    nombre: "Introducción a React Hooks",
    espacioId: 1,
    tipo_archivo: "PDF",
    estado: true,
    fecha: "2024-01-15",
  },
  {
    id: 2,
    nombre: "Patrones de diseño en JavaScript",
    espacioId: 1,
    tipo_archivo: "PPT",
    estado: true,
    fecha: "2024-01-12",
  },
  {
    id: 3,
    nombre: "Next.js Server Components",
    espacioId: 1,
    tipo_archivo: "PDF",
    estado: true,
    fecha: "2024-01-10",
  },
]

const ASESORIAS_MOCK = [
  {
    id: 1,
    titulo: "Dudas sobre React Hooks",
    fecha: "2024-01-20",
    hora: "10:00",
    duracion: "1h",
    lugar: "Aula 101",
    espacioId: 1,
    asistentes: 8,
    estado: "programada",
  },
  {
    id: 2,
    titulo: "Revisión de proyectos finales",
    fecha: "2024-01-22",
    hora: "14:00",
    duracion: "2h",
    lugar: "Lab. Computación",
    espacioId: 1,
    asistentes: 12,
    estado: "programada",
  },
]

export default function EspacioDetailView({ espacio, onBack }) {
  const [materiales, setMateriales] = useState(MATERIALES_MOCK)
  const [asesorias, setAsesorias] = useState(ASESORIAS_MOCK)

  // Material modals
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false)
  const [showEditMaterialModal, setShowEditMaterialModal] = useState(false)
  const [showDeleteMaterialModal, setShowDeleteMaterialModal] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)

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
          <div className={`${espacio.color} h-32 relative`}>
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

        {/* Sección de Materiales */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Materiales</h2>
            <Button onClick={() => setShowAddMaterialModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Publicar Material
            </Button>
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
                      <button
                        onClick={() => {
                          setSelectedMaterial(material)
                          setShowEditMaterialModal(true)
                        }}
                        className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMaterial(material)
                          setShowDeleteMaterialModal(true)
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

      {/* Material Modals */}
      {showAddMaterialModal && (
        <AddMaterialModal
          onClose={() => setShowAddMaterialModal(false)}
          onAdd={(newMaterial) => {
            setMateriales([
              ...materiales,
              { ...newMaterial, id: Date.now(), espacioId: espacio.id, fecha: new Date().toISOString().split("T")[0] },
            ])
            setShowAddMaterialModal(false)
          }}
        />
      )}
      {showEditMaterialModal && selectedMaterial && (
        <EditMaterialModal
          material={selectedMaterial}
          onClose={() => setShowEditMaterialModal(false)}
          onUpdate={(updated) => {
            setMateriales(materiales.map((m) => (m.id === updated.id ? updated : m)))
            setShowEditMaterialModal(false)
          }}
        />
      )}
      {showDeleteMaterialModal && selectedMaterial && (
        <DeleteMaterialModal
          material={selectedMaterial}
          onClose={() => setShowDeleteMaterialModal(false)}
          onConfirm={() => {
            setMateriales(materiales.filter((m) => m.id !== selectedMaterial.id))
            setShowDeleteMaterialModal(false)
          }}
        />
      )}

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
