import { useState } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { AddEspacioModal } from "../modales/AddEspacioModal"
import { DeleteEspacioModal } from "../modales/DeleteEspacioModal"
import { EditEspacioModal } from "../modales/EditEspacioModal"

// Componentes base (mismos estilos que AsesoriasTable)
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
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

const Input = ({ className = "", icon, ...props }) => (
  <div className="relative w-full">
    {icon && (
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    )}
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
  { id: 1, nombre: "Aula 101", descripcion: "Aula de clases general", edificio: "Edificio A", capacidad: 30, estado: true },
  { id: 2, nombre: "Aula 102", descripcion: "Aula de clases general", edificio: "Edificio A", capacidad: 35, estado: true },
  { id: 3, nombre: "Lab. Computación", descripcion: "Laboratorio con 25 equipos", edificio: "Edificio B", capacidad: 25, estado: true },
  { id: 4, nombre: "Sala Conferencias", descripcion: "Sala para eventos grandes", edificio: "Edificio A", capacidad: 100, estado: true },
  { id: 5, nombre: "Biblioteca", descripcion: "Sala de lectura", edificio: "Edificio C", capacidad: 50, estado: true },
]

export default function EspaciosTutorPage() {
  const [espacios, setEspacios] = useState(ESPACIOS_MOCK)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedEspacio, setSelectedEspacio] = useState(null)

  const filteredEspacios = espacios.filter(e =>
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.edificio.toLowerCase().includes(searchTerm.toLowerCase())
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
    setEspacios([...espacios, { ...newEspacio, id: Date.now() }])
    setShowAddModal(false)
  }

  const handleUpdateEspacio = (updated) => {
    setEspacios(espacios.map(e => e.id === updated.id ? updated : e))
    setShowEditModal(false)
  }

  const handleConfirmDelete = () => {
    setEspacios(espacios.filter(e => e.id !== selectedEspacio.id))
    setShowDeleteModal(false)
  }

  return (
    <>
      <div className="space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Gestión de Espacios</h2>
            <p className="text-sm text-gray-500">Administra los espacios del sistema</p>
          </div>

          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Espacio
          </Button>
        </div>

        {/* Buscador */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Input
            placeholder="Buscar espacios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon
          />
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Capacidad</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEspacios.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <p className="text-sm">No se encontraron espacios</p>
                        <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEspacios.map((espacio) => (
                    <tr key={espacio.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {espacio.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {espacio.descripcion}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {espacio.capacidad} personas
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={espacio.estado ? "active" : "inactive"}>
                          {espacio.estado ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(espacio)} className="text-gray-600 hover:text-gray-900 p-1">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(espacio)} className="text-gray-600 hover:text-red-600 p-1">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modales — sin activar, igual que Asesorías */}
      {showAddModal && <AddEspacioModal onClose={() => setShowAddModal(false)} onAdd={handleAddEspacio} />}
      {showEditModal && selectedEspacio && <EditEspacioModal espacio={selectedEspacio} onClose={() => setShowEditModal(false)} onUpdate={handleUpdateEspacio} />}
      {showDeleteModal && selectedEspacio && <DeleteEspacioModal espacio={selectedEspacio} onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} />}
    </>
  )
}
