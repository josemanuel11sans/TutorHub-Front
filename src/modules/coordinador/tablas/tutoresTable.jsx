import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { useToast } from "../../../context/ToastContext"
import { AddTutorModal } from "../modales/AddTutorModal"
import { EditTutorModal } from "../modales/EditTutorModal"
import { DeleteConfirmModal } from "../modales/DeleteConfirmModal"
import { 
  getTutores, 
  createTutor, 
  updateTutor, 
  deleteTutor 
} from "../../../api/tutores.api"

// Componentes UI reutilizables
const Button = ({ children, onClick, variant = "default", size = "sm", className = "", disabled = false }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "hover:bg-gray-100 text-gray-700",
  }
  const sizes = {
    sm: "px-2 py-1 text-xs",
    xs: "px-1.5 py-0.5 text-[10px]",
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

const ErrorAlert = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-red-800">Error al cargar tutores</h3>
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

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
    <p className="text-sm text-gray-500 mt-2">Cargando tutores...</p>
  </div>
)

export default function TutoresTable() {
  const [tutores, setTutores] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTutor, setSelectedTutor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState("todos") // todos | activos | inactivos
  const toast = useToast()

  // Cargar tutores al montar el componente
  useEffect(() => {
    loadTutores()
  }, [])

  const loadTutores = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTutores()
      setTutores(data)
    } catch (err) {
      console.error("Error al cargar tutores:", err)
      setError(err.response?.data?.message || "Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  // Filtrar tutores por texto + estado
  const filteredTutores = tutores.filter(tutor => {
    const searchLower = searchTerm.toLowerCase()
    const fullName = `${tutor.nombre || ''} ${tutor.apellido_paterno || ''} ${tutor.apellido_materno || ''}`.toLowerCase()
    const matchesSearch = (
      fullName.includes(searchLower) ||
      (tutor.email || '').toLowerCase().includes(searchLower) ||
      (tutor.telefono || '').includes(searchTerm)
    )
    const matchesStatus = (
      statusFilter === 'todos' ||
      (statusFilter === 'activos' && tutor.estado === true) ||
      (statusFilter === 'inactivos' && tutor.estado === false)
    )
    return matchesSearch && matchesStatus
  })

  const handleEdit = (tutor) => {
    setSelectedTutor(tutor)
    setShowEditModal(true)
  }

  const handleDelete = (tutor) => {
    setSelectedTutor(tutor)
    setShowDeleteModal(true)
  }

  const handleAddTutor = async (newTutorData) => {
    try {
      setActionLoading(true)
      const newTutor = await createTutor(newTutorData)
      setTutores([...tutores, newTutor])
      setShowAddModal(false)
      try { toast?.showToast?.("Tutor agregado correctamente", "success") } catch (e) { console.warn(e) }
    } catch (err) {
      console.error("Error al crear tutor:", err)
      const errorMsg = err.response?.data?.message || "Error al crear tutor"
      try { toast?.showToast?.(errorMsg, "error") } catch (e) { console.warn(e) }
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateTutor = async (updatedTutorData) => {
    try {
      setActionLoading(true)
      const updated = await updateTutor(selectedTutor.id_usuario, updatedTutorData)
      setTutores(tutores.map(t =>
        t.id_usuario === selectedTutor.id_usuario ? updated : t
      ))
      setShowEditModal(false)
      try { toast?.showToast?.("Tutor actualizado correctamente", "success") } catch (e) { console.warn(e) }
    } catch (err) {
      console.error("Error al actualizar tutor:", err)
      const errorMsg = err.response?.data?.message || "Error al actualizar tutor"
      try { toast?.showToast?.(errorMsg, "error") } catch (e) { console.warn(e) }
    } finally {
      setActionLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true)
      // Alternar el estado: si está activo, desactivar; si está inactivo, activar
      const nuevoEstado = !selectedTutor.estado
      await deleteTutor(selectedTutor.id_usuario)
      setTutores(tutores.map(t =>
        t.id_usuario === selectedTutor.id_usuario ? { ...t, estado: nuevoEstado } : t
      ))
      setShowDeleteModal(false)
      setSelectedTutor(null)
      const mensaje = nuevoEstado ? "Tutor reactivado correctamente" : "Tutor desactivado correctamente"
      try { toast?.showToast?.(mensaje, "success") } catch (e) { console.warn(e) }
    } catch (err) {
      console.error("Error al cambiar estado del tutor:", err)
      const errorMsg = err.response?.data?.message || "Error al cambiar estado del tutor"
      try { toast?.showToast?.(errorMsg, "error") } catch (e) { console.warn(e) }
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
              Gestión de Tutores
            </h2>
            <p className="text-sm text-gray-500">
              Administra los tutores del sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadTutores} variant="ghost" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
            <Button onClick={() => setShowAddModal(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tutor
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <ErrorAlert 
            message={error} 
            onRetry={loadTutores}
          />
        )}

        {/* Buscador + Filtro estado */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <Input
                placeholder="Buscar tutores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon
                disabled={loading}
              />
            </div>
            <div className="w-full sm:w-56">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="todos">Estado</option>
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
              </select>
            </div>
          </div>
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
                  {filteredTutores.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <p className="text-sm">
                            {searchTerm 
                              ? "No se encontraron tutores con esos criterios"
                              : "No hay tutores registrados"
                            }
                          </p>
                          {!searchTerm && (
                            <p className="text-xs mt-1">Agrega el primer tutor usando el botón superior</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTutores.map((tutor) => (
                      <tr
                        key={tutor.id_usuario}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {tutor.nombre} {tutor.apellido_paterno} {tutor.apellido_materno || ''}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{tutor.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {tutor.telefono || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              tutor.estado 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {tutor.estado ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(tutor)}
                              className="text-gray-600 hover:text-gray-900 p-1 disabled:opacity-50"
                              disabled={actionLoading}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(tutor)}
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
        <AddTutorModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddTutor}
          loading={actionLoading}
        />
      )}

      {showEditModal && selectedTutor && (
        <EditTutorModal
          tutor={selectedTutor}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateTutor}
          loading={actionLoading}
        />
      )}

      {showDeleteModal && selectedTutor && (
        <DeleteConfirmModal
          title="Eliminar Tutor"
          message={`¿Estás seguro de que deseas cambiarle el estado al tutor ${selectedTutor.nombre} ${selectedTutor.apellido}?`}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          loading={actionLoading}
        />
      )}
    </>
  )
}