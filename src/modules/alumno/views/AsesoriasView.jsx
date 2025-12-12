"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Calendar, Clock, MapPin, UsersIcon } from "lucide-react"
import { AddAsesoriaModal } from "../modales/AddAsesoriaModal"
import { DeleteAsesoriaModal } from "../modales/DeleteAsesoriaModal"
import { EditAsesoriaModal } from "../modales/EditAsesoriaModal"
import { AttendanceAsesoriaModal } from "../modales/AttendanceAsesoriaModal"

const Button = ({ children, onClick, variant = "default", size = "default", className = "" }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "hover:bg-gray-100 text-gray-700",
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

// Datos mock
// Removed local mock data; this view should fetch asesorias from backend
const ASESORIAS_MOCK = [] // Initialize empty array for asesorias

export default function AsesoriasView() {
  const [asesorias, setAsesorias] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAsesoria, setSelectedAsesoria] = useState(null)

  const filteredAsesorias = asesorias.filter(
    (a) =>
      a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.materia.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (asesoria) => {
    setSelectedAsesoria(asesoria)
    setShowEditModal(true)
  }

  const handleAddAsesoria = (newAsesoria) => {
    setAsesorias([...asesorias, { ...newAsesoria, id: Date.now(), asistentes: 0, estado: "programada" }])
    setShowAddModal(false)
  }

  const handleUpdateAsesoria = (updated) => {
    setAsesorias(asesorias.map((a) => (a.id === updated.id ? updated : a)))
    setShowEditModal(false)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Asesorías</h2>
            <p className="text-sm text-gray-500">Gestiona tus sesiones de asesoría</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Asesoría
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Input
            placeholder="Buscar asesorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon
          />
        </div>

        {/* Timeline de asesorías */}
        <div className="space-y-3">
          {filteredAsesorias.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-gray-500">
                <p className="text-sm">No se encontraron asesorías</p>
                <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
              </div>
            </div>
          ) : (
            filteredAsesorias.map((asesoria) => (
              <div
                key={asesoria.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{asesoria.titulo}</h3>
                          <p className="text-xs text-gray-500">{asesoria.materia}</p>
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
                            {asesoria.hora}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageCircle className="h-4 w-4" />
                          <span>{asesoria.motivo}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {asesoria.estado === "programada" && (
                        <button
                          onClick={() => handleAttendance(asesoria)}
                          className="text-gray-600 hover:text-blue-600 p-2 hover:bg-gray-100 rounded transition-colors"
                          title="Tomar asistencia"
                        >
                          <UsersIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(asesoria)}
                        className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(asesoria)}
                        className="text-gray-600 hover:text-red-600 p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modales */}
      {showAddModal && <AddAsesoriaModal onClose={() => setShowAddModal(false)} onAdd={handleAddAsesoria} />}
      {showEditModal && selectedAsesoria && (
        <EditAsesoriaModal
          asesoria={selectedAsesoria}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateAsesoria}
        />
      )}
    </>
  )
}
