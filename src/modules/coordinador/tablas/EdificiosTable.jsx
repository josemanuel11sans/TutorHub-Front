import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Loader2, RefreshCw, AlertCircle, RotateCcw } from "lucide-react"
import { useToast } from "../../../context/ToastContext"
import { AddEdificioModal } from "../modales/AddEdificioModal"
import { EditEdificioModal } from "../modales/EditEdificioModal"
import { DeleteEdificioModal } from "../modales/DeleteEdificioModal"
import {
  getEdificios,
  createEdificio,
  updateEdificio,
  deleteEdificio,
  deactivateEdificio
} from "../../../api/edificios.api"

// Componentes UI reutilizables (mantén los que ya tienes)
const Button = ({ children, onClick, variant = "default", size = "sm", className = "", disabled = false }) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors"
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
        ghost: "hover:bg-gray-100 text-gray-700 disabled:text-gray-300",
        danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
    }
    const sizes = {
        sm: "px-2 py-1 text-xs",
        md: "px-4 py-2 text-sm",
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} disabled:cursor-not-allowed`}
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
        active: "bg-green-100 text-green-800 border border-green-200",
        inactive: "bg-red-100 text-red-800 border border-red-200",
        default: "bg-gray-200 text-gray-700"
    }

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variants[variant]}`}>
            {children}
        </span>
    )
}

export default function EdificiosTable() {
    const [edificios, setEdificios] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("todos") // todos | activos | inactivos
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedEdificio, setSelectedEdificio] = useState(null)
    const toast = useToast()

    // Cargar edificios al montar el componente
    useEffect(() => {
        fetchEdificios()
    }, [])

    const fetchEdificios = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await getEdificios()
            const data = Array.isArray(response) ? response : []
            setEdificios(data)
        } catch (err) {
            console.error("Error al cargar edificios:", err)
            setError(err.response?.data?.message || "Error al conectar con el servidor")
        } finally {
            setLoading(false)
        }
    }

    // Filtrar edificios
    const filteredEdificios = edificios.filter(edificio => {
        if (!edificio) return false
        
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch = (
            (edificio.nombre?.toLowerCase() || "").includes(searchLower) ||
            (edificio.descripcion?.toLowerCase() || "").includes(searchLower) ||
            (edificio.ubicacion?.toLowerCase() || "").includes(searchLower)
        )
        const matchesStatus = (
            statusFilter === 'todos' ||
            (statusFilter === 'activos' && edificio.estado === true) ||
            (statusFilter === 'inactivos' && edificio.estado === false)
        )
        return matchesSearch && matchesStatus
    })

    const handleEdit = (edificio) => {
        setSelectedEdificio(edificio)
        setShowEditModal(true)
    }

    const handleDelete = (edificio) => {
        setSelectedEdificio(edificio)
        setShowDeleteModal(true)
    }

    const handleAddEdificio = async (newEdificio) => {
        try {
            const response = await createEdificio(newEdificio)
            const nuevoEdificio = response?.data || response
            // Cerrar modal y notificar
            setShowAddModal(false)
            toast?.showToast('Edificio agregado correctamente', 'success')
            // Refrescar desde el servidor para asegurar datos consistentes
            await fetchEdificios()
        } catch (error) {
            console.error("Error al crear edificio:", error)
            const errorMessage = error.response?.data?.message || 'Error al agregar edificio'
            toast?.showToast(errorMessage, 'error')
            throw error
        }
    }

    const handleUpdateEdificio = async (updatedEdificio) => {
        try {
            await updateEdificio(selectedEdificio.id, updatedEdificio)
            setEdificios(edificios.map(e =>
                e.id === selectedEdificio.id 
                    ? { ...e, ...updatedEdificio } 
                    : e
            ))
            setShowEditModal(false)
            setSelectedEdificio(null)
            toast?.showToast('Edificio actualizado correctamente', 'success')
        } catch (error) {
            console.error("Error al actualizar edificio:", error)
            const errorMessage = error.response?.data?.message || 'Error al actualizar edificio'
            toast?.showToast(errorMessage, 'error')
            throw error
        }
    }

    const handleConfirmDelete = async () => {
        try {
            await deleteEdificio(selectedEdificio.id)
            const nuevoEstado = !selectedEdificio.estado
            setEdificios(edificios.map(e =>
                e.id === selectedEdificio.id ? { ...e, estado: nuevoEstado } : e
            ))
            setShowDeleteModal(false)
            setSelectedEdificio(null)
            const mensaje = nuevoEstado ? 'Edificio activado correctamente' : 'Edificio desactivado correctamente'
            toast?.showToast(mensaje, 'success')
        } catch (error) {
            console.error("Error al cambiar estado del edificio:", error)
            const errorMessage = error.response?.data?.message || 'No se pudo cambiar el estado del edificio'
            toast?.showToast(errorMessage, 'error')
        }
    }

    // Render de loading
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Cargando edificios...</p>
                </div>
            </div>
        )
    }

    // Render de error
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="text-red-600 mr-3">⚠️</div>
                        <div>
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    </div>
                    <Button onClick={fetchEdificios} variant="ghost" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Reintentar
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Gestión de Edificios
                        </h2>
                        <p className="text-sm text-gray-500">
Administra los edificios del sistema                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            onClick={fetchEdificios} 
                            variant="ghost"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Actualizar
                        </Button>
                        <Button onClick={() => setShowAddModal(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Edificio
                        </Button>
                    </div>
                </div>

                {/* Buscador + Filtro estado */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex-1 w-full">
                            <Input
                                placeholder="Buscar por nombre, descripción o ubicación..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon
                            />
                        </div>
                        <div className="w-full sm:w-56">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
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
                        <table className="w-full text-center">
                            <thead className="bg-gray-50">
                                <tr className="border-b border-gray-200">
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Ubicación
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
                                {filteredEdificios.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <p className="text-sm">
                                                    {searchTerm 
                                                        ? 'No se encontraron edificios con ese criterio' 
                                                        : 'No hay edificios registrados'}
                                                </p>
                                                {searchTerm && (
                                                    <button
                                                        onClick={() => setSearchTerm('')}
                                                        className="text-xs text-blue-600 hover:underline mt-1"
                                                    >
                                                        Limpiar búsqueda
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEdificios.map((edificio) => (
                                        <tr key={edificio.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {edificio.nombre}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                {edificio.descripcion || 'Sin descripción'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {edificio.ubicacion}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                                        edificio.estado 
                                                            ? "bg-green-100 text-green-800" 
                                                            : "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    {edificio.estado ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(edificio)}
                                                        className="text-gray-600 hover:text-gray-900 p-1"
                                                        title="Editar edificio"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(edificio)}
                                                        className="text-gray-600 hover:text-red-600 p-1"
                                                        title={edificio.estado ? "Desactivar edificio" : "Activar edificio"}
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
                    </div>
                </div>
            </div>

            {/* Modales */}
            {showAddModal && (
                <AddEdificioModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddEdificio}
                />
            )}

            {showEditModal && selectedEdificio && (
                <EditEdificioModal
                    edificio={selectedEdificio}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={handleUpdateEdificio}
                />
            )}

            {showDeleteModal && selectedEdificio && (
                <DeleteEdificioModal
                    edificio={selectedEdificio}
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={handleConfirmDelete}
                />
            )}
        </>
    )
}