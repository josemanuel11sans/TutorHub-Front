import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, RefreshCw } from "lucide-react"
import { AddAulaModal } from "../modales/AddAulaModal"
import { EditAulaModal } from "../modales/EditAulaModal"
import { DeleteAulaModal } from "../modales/DeleteAulaModal"
import { getAulas } from "../../../api/aulas.api" // Ajusta la ruta según tu estructura

// Botón compacto
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

export default function AulasTable() {
    const [aulas, setAulas] = useState([])
    const [edificios, setEdificios] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedAula, setSelectedAula] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Cargar aulas al montar el componente
    const fetchAulas = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getAulas()
            
            // Transformar los datos de la API al formato del componente
            const aulasTransformadas = data.map(aula => ({
                id: aula.id,
                nombre: aula.nombre,
                descripcion: aula.descripcion,
                edificioId: aula.edificioId,
                edificioNombre: aula.Edificio?.nombre || 'Sin edificio',
                estado: aula.Edificio?.estado ?? true, // Tomamos el estado del edificio
            }))
            
            setAulas(aulasTransformadas)
            
            // Extraer edificios únicos de los datos
            const edificiosUnicos = data
                .filter(aula => aula.Edificio)
                .reduce((acc, aula) => {
                    if (!acc.find(e => e.id === aula.Edificio.id)) {
                        acc.push({
                            id: aula.Edificio.id,
                            nombre: aula.Edificio.nombre
                        })
                    }
                    return acc
                }, [])
            
            setEdificios(edificiosUnicos)
        } catch (err) {
            setError("Error al cargar las aulas. Por favor, intenta de nuevo.")
            console.error("Error al cargar aulas:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAulas()
    }, [])

    // Filtrar aulas
    const filteredAulas = aulas.filter(aula =>
        aula.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aula.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aula.edificioNombre.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleEdit = (aula) => {
        setSelectedAula(aula)
        setShowEditModal(true)
    }

    const handleDelete = (aula) => {
        setSelectedAula(aula)
        setShowDeleteModal(true)
    }

    const handleAddAula = async (newAula) => {
        // Aquí llamarías a createAula(newAula)
        // Por ahora solo actualizo el estado local
        await fetchAulas() // Recargar la lista después de agregar
        setShowAddModal(false)
    }

    const handleUpdateAula = async (updatedAula) => {
        // Aquí llamarías a updateAula(updatedAula)
        await fetchAulas() // Recargar la lista después de actualizar
        setShowEditModal(false)
    }

    const handleConfirmDelete = async () => {
        // Aquí llamarías a deleteAula(selectedAula.id)
        await fetchAulas() // Recargar la lista después de eliminar
        setShowDeleteModal(false)
        setSelectedAula(null)
    }

    return (
        <>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Gestión de Aulas
                        </h2>
                        <p className="text-sm text-gray-500">
                            Administra las aulas del sistema
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            onClick={fetchAulas} 
                            variant="ghost"
                            disabled={loading}
                        >
                            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </Button>
                        <Button onClick={() => setShowAddModal(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Aula
                        </Button>
                    </div>
                </div>

                {/* Mensaje de error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Buscador */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <Input
                        placeholder="Buscar aulas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon
                        disabled={loading}
                    />
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
                                        Edificio
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
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                                                <p className="text-sm text-gray-500">Cargando aulas...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredAulas.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <p className="text-sm">No se encontraron aulas</p>
                                                <p className="text-xs mt-1">
                                                    {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Agrega tu primera aula'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAulas.map((aula) => (
                                        <tr
                                            key={aula.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {aula.nombre}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {aula.descripcion}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {aula.edificioNombre}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={aula.estado ? "active" : "inactive"}>
                                                    {aula.estado ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(aula)}
                                                        className="text-gray-600 hover:text-gray-900 p-1"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(aula)}
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

            {/* Modales */}
            {showAddModal && (
                <AddAulaModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddAula}
                    edificios={edificios}
                />
            )}

            {showEditModal && selectedAula && (
                <EditAulaModal
                    aula={selectedAula}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={handleUpdateAula}
                    edificios={edificios}
                />
            )}

            {showDeleteModal && selectedAula && (
                <DeleteAulaModal
                    aula={selectedAula}
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={handleConfirmDelete}
                />
            )}
        </>
    )
}