import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, AlertCircle, Loader2 } from "lucide-react"
import { AddCoordinadorModal } from "../modales/AddCoordinadorModal"
import { EditCoordinadorModal } from "../modales/EditCoordinadorModal"
import { DeleteConfirmModal } from "../modales/DeleteConfirmModal"
import { 
  getCoordinadores, 
  createCoordinador, 
  updateCoordinador, 
  deleteCoordinador 
} from "../../../api/coordinadores.api"

// Componentes UI
const Button = ({ children, onClick, variant = "default", size = "sm", className = "", disabled = false }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "hover:bg-gray-100 text-gray-700",
  }
  const sizes = {
    sm: "px-3 py-2 text-sm",
    xs: "px-2 py-1 text-xs",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
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

// Componente de alerta de error
const ErrorAlert = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-red-800">Error al cargar coordinadores</h3>
      <p className="text-sm text-red-600 mt-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium underline"
        >
          Intentar nuevamente
        </button>
      )}
    </div>
  </div>
)

// Componente de carga
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
    <p className="text-sm text-gray-500 mt-2">Cargando coordinadores...</p>
  </div>
)

export default function CoordinadoresTable() {
  const [coordinadores, setCoordinadores] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCoordinador, setSelectedCoordinador] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Cargar coordinadores al montar el componente
  useEffect(() => {
    loadCoordinadores()
  }, [])

  const loadCoordinadores = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getCoordinadores()
      setCoordinadores(data)
    } catch (err) {
      console.error("Error al cargar coordinadores:", err)
      setError(err.response?.data?.message || "Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  // Filtrar coordinadores
  const filteredCoordinadores = coordinadores.filter(coord => {
    const searchLower = searchTerm.toLowerCase()
    const fullName = `${coord.nombre || ''} ${coord.apellido_paterno || ''} ${coord.apellido_materno || ''}`.toLowerCase()
    return (
      fullName.includes(searchLower) ||
      (coord.email || '').toLowerCase().includes(searchLower) ||
      (coord.telefono || '').includes(searchTerm)
    )
  })

  const handleEdit = (coordinador) => {
    setSelectedCoordinador(coordinador)
    setShowEditModal(true)
  }

  const handleDelete = (coordinador) => {
    setSelectedCoordinador(coordinador)
    setShowDeleteModal(true)
  }

  const handleAddCoordinador = async (newCoordinadorData) => {
    try {
      setActionLoading(true)
      const newCoordinador = await createCoordinador(newCoordinadorData)
      setCoordinadores([...coordinadores, newCoordinador])
      setShowAddModal(false)
    } catch (err) {
      console.error("Error al crear coordinador:", err)
      alert(err.response?.data?.message || "Error al crear coordinador")
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateCoordinador = async (updatedCoordinadorData) => {
    try {
      setActionLoading(true)
      const updated = await updateCoordinador(selectedCoordinador.id_usuario, updatedCoordinadorData)
      setCoordinadores(coordinadores.map(c =>
        c.id_usuario === selectedCoordinador.id_usuario ? updated : c
      ))
      setShowEditModal(false)
    } catch (err) {
      console.error("Error al actualizar coordinador:", err)
      alert(err.response?.data?.message || "Error al actualizar coordinador")
    } finally {
      setActionLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true)
      await deleteCoordinador(selectedCoordinador.id_usuario)
      setCoordinadores(coordinadores.filter(c => c.id_usuario !== selectedCoordinador.id_usuario))
      setShowDeleteModal(false)
      setSelectedCoordinador(null)
    } catch (err) {
      console.error("Error al eliminar coordinador:", err)
      alert(err.response?.data?.message || "Error al eliminar coordinador")
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Gestión de Coordinadores
            </h2>
            <p className="text-sm text-gray-500">
              Administra los coordinadores del sistema
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Coordinador
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <ErrorAlert 
            message={error} 
            onRetry={loadCoordinadores}
          />
        )}

        {/* Buscador */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Input
            placeholder="Buscar coordinadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon
            disabled={loading}
          />
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <table className="w-full text-center">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Correo
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCoordinadores.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <p className="text-sm">
                            {searchTerm 
                              ? "No se encontraron coordinadores con esos criterios"
                              : "No hay coordinadores registrados"
                            }
                          </p>
                          {!searchTerm && (
                            <p className="text-xs mt-1">Agrega el primer coordinador usando el botón superior</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCoordinadores.map((coordinador) => (
                      <tr
                        key={coordinador.id_usuario}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {coordinador.nombre} {coordinador.apellido_paterno} {coordinador.apellido_materno || ''}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{coordinador.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {coordinador.telefono || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              coordinador.estado 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {coordinador.estado ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(coordinador)}
                              className="text-gray-600 hover:text-gray-900 p-1 disabled:opacity-50"
                              disabled={actionLoading}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(coordinador)}
                              className="text-gray-600 hover:text-red-600 p-1 disabled:opacity-50"
                              disabled={actionLoading}
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
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      {showAddModal && (
        <AddCoordinadorModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCoordinador}
          loading={actionLoading}
        />
      )}

      {showEditModal && selectedCoordinador && (
        <EditCoordinadorModal
          coordinador={selectedCoordinador}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateCoordinador}
          loading={actionLoading}
        />
      )}

      {showDeleteModal && selectedCoordinador && (
        <DeleteConfirmModal
          coordinador={selectedCoordinador}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          loading={actionLoading}
        />
      )}
    </>
  )
}