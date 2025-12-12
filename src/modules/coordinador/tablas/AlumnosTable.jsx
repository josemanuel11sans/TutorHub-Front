import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, AlertCircle, Loader2, RefreshCw, RotateCcw } from "lucide-react"
import { useToast } from "../../../context/ToastContext"
import { AddAlumnoModal } from "../modales/AddAlumnoModal"
import { EditAlumnoModal } from "../modales/EditAlumnoModal"
import { DeleteConfirmModal } from "../modales/DeleteConfirmModal"
import { 
  getAlumnos, 
  createAlumno, 
  updateAlumno, 
  deleteAlumno 
} from "../../../api/alumnos.api"

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
      <h3 className="text-sm font-semibold text-red-800">Error al cargar alumnos</h3>
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
    <p className="text-sm text-gray-500 mt-2">Cargando alumnos...</p>
  </div>
)

export default function AlumnosTable() {
  const [alumnos, setAlumnos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAlumno, setSelectedAlumno] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState("todos") // todos | activos | inactivos
  const toast = useToast()

  // Cargar alumnos al montar el componente
  useEffect(() => {
    loadAlumnos()
  }, [])

  const loadAlumnos = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAlumnos()
      setAlumnos(data)
    } catch (err) {
      console.error("Error al cargar alumnos:", err)
      setError(err.response?.data?.message || "Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  // Filtrar alumnos (texto + estado)
  const filteredAlumnos = alumnos.filter(alumno => {
    const searchLower = searchTerm.toLowerCase()
    const fullName = `${alumno.nombre || ''} ${alumno.apellido_paterno || ''} ${alumno.apellido_materno || ''}`.toLowerCase()
    const matchesSearch = (
      fullName.includes(searchLower) ||
      (alumno.email || '').toLowerCase().includes(searchLower) ||
      (alumno.telefono || '').includes(searchTerm)
    )
    const matchesStatus = (
      statusFilter === 'todos' ||
      (statusFilter === 'activos' && alumno.estado === true) ||
      (statusFilter === 'inactivos' && alumno.estado === false)
    )
    return matchesSearch && matchesStatus
  })

  const handleEdit = (alumno) => {
    setSelectedAlumno(alumno)
    setShowEditModal(true)
  }

  const handleDelete = (alumno) => {
    setSelectedAlumno(alumno)
    setShowDeleteModal(true)
  }

  const handleAddAlumno = async (newAlumnoData) => {
    try {
      setActionLoading(true)
      const newAlumno = await createAlumno(newAlumnoData)
      setAlumnos([...alumnos, newAlumno])
      setShowAddModal(false)
      try { toast?.showToast?.("Alumno agregado correctamente", "success") } catch (e) { console.warn(e) }
    } catch (err) {
      console.error("Error al crear alumno:", err)
      const errorMsg = err.response?.data?.message || "Error al crear alumno"
      try { toast?.showToast?.(errorMsg, "error") } catch (e) { console.warn(e) }
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateAlumno = async (updatedAlumnoData) => {
    try {
      setActionLoading(true)
      const updated = await updateAlumno(selectedAlumno.id_usuario, updatedAlumnoData)
      setAlumnos(alumnos.map(a =>
        a.id_usuario === selectedAlumno.id_usuario ? updated : a
      ))
      setShowEditModal(false)
      try { toast?.showToast?.("Alumno actualizado correctamente", "success") } catch (e) { console.warn(e) }
    } catch (err) {
      console.error("Error al actualizar alumno:", err)
      const errorMsg = err.response?.data?.message || "Error al actualizar alumno"
      try { toast?.showToast?.(errorMsg, "error") } catch (e) { console.warn(e) }
    } finally {
      setActionLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true)
      // Alternar el estado: si está activo, desactivar; si está inactivo, activar
      const nuevoEstado = !selectedAlumno.estado
      await deleteAlumno(selectedAlumno.id_usuario)
      setAlumnos(alumnos.map(a =>
        a.id_usuario === selectedAlumno.id_usuario ? { ...a, estado: nuevoEstado } : a
      ))
      setShowDeleteModal(false)
      setSelectedAlumno(null)
      const mensaje = nuevoEstado ? "Alumno reactivado correctamente" : "Alumno desactivado correctamente"
      try { toast?.showToast?.(mensaje, "success") } catch (e) { console.warn(e) }
    } catch (err) {
      console.error("Error al cambiar estado del alumno:", err)
      const errorMsg = err.response?.data?.message || "Error al cambiar estado del alumno"
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
              Gestión de Alumnos
            </h2>
            <p className="text-sm text-gray-500">
              Administra los alumnos del sistema 
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadAlumnos} variant="ghost" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
            <Button onClick={() => setShowAddModal(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Alumno
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <ErrorAlert 
            message={error} 
            onRetry={loadAlumnos}
          />
        )}

        {/* Buscador + Filtro estado */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <Input
                placeholder="Buscar alumnos..."
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
                      Carrera
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
                  {filteredAlumnos.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <p className="text-sm">
                            {searchTerm 
                              ? "No se encontraron alumnos con esos criterios"
                              : "No hay alumnos registrados"
                            }
                          </p>
                          {!searchTerm && (
                            <p className="text-xs mt-1">Agrega el primer alumno usando el botón superior</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAlumnos.map((alumno) => (
                      <tr
                        key={alumno.id_usuario}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno || ''}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{alumno.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {alumno.telefono || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {alumno.Carrera?.nombre_carrera || 'Sin asignar'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              alumno.estado 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {alumno.estado ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(alumno)}
                              className="text-gray-600 hover:text-gray-900 p-1 disabled:opacity-50"
                              disabled={actionLoading}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(alumno)}
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
        <AddAlumnoModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddAlumno}
          loading={actionLoading}
        />
      )}

      {showEditModal && selectedAlumno && (
        <EditAlumnoModal
          alumno={selectedAlumno}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateAlumno}
          loading={actionLoading}
        />
      )}

      {showDeleteModal && selectedAlumno && (
        <DeleteConfirmModal
          title="Cambiar estado del Alumno"
          message={`¿Estás seguro de que deseas cambiarle el estado al alumno ${selectedAlumno.nombre} ${selectedAlumno.apellido}?`}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          loading={actionLoading}
        />
      )}
    </>
  )
}