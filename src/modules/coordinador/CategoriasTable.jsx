    import { useState } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"

// Componentes básicos
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
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${icon ? 'pl-10' : ''} ${className}`}
      {...props}
    />
  </div>
)

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    active: "bg-blue-600 text-white",
    inactive: "bg-gray-200 text-gray-700",
  }
  
  return (
    <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

// Datos de prueba
const ESPACIOS_MOCK = [
  {
    id_espacio: 1,
    nombre: "Tecnología",
    descripcion: "Equipo de computo y software",
    estado: true,
  },
  {
    id_espacio: 2,
    nombre: "Mobiliario",
    descripcion: "Sillas, mesas y pizarras",
    estado: true,
  },
  {
    id_espacio: 3,
    nombre: "Audiovisual",
    descripcion: "Proyectores y sistemas de sonido",
    estado: true,
  },
  {
    id_espacio: 4,
    nombre: "Laboratorio",
    descripcion: "Equipos de laboratorio y seguridad",
    estado: true,
  },
]

export default function EspaciosTutorPage() {
  const [espacios] = useState(ESPACIOS_MOCK)
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar espacios
  const filteredEspacios = espacios.filter(espacio =>
    espacio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    espacio.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    espacio.edificio?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Gestión de Espacios
            </h1>
            <p className="text-sm text-gray-500">
              Administra los espacios y aulas
            </p>
          </div>
          <Button onClick={() => alert("Nuevo espacio")}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Espacio
          </Button>
        </div>

        {/* Card contenedor */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Buscador */}
          <div className="p-4 border-b border-gray-200">
            <Input
              placeholder="Buscar espacios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon
            />
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
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
                    <tr
                      key={espacio.id_espacio}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {espacio.nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {espacio.descripcion || "Sin descripción"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={espacio.estado ? "active" : "inactive"}>
                          {espacio.estado ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => alert(`Editar: ${espacio.nombre}`)}
                            className="text-gray-600 hover:text-gray-900 p-1"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => alert(`Eliminar: ${espacio.nombre}`)}
                            className="text-gray-600 hover:text-red-600 p-1"
                          >
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
    </div>
  )
}