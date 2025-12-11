import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, RefreshCw, RotateCcw } from "lucide-react"
import { AddMateriaModal } from "../modales/AddMateriaModal"
import { EditMateriaModal } from "../modales/EditMateriaModal"
import { DeleteMateriaModal } from "../modales/DeleteMateriaModal"
import * as materiasAPI from "../../../api/materias.api"
import * as carrerasAPI from "../../../api/carreras.api"
import { useToast } from "../../../context/ToastContext"

// Botón compacto
const Button = ({ children, onClick, variant = "default", size = "sm", className = "" }) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors"
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
        active: "bg-green-100 text-green-800",
        inactive: "bg-gray-100 text-gray-500",
        default: "bg-gray-200 text-gray-700"
    }

    return (
        <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
            {children}
        </span>
    )
}

export default function MateriasTable() {
    const [materias, setMaterias] = useState([])
    const [carreras, setCarreras] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("todos") // todos | activos | inactivos
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedMateria, setSelectedMateria] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const toast = useToast()

    // Cargar datos iniciales
    useEffect(() => {
        loadMaterias()
        loadCarreras()
    }, [])

    const loadMaterias = async () => {
        try {
            setLoading(true)
            const data = await materiasAPI.getMaterias()
            setMaterias(data)
            setError(null)
        } catch (err) {
            setError("Error al cargar las materias")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const loadCarreras = async () => {
        try {
            const data = await carrerasAPI.getCarreras() // Necesitarás crear este servicio
            setCarreras(data)
        } catch (err) {
            console.error("Error al cargar carreras:", err)
        }
    }

    // Filtrar materias (texto + estado)
    const filteredMaterias = materias.filter(materia => {
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch = (
            (materia.nombre_materia || '').toLowerCase().includes(searchLower) ||
            (materia.descripcion || '').toLowerCase().includes(searchLower)
        )
        const matchesStatus = (
            statusFilter === 'todos' ||
            (statusFilter === 'activos' && materia.activo === true) ||
            (statusFilter === 'inactivos' && materia.activo === false)
        )
        return matchesSearch && matchesStatus
    })

    const handleEdit = (materia) => {
        setSelectedMateria(materia)
        setShowEditModal(true)
    }

    const handleDelete = (materia) => {
        setSelectedMateria(materia)
        setShowDeleteModal(true)
    }

    const handleAddMateria = async (newMateria) => {
        try {
            const created = await materiasAPI.createMateria({
                nombre_materia: newMateria.nombre,
                descripcion: newMateria.objetivo,
                activo: newMateria.estado,
                carrera_id: newMateria.carrera_id
            })
            setMaterias([...materias, created])
            setShowAddModal(false)
            try {
                toast?.showToast?.('Materia agregada correctamente', 'success')
            } catch (e) {
                console.warn(e)
            }
        } catch (err) {
            console.error("Error al crear materia:", err)
            const errorMessage = err.response?.data?.message || 'Error al agregar materia'
            try {
                toast?.showToast?.(errorMessage, 'error')
            } catch (e) {
                console.warn(e)
            }
        }
    }

    const handleUpdateMateria = async (updatedMateria) => {
        try {
            const updated = await materiasAPI.updateMateria(selectedMateria.id_materia, {
                nombre_materia: updatedMateria.nombre,
                descripcion: updatedMateria.objetivo,
                activo: updatedMateria.estado,
                carrera_id: updatedMateria.carrera_id
            })
            setMaterias(materias.map(m =>
                m.id_materia === updated.id_materia ? updated : m
            ))
            setShowEditModal(false)
            try {
                toast?.showToast?.('Materia actualizada correctamente', 'success')
            } catch (e) {
                console.warn(e)
            }
        } catch (err) {
            console.error("Error al actualizar materia:", err)
            const errorMessage = err.response?.data?.message || 'Error al actualizar materia'
            try {
                toast?.showToast?.(errorMessage, 'error')
            } catch (e) {
                console.warn(e)
            }
        }
    }

    const handleConfirmDelete = async () => {
        try {
            await materiasAPI.deleteMateria(selectedMateria.id_materia)
            setMaterias(materias.filter(m => m.id_materia !== selectedMateria.id_materia))
            setShowDeleteModal(false)
            setSelectedMateria(null)
            try {
                toast?.showToast?.('Materia eliminada correctamente', 'success')
            } catch (e) {
                console.warn(e)
            }
        } catch (err) {
            console.error("Error al eliminar materia:", err)
            const errorMessage = err.response?.data?.message || 'Error al eliminar materia'
            try {
                toast?.showToast?.(errorMessage, 'error')
            } catch (e) {
                console.warn(e)
            }
        }
    }

    const getCarreraNombre = (carreraId) => {
        const carrera = carreras.find(c => c.id_carrera === carreraId)
        return carrera ? carrera.nombre_carrera : "Sin carrera"
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Cargando materias...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={loadMaterias}
                    className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                >
                    Reintentar
                </button>
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
                            Gestión de Materias
                        </h2>
                        <p className="text-sm text-gray-500">
                            Administra las materias del sistema
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={loadMaterias} variant="ghost" size="sm">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Actualizar
                        </Button>
                        <Button onClick={() => setShowAddModal(true)} size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Materia
                        </Button>
                    </div>
                </div>

                {/* Buscador + Filtro estado */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-1 w-full">
                            <Input
                                placeholder="Buscar por nombre o descripción..."
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
                                {filteredMaterias.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <p className="text-sm">No se encontraron materias</p>
                                                <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMaterias.map((materia) => (
                                        <tr
                                            key={materia.id_materia}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {materia.nombre_materia}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                {materia.descripcion}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {getCarreraNombre(materia.carrera_id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={materia.activo ? "active" : "inactive"}>
                                                    {materia.activo ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(materia)}
                                                        className="text-gray-600 hover:text-gray-900 p-1"
                                                        title="Editar"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(materia)}
                                                        className="text-gray-600 hover:text-red-600 p-1"
                                                        title="Eliminar"
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
                <AddMateriaModal
                    carreras={carreras}
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddMateria}
                />
            )}

            {showEditModal && selectedMateria && (
                <EditMateriaModal
                    materia={selectedMateria}
                    carreras={carreras}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={handleUpdateMateria}
                />
            )}

            {showDeleteModal && selectedMateria && (
                <DeleteMateriaModal
                    materia={selectedMateria}
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={handleConfirmDelete}
                />
            )}
        </>
    )
}