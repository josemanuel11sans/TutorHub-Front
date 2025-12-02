import { useState } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { AddCoordinadorModal } from "../modales/AddCoordinadorModal"
import { EditCoordinadorModal } from "../modales/EditCoordinadorModal"
import { DeleteConfirmModal } from "../modales/DeleteConfirmModal"

// Botón compacto
const Button = ({ children, onClick, variant = "default", size = "sm", className = "" }) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors"
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        ghost: "hover:bg-gray-100 text-gray-700",
    }
    const sizes = {
        sm: "px-2 py-1 text-xs",  // menos padding y letra más pequeña
        xs: "px-1.5 py-0.5 text-[10px]", // aún más compacto
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
        active: "bg-blue-600 text-white",
        inactive: "bg-red-100 text-red-800",
        default: "bg-gray-200 text-gray-700"
    }

    return (
        <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
            {children}
        </span>
    )
}

// Datos de prueba
const COORDINADORES_MOCK = [
    {
        id: 1,
        nombre: "Carlos",
        apellido: "Rodriguez García",
        correo: "carlos.rodriguez@escuela.edu",
        telefono: "123456789",
        estado: true,
    },
    {
        id: 2,
        nombre: "María",
        apellido: "López Sánchez",
        correo: "maria.lopez@escuela.edu",
        telefono: "987654321",
        estado: true,
    },
    {
        id: 3,
        nombre: "Juan",
        apellido: "Pérez Martínez",
        correo: "juan.perez@escuela.edu",
        telefono: "555444333",
        estado: false,
    }
]

export default function CoordinadoresTable() {
    const [coordinadores, setCoordinadores] = useState(COORDINADORES_MOCK)
    const [searchTerm, setSearchTerm] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedCoordinador, setSelectedCoordinador] = useState(null)

    // Filtrar coordinadores
    const filteredCoordinadores = coordinadores.filter(coord =>
        coord.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coord.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coord.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coord.telefono.includes(searchTerm)
    )

    const handleEdit = (coordinador) => {
        setSelectedCoordinador(coordinador)
        setShowEditModal(true)
    }

    const handleDelete = (coordinador) => {
        setSelectedCoordinador(coordinador)
        setShowDeleteModal(true)
    }

    const handleAddCoordinador = (newCoordinador) => {
        setCoordinadores([...coordinadores, { ...newCoordinador, id: Date.now() }])
        setShowAddModal(false)
    }

    const handleUpdateCoordinador = (updatedCoordinador) => {
        setCoordinadores(coordinadores.map(c =>
            c.id === updatedCoordinador.id ? updatedCoordinador : c
        ))
        setShowEditModal(false)
    }

    const handleConfirmDelete = () => {
        setCoordinadores(coordinadores.filter(c => c.id !== selectedCoordinador.id))
        setShowDeleteModal(false)
        setSelectedCoordinador(null)
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
                    <Button onClick={() => setShowAddModal(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Coordinador
                    </Button>
                </div>

                {/* Buscador */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <Input
                        placeholder="Buscar coordinadores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon
                    />
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center"> {/* Centrado de headers y celdas */}
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
                                                <p className="text-sm">No se encontraron coordinadores</p>
                                                <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCoordinadores.map((coordinador) => (
                                        <tr
                                            key={coordinador.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {coordinador.nombre} {coordinador.apellido}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{coordinador.correo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{coordinador.telefono}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${coordinador.estado ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                                                        }`}
                                                >
                                                    {coordinador.estado ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(coordinador)}
                                                        className="text-gray-600 hover:text-gray-900 p-1"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(coordinador)}
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
                <AddCoordinadorModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddCoordinador}
                />
            )}

            {showEditModal && selectedCoordinador && (
                <EditCoordinadorModal
                    coordinador={selectedCoordinador}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={handleUpdateCoordinador}
                />
            )}

            {showDeleteModal && selectedCoordinador && (
                <DeleteConfirmModal
                    coordinador={selectedCoordinador}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </>
    )
}