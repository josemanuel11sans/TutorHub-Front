import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Loader2, RefreshCw, AlertCircle } from "lucide-react"
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
        sm: "px-3 py-1.5 text-xs",
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
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedEdificio, setSelectedEdificio] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)

    // Cargar edificios al montar el componente
    useEffect(() => {
        fetchEdificios()
    }, [])

    const fetchEdificios = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await getEdificios()
            // Asegurarse de que tenemos un array
            const data = Array.isArray(response) ? response : []
            setEdificios(data)
        } catch (err) {
            console.error("Error al cargar edificios:", err)
            setError(err.message || "No se pudieron cargar los edificios. Intenta de nuevo más tarde.")
        } finally {
            setLoading(false)
        }
    }

    // Filtrar edificios
    const filteredEdificios = edificios.filter(edificio => {
        if (!edificio) return false
        
        const searchLower = searchTerm.toLowerCase()
        return (
            (edificio.nombre?.toLowerCase() || "").includes(searchLower) ||
            (edificio.descripcion?.toLowerCase() || "").includes(searchLower) ||
            (edificio.ubicacion?.toLowerCase() || "").includes(searchLower)
        )
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
        setActionLoading(true)
        try {
            const response = await createEdificio(newEdificio)
            // Agregar el nuevo edificio a la lista
            if (response.data) {
                setEdificios(prev => [...prev, response.data])
            }
            setShowAddModal(false)
        } catch (error) {
            console.error("Error al crear edificio:", error)
            
            // Mostrar mensaje de error específico si existe
            if (error.message) {
                alert(error.message)
            } else if (error.errors) {
                // Para errores de validación de Sequelize
                const errorMessages = error.errors.map(err => err.message).join('\n')
                alert(`Errores de validación:\n${errorMessages}`)
            }
            
            throw error // Para que el modal maneje el error
        } finally {
            setActionLoading(false)
        }
    }

    const handleUpdateEdificio = async (updatedEdificio) => {
        setActionLoading(true)
        try {
            const response = await updateEdificio(selectedEdificio.id, updatedEdificio)
            // Actualizar el edificio en la lista
            if (response.data) {
                setEdificios(prev => prev.map(e =>
                    e.id === selectedEdificio.id ? response.data : e
                ))
            }
            setShowEditModal(false)
        } catch (error) {
            console.error("Error al actualizar edificio:", error)
            
            if (error.message) {
                alert(error.message)
            }
            
            throw error
        } finally {
            setActionLoading(false)
        }
    }

    const handleConfirmDelete = async () => {
        setActionLoading(true)
        try {
            await deleteEdificio(selectedEdificio.id)
            // Eliminar el edificio de la lista
            setEdificios(prev => prev.filter(e => e.id !== selectedEdificio.id))
            setShowDeleteModal(false)
            setSelectedEdificio(null)
        } catch (error) {
            console.error("Error al eliminar edificio:", error)
            
            // Mostrar error específico
            if (error.message) {
                alert(error.message)
            } else {
                alert("No se pudo eliminar el edificio. Puede que tenga aulas asociadas.")
            }
        } finally {
            setActionLoading(false)
        }
    }

    const handleDeactivate = async (id) => {
        setActionLoading(true)
        try {
            await deactivateEdificio(id)
            // Actualizar estado en la lista
            setEdificios(prev => prev.map(e =>
                e.id === id ? { ...e, estado: false } : e
            ))
        } catch (error) {
            console.error("Error al desactivar edificio:", error)
            
            if (error.message) {
                alert(error.message)
            } else {
                alert("No se pudo desactivar el edificio")
            }
        } finally {
            setActionLoading(false)
        }
    }

    // Render de loading
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="text-gray-600">Cargando edificios...</span>
            </div>
        )
    }

    // Render de error
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
                    <h3 className="text-lg font-medium text-red-800">Error al cargar edificios</h3>
                </div>
                <p className="text-red-700 mb-4">{error}</p>
                <div className="flex gap-2">
                    <Button onClick={fetchEdificios}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reintentar
                    </Button>
                    <Button onClick={() => setError(null)} variant="ghost">
                        Ocultar error
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Gestión de Edificios
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {edificios.length} edificio{edificios.length !== 1 ? 's' : ''} registrado{edificios.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                            onClick={fetchEdificios} 
                            variant="ghost" 
                            size="md"
                            disabled={loading || actionLoading}
                            className="sm:w-auto w-full"
                        >
                            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </Button>
                        <Button 
                            onClick={() => setShowAddModal(true)} 
                            disabled={actionLoading}
                            className="sm:w-auto w-full"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Edificio
                        </Button>
                    </div>
                </div>

                {/* Buscador y estadísticas */}
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
                        <div className="flex items-center gap-3">

                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ubicación
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredEdificios.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                                                <p className="text-sm font-medium mb-1">
                                                    {searchTerm ? 'No se encontraron resultados' : 'No hay edificios registrados'}
                                                </p>
                                                <p className="text-xs">
                                                    {searchTerm 
                                                        ? 'Intenta con otros términos de búsqueda' 
                                                        : 'Haz clic en "Nuevo Edificio" para crear el primero'
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEdificios.map((edificio) => (
                                        <tr key={edificio.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {edificio.nombre}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 max-w-xs">
                                                    {edificio.descripcion || (
                                                        <span className="text-gray-400 italic">Sin descripción</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">
                                                    {edificio.ubicacion}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={edificio.estado ? "active" : "inactive"}>
                                                    {edificio.estado ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        onClick={() => handleEdit(edificio)}
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={actionLoading}
                                                        title="Editar"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    
                                                    {edificio.estado ? (
                                                        <Button
                                                            onClick={() => handleDeactivate(edificio.id)}
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled={actionLoading}
                                                            title="Desactivar"
                                                            className="text-yellow-600 hover:text-yellow-700"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            onClick={() => handleDelete(edificio)}
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled={actionLoading}
                                                            title="Eliminar"
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
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
                    loading={actionLoading}
                />
            )}

            {showEditModal && selectedEdificio && (
                <EditEdificioModal
                    edificio={selectedEdificio}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={handleUpdateEdificio}
                    loading={actionLoading}
                />
            )}

            {showDeleteModal && selectedEdificio && (
                <DeleteEdificioModal
                    edificio={selectedEdificio}
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={handleConfirmDelete}
                    loading={actionLoading}
                />
            )}
        </>
    )
}