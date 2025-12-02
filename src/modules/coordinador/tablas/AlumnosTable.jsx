import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, AlertCircle, Loader2 } from "lucide-react"
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

  // Filtrar alumnos
  const filteredAlumnos = alumnos.filter(alumno => {
    const searchLower = searchTerm.toLowerCase()
    const fullName = `${alumno.nombre || ''} ${alumno.apellido_paterno || ''} ${alumno.apellido_materno || ''}`.toLowerCase()
    return (
      fullName.includes(searchLower) ||
      (alumno.email || '').toLowerCase().includes(searchLower) ||
      (alumno.telefono || '').includes(searchTerm)
    )
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
    } catch (err) {
      console.error("Error al crear alumno:", err)
      alert(err.response?.data?.message || "Error al crear alumno")
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
    } catch (err) {
      console.error("Error al actualizar alumno:", err)
      alert(err.response?.data?.message || "Error al actualizar alumno")
    } finally {
      setActionLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true)
      await deleteAlumno(selectedAlumno.id_usuario)
      setAlumnos(alumnos.filter(a => a.id_usuario !== selectedAlumno.id_usuario))
      setShowDeleteModal(false)
      setSelectedAlumno(null)
    } catch (err) {
      console.error("Error al eliminar alumno:", err)
      alert(err.response?.data?.message || "Error al eliminar alumno")
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
          <Button onClick={() => setShowAddModal(true)} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Alumno
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <ErrorAlert 
            message={error} 
            onRetry={loadAlumnos}
          />
        )}

        {/* Buscador */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Input
            placeholder="Buscar alumnos..."
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
                  {filteredAlumnos.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
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
          title="Eliminar Alumno"
          message={`¿Estás seguro de que deseas eliminar al alumno ${selectedAlumno.nombre} ${selectedAlumno.apellido_paterno}? Esta acción no se puede deshacer.`}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          loading={actionLoading}
        />
      )}
    </>
  )
}