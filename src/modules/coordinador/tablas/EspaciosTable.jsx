import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, RefreshCw, RotateCcw } from "lucide-react"
import { useToast } from "../../../context/ToastContext"
import  AddEspacioModal  from "../modales/AddEspacioModal"
import { EditEspacioModal } from "../modales/EditEspacioModal"
import { DeleteEspacioModal } from "../modales/DeleteEspacioModal"
import { 
  getEspacios, 
  createEspacio, 
  updateEspacio, 
  deleteEspacio 
} from "../../../api/espacios.api"
import { getMaterias } from "../../../api/materias.api"
import { getTutores } from "../../../api/tutores.api"

/* ─────────────────────────────────────────────── */
/*                 COMPONENTES BÁSICOS             */
/* ─────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────── */
/*                  COMPONENTE PRINCIPAL            */
/* ─────────────────────────────────────────────── */

export default function EspaciosTable() {
    const [espacios, setEspacios] = useState([])
    const [materias, setMaterias] = useState([])
    const [tutores, setTutores] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedEspacio, setSelectedEspacio] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [statusFilter, setStatusFilter] = useState("todos") // todos | activos | inactivos
    const [isSubmitting, setIsSubmitting] = useState(false) // Bandera para evitar double submit
    const toast = useToast()

    // Cargar datos iniciales
    useEffect(() => {
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        try {
            setLoading(true)
            setError(null)
            
            // Cargar datos en paralelo
            const [espaciosData, materiasData, usuariosData] = await Promise.all([
                getEspacios(),
                getMaterias(),
                getTutores()
            ])

            setEspacios(espaciosData)
            setMaterias(materiasData)
            // Filtrar solo tutores y coordinadores
            setTutores(usuariosData.filter(u => 
                u.role === 'tutor' || u.role === 'coordinator' || u.role === 'admin'
            ))
        } catch (err) {
            console.error('Error al cargar datos:', err)
            setError('Error al cargar los datos. Por favor, intenta de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    // Función para recargar solo los espacios (más rápido)
    const fetchEspacios = async () => {
        try {
            const espaciosData = await getEspacios()
            setEspacios(espaciosData)
        } catch (err) {
            console.error('Error al recargar espacios:', err)
        }
    }

    // Filtrar espacios
    const filteredEspacios = espacios.filter(espacio => {
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch = (
            espacio.nombre?.toLowerCase().includes(searchLower) ||
            espacio.descripcion?.toLowerCase().includes(searchLower) ||
            espacio.tutor?.nombre?.toLowerCase().includes(searchLower) ||
            espacio.tutor?.apellido?.toLowerCase().includes(searchLower)
        )
        const matchesStatus = (
            statusFilter === 'todos' ||
            (statusFilter === 'activos' && espacio.estado === true) ||
            (statusFilter === 'inactivos' && espacio.estado === false)
        )
        return matchesSearch && matchesStatus
    })

    const handleEdit = (espacio) => {
        setSelectedEspacio(espacio)
        setShowEditModal(true)
    }

    const handleDelete = (espacio) => {
        setSelectedEspacio(espacio)
        setShowDeleteModal(true)
    }

    const handleAddEspacio = async (formData) => {
        // Evitar doble submit
        if (isSubmitting) {
            console.warn('Ya hay una petición en proceso, ignorando...')
            return
        }

        try {
            setIsSubmitting(true)
            
            // Crear el espacio con la estructura correcta de la API
            const espacioToCreate = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                portada: formData.portada || null,
                tutor_id: parseInt(formData.tutorId),
                materia_id: parseInt(formData.materiaId)
            }

            await createEspacio(espacioToCreate)
            
            // Cerrar modal PRIMERO para evitar double submit
            setShowAddModal(false)
            
            // Recargar espacios para obtener los datos completos con relaciones
            await fetchEspacios()
            
            toast?.showToast('Espacio creado exitosamente', 'success')
        } catch (err) {
            console.error('Error al crear espacio:', err)
            let errorMessage = 'Error al crear el espacio'
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message
            }
            
            toast?.showToast(errorMessage, 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateEspacio = async (updatedEspacioData) => {
        try {
            // Preparar datos para actualizar
            const espacioToUpdate = {
                nombre: updatedEspacioData.nombre,
                descripcion: updatedEspacioData.descripcion,
                portada: updatedEspacioData.portada || null
            }

            await updateEspacio(selectedEspacio.id_espacio, espacioToUpdate)
            
            // Actualizar solo el espacio editado en el estado local
            setEspacios(espacios.map(e =>
                e.id_espacio === selectedEspacio.id_espacio 
                    ? { ...e, nombre: espacioToUpdate.nombre, descripcion: espacioToUpdate.descripcion, portada: espacioToUpdate.portada } 
                    : e
            ))
            
            setShowEditModal(false)
            setSelectedEspacio(null)
            toast?.showToast('Espacio actualizado exitosamente', 'success')
        } catch (err) {
            console.error('Error al actualizar espacio:', err)
            let errorMessage = 'Error al actualizar el espacio'
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message
            }
            
            toast?.showToast(errorMessage, 'error')
        }
    }

    const handleConfirmDelete = async () => {
        try {
            await deleteEspacio(selectedEspacio.id_espacio)
            
            // Actualizar el estado local alternando el estado
            const nuevoEstado = !selectedEspacio.estado
            setEspacios(espacios.map(e =>
                e.id_espacio === selectedEspacio.id_espacio ? { ...e, estado: nuevoEstado } : e
            ))
            
            setShowDeleteModal(false)
            setSelectedEspacio(null)
            const mensaje = nuevoEstado ? 'Espacio activado exitosamente' : 'Espacio desactivado exitosamente'
            toast?.showToast(mensaje, 'success')
        } catch (err) {
            console.error('Error al eliminar espacio:', err)
            let errorMessage = 'Error al eliminar el espacio'
            
            // Manejar caso especial de dependencias
            if (err.response?.data?.code === 'HAS_DEPENDENCIES') {
                errorMessage = 'No se puede eliminar: el espacio tiene reservas o materiales asociados'
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message
            }
            
            toast?.showToast(errorMessage, 'error')
            setShowDeleteModal(false)
            setSelectedEspacio(null)
        }
    }

    // Obtener nombre de materia por ID
    const getMateriaNombre = (materiaId) => {
        const materia = materias.find(m => m.id_materia === materiaId)
        return materia ? materia.nombre_materia : 'N/A'
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Cargando espacios...</p>
                </div>
            </div>
        )
    }

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
                    <Button onClick={fetchInitialData} variant="ghost" size="sm">
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
                            Gestión de Espacios
                        </h2>
                        <p className="text-sm text-gray-500">
                            Administra los espacios del sistema
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={fetchInitialData} variant="ghost">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Actualizar
                        </Button>
                        <Button onClick={() => setShowAddModal(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Espacio
                        </Button>
                    </div>
                </div>

                {/* Buscador + Filtro estado */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-1 w-full">
                            <Input
                                placeholder="Buscar por nombre, descripción o tutor..."
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
                                        Materia
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Tutor
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
                                {filteredEspacios.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <p className="text-sm">
                                                    {searchTerm 
                                                        ? 'No se encontraron espacios con ese criterio' 
                                                        : 'No hay espacios registrados'}
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
                                    filteredEspacios.map((espacio) => (
                                        <tr
                                            key={espacio.id_espacio}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {espacio.nombre}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                {espacio.descripcion || 'Sin descripción'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {getMateriaNombre(espacio.materia_id)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {espacio.tutor 
                                                    ? `${espacio.tutor.nombre} ${espacio.tutor.apellido}`
                                                    : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                                        espacio.estado 
                                                            ? "bg-green-100 text-green-800" 
                                                            : "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    {espacio.estado ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(espacio)}
                                                        className="text-gray-600 hover:text-gray-900 p-1"
                                                        title="Editar espacio"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(espacio)}
                                                        className="text-gray-600 hover:text-red-600 p-1"
                                                        title="Eliminar espacio"
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
                <AddEspacioModal
                    onClose={() => setShowAddModal(false)}
                    onCreated={handleAddEspacio}
                    tutores={tutores}
                    materias={materias}
                />
            )}

            {showEditModal && selectedEspacio && (
                <EditEspacioModal
                    espacio={selectedEspacio}
                    onClose={() => setShowEditModal(false)}
                    onEdit={handleUpdateEspacio}
                    tutores={tutores}
                    materias={materias}
                />
            )}

            {showDeleteModal && selectedEspacio && (
                <DeleteEspacioModal
                    espacio={selectedEspacio}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </>
    )
}