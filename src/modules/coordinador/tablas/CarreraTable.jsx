import { useState, useEffect } from "react"
import { Search, Plus, Edit, AlertCircle, Loader2, RefreshCw, RotateCcw } from "lucide-react"
import { useToast } from "../../../context/ToastContext"
import { AddCarrerModal } from "../modales/AddCarrerModal"
import { EditCarreraModal } from "../modales/EditCarreraModal"
import { DeleteCarreraModal } from "../modales/DeleteCarreraModal"
import { getCarreras, createCarrera, updateCarrera, deleteCarrera } from "../../../api/carreras.api"

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
    <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-red-800">Error al cargar carreras</h3>
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
    <p className="text-sm text-gray-500 mt-2">Cargando carreras...</p>
  </div>
)

export default function CarreraTable() {
  const [carreras, setCarreras] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCarrera, setSelectedCarrera] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState("todos") // todos | activos | inactivos
  const toast = useToast()

  // Cargar carreras al montar el componente
  useEffect(() => {
    loadCarreras()
  }, [])

  const loadCarreras = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getCarreras()
      setCarreras(data)
    } catch (err) {
      console.error("Error al cargar carreras:", err)
      setError(err.response?.data?.message || "Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  // Filtrar carreras (texto + estado)
  const filteredCarreras = carreras.filter(carrera => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = (
      (carrera.nombre_carrera || '').toLowerCase().includes(searchLower) ||
      (carrera.division || '').toLowerCase().includes(searchLower)
    )
    const matchesStatus = (
      statusFilter === 'todos' ||
      (statusFilter === 'activos' && carrera.estado === true) ||
      (statusFilter === 'inactivos' && carrera.estado === false)
    )
    return matchesSearch && matchesStatus
  })

  const handleEdit = (carrera) => {
    setSelectedCarrera(carrera)
    setShowEditModal(true)
  }

  const handleDelete = (carrera) => {
    setSelectedCarrera(carrera)
    setShowDeleteModal(true)
  }

  const handleAddCarrera = async (newCarreraData) => {
    try {
      setActionLoading(true)
      await createCarrera(newCarreraData)
      await loadCarreras()
      setShowAddModal(false)
      try { toast?.showToast?.("Carrera agregada correctamente", "success") } catch (e) { console.warn(e) }
    } catch (err) {
      console.error("Error al crear carrera:", err)
      const errorMsg = err.response?.data?.message || "Error al crear carrera"
      try { toast?.showToast?.(errorMsg, "error") } catch (e) { console.warn(e) }
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateCarrera = async (updatedCarreraData) => {
    try {
      setActionLoading(true)
      await updateCarrera(selectedCarrera.id_carrera, updatedCarreraData)
      await loadCarreras()
      setShowEditModal(false)
      try { toast?.showToast?.("Carrera actualizada correctamente", "success") } catch (e) { console.warn(e) }
    } catch (err) {
      console.error("Error al actualizar carrera:", err)
      const errorMsg = err.response?.data?.message || "Error al actualizar carrera"
      try { toast?.showToast?.(errorMsg, "error") } catch (e) { console.warn(e) }
    } finally {
      setActionLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true)
      const nuevoEstado = !selectedCarrera.estado
      await deleteCarrera(selectedCarrera.id_carrera)
      await loadCarreras()
      setShowDeleteModal(false)
      setSelectedCarrera(null)
      const mensaje = nuevoEstado ? "Carrera reactivada correctamente" : "Carrera desactivada correctamente"
      try { toast?.showToast?.(mensaje, "success") } catch (e) { console.warn(e) }
    } catch (err) {
      console.error("Error al cambiar estado de la carrera:", err)
      const errorMsg = err.response?.data?.message || "Error al cambiar estado de la carrera"
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
              Gestión de Carreras
            </h2>
            <p className="text-sm text-gray-500">
              Administra las carreras del sistema 
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadCarreras} variant="ghost" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
            <Button onClick={() => setShowAddModal(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Carrera
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <ErrorAlert 
            message={error} 
            onRetry={loadCarreras}
          />
        )}

        {/* Buscador + Filtro estado */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <Input
                placeholder="Buscar carreras..."
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
                      División
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
                  {filteredCarreras.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <p className="text-sm">
                            {searchTerm 
                              ? "No se encontraron carreras con esos criterios"
                              : "No hay carreras registradas"
                            }
                          </p>
                          {!searchTerm && (
                            <p className="text-xs mt-1">Agrega la primera carrera usando el botón superior</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCarreras.map((carrera) => (
                      <tr
                        key={carrera.id_carrera}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {carrera.nombre_carrera}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{carrera.division || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              carrera.estado 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {carrera.estado ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(carrera)}
                              className="text-gray-600 hover:text-gray-900 p-1 disabled:opacity-50"
                              disabled={actionLoading}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(carrera)}
                              className="text-gray-600 hover:text-red-600 p-1 disabled:opacity-50"
                              disabled={actionLoading}
                            >
                              <RotateCcw className="h-4 w-4" />
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
        <AddCarrerModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCarrera}
          loading={actionLoading}
        />
      )}

      {showEditModal && selectedCarrera && (
        <EditCarreraModal
          carrera={selectedCarrera}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateCarrera}
          loading={actionLoading}
        />
      )}

      {showDeleteModal && selectedCarrera && (
        <DeleteCarreraModal
          carrera={selectedCarrera}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  )
}