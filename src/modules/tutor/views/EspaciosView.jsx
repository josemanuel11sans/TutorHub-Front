"use client"

import { useState, useEffect, useContext } from "react"
import { Search, Plus, Edit, Trash2, Users, FolderOpen } from "lucide-react"
import  {AddEspacioModal}   from "../modales/AddEspacioModal"
import { DeleteEspacioModal } from "../modales/DeleteEspacioModal"
import { EditEspacioModal } from "../modales/EditEspacioModal"
import { AuthContext } from "../../../context/AuthContext"
import { getEspaciosByTutor } from "../../../api/espacios.api"

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

// Datos mock
const ESPACIOS_MOCK = [
  {
    id: 1,
    nombre: "Desarrollo Web Avanzado",
    materia: "Desarrollo Web",
    descripcion: "Curso de React y Next.js",
    capacidad: 30,
    alumnos: 28,
    materiales: 12,
    color: "bg-blue-500",
  },
  {
    id: 2,
    nombre: "Bases de Datos II",
    materia: "Bases de Datos",
    descripcion: "PostgreSQL y diseño avanzado",
    capacidad: 35,
    alumnos: 32,
    materiales: 8,
    color: "bg-green-500",
  },
  {
    id: 3,
    nombre: "Arquitectura de Software",
    materia: "Arquitectura",
    descripcion: "Patrones y mejores prácticas",
    capacidad: 25,
    alumnos: 20,
    materiales: 15,
    color: "bg-purple-500",
  },
  {
    id: 4,
    nombre: "Programación Funcional",
    materia: "Programación",
    descripcion: "Paradigma funcional con ejemplos",
    capacidad: 30,
    alumnos: 25,
    materiales: 10,
    color: "bg-orange-500",
  },
  {
    id: 5,
    nombre: "Machine Learning Básico",
    materia: "IA",
    descripcion: "Introducción a ML",
    capacidad: 20,
    alumnos: 18,
    materiales: 9,
    color: "bg-pink-500",
  },
]

export default function EspaciosView({ onSelectEspacio, tutorId: propTutorId }) {
  const { user } = useContext(AuthContext)
  const [espacios, setEspacios] = useState(ESPACIOS_MOCK)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedEspacio, setSelectedEspacio] = useState(null)

  const filteredEspacios = espacios.filter(
    (e) =>
      e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (espacio) => {
    setSelectedEspacio(espacio)
    setShowEditModal(true)
  }

  const handleDelete = (espacio) => {
    setSelectedEspacio(espacio)
    setShowDeleteModal(true)
  }

  const handleAddEspacio = (newEspacio) => {
    setEspacios([...espacios, { ...newEspacio, id: Date.now(), alumnos: 0, materiales: 0, color: "bg-blue-500" }])
    setShowAddModal(false)
  }

  const handleUpdateEspacio = (updated) => {
    setEspacios(espacios.map((e) => (e.id === updated.id ? updated : e)))
    setShowEditModal(false)
  }

  useEffect(() => {
    const fetchEspacios = async () => {
      try {
        const id = propTutorId ?? user?.id
        if (!id) return
        const data = await getEspaciosByTutor(id)
        // Si el backend devuelve un objeto con property 'espacios', manejarlo
        if (Array.isArray(data)) setEspacios(data)
        else if (Array.isArray(data.espacios)) setEspacios(data.espacios)
        else if (Array.isArray(data.data)) setEspacios(data.data)
        else console.warn('Respuesta inesperada al obtener espacios:', data)
      } catch (err) {
        console.error('Error al obtener espacios:', err)
      }
    }

    fetchEspacios()
  }, [user?.id, propTutorId])

  const handleConfirmDelete = () => {
    setEspacios(espacios.filter((e) => e.id !== selectedEspacio.id))
    setShowDeleteModal(false)
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

          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Espacio
          </Button>
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
            filteredEspacios.map((espacio) => (
              <div
                key={espacio.id}
                onClick={() => onSelectEspacio(espacio)}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                {/* Header con color */}
                <div className={`${espacio.color} h-24 relative`}>
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
                      <Users className="h-4 w-4" />
                      <span>
                        {espacio.alumnos}/{espacio.capacidad}
                      </span>
                    </div>
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
      {showAddModal && <AddEspacioModal onClose={() => setShowAddModal(false)} onAdd={handleAddEspacio} />}
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
    </>
  )
}
