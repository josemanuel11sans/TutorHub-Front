"use client"

import { useState } from "react"
import { Search, Plus, Trash2, BookOpen } from "lucide-react"
import { AddMateriaModal } from "../modales/AddMateriaModal "
import { DeleteMateriaModal } from "../modales/DeleteMateriaModal"

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

// Datos de prueba
const MATERIAS_MOCK = [
  { id: 1, nombre: "Desarrollo Web", espacios: 2, estado: true },
  { id: 2, nombre: "Bases de Datos", espacios: 1, estado: true },
  { id: 3, nombre: "Arquitectura de Software", espacios: 1, estado: true },
  { id: 4, nombre: "Programación Funcional", espacios: 1, estado: true },
  { id: 5, nombre: "Machine Learning", espacios: 1, estado: false },
]

export default function MateriasView() {
  const [materias, setMaterias] = useState(MATERIAS_MOCK)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMateria, setSelectedMateria] = useState(null)

  const filteredMaterias = materias.filter((m) => m.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleDelete = (materia) => {
    setSelectedMateria(materia)
    setShowDeleteModal(true)
  }

  const handleAddMateria = (newMateria) => {
    setMaterias([...materias, { ...newMateria, id: Date.now(), espacios: 0, estado: true }])
    setShowAddModal(false)
  }

  const handleConfirmDelete = () => {
    setMaterias(materias.filter((m) => m.id !== selectedMateria.id))
    setShowDeleteModal(false)
    setSelectedMateria(null)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Materias que Imparto</h2>
            <p className="text-sm text-gray-500">Las materias que puedes asignar a tus espacios</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Materia
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Input
            placeholder="Buscar materias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon
          />
        </div>

        {/* Grid de materias */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterias.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-gray-500">
                <p className="text-sm">No se encontraron materias</p>
                <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
              </div>
            </div>
          ) : (
            filteredMaterias.map((materia) => (
              <div
                key={materia.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-900">{materia.nombre}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(materia)}
                    className="text-gray-600 hover:text-red-600 p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {materia.espacios} {materia.espacios === 1 ? "espacio" : "espacios"}
                  </p>
                  <Badge variant={materia.estado ? "active" : "inactive"}>
                    {materia.estado ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modales */}
      {showAddModal && <AddMateriaModal onClose={() => setShowAddModal(false)} onAdd={handleAddMateria} />}
      {showDeleteModal && selectedMateria && (
        <DeleteMateriaModal
          materia={selectedMateria}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  )
}
