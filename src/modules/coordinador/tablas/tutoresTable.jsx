import { useState } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { AddTutorModal } from "../modales/AddTutorModal"
import { EditTutorModal } from "../modales/EditTutorModal"
import { DeleteTutorModal } from "../modales/DeleteTutorModal"

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
        {icon && <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />}
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

// Datos de prueba
const TUTORES_MOCK = [
    { id: 1, nombre: "Carlos", apellido: "Rodriguez García", correo: "carlos.rodriguez@escuela.edu", telefono: "123456789", estado: true },
    { id: 2, nombre: "María", apellido: "López Sánchez", correo: "maria.lopez@escuela.edu", telefono: "987654321", estado: true },
    { id: 3, nombre: "Juan", apellido: "Pérez Martínez", correo: "juan.perez@escuela.edu", telefono: "555444333", estado: false }
]

export default function TutoresTable() {
    const [tutores, setTutores] = useState(TUTORES_MOCK)
    const [searchTerm, setSearchTerm] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedTutor, setSelectedTutor] = useState(null)

    const filteredTutores = tutores.filter(t =>
        t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.telefono.includes(searchTerm)
    )

    const handleEdit = (tutor) => {
        setSelectedTutor(tutor)
        setShowEditModal(true)
    }

    const handleDelete = (tutor) => {
        setSelectedTutor(tutor)
        setShowDeleteModal(true)
    }

    const handleAddTutor = (newTutor) => {
        setTutores([...tutores, { ...newTutor, id: Date.now() }])
        setShowAddModal(false)
    }

    const handleUpdateTutor = (updatedTutor) => {
        setTutores(tutores.map(t => t.id === updatedTutor.id ? updatedTutor : t))
        setShowEditModal(false)
    }

    const handleConfirmDelete = () => {
        setTutores(tutores.filter(t => t.id !== selectedTutor.id))
        setShowDeleteModal(false)
        setSelectedTutor(null)
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Gestión de Tutores</h2>
                        <p className="text-sm text-gray-500">Administra los tutores del sistema</p>
                    </div>
                    <Button onClick={() => setShowAddModal(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Tutor
                    </Button>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <Input
                        placeholder="Buscar tutores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon
                    />
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center">
                            <thead className="bg-gray-50">
                                <tr className="border-b border-gray-200">
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Correo</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Teléfono</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTutores.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <p className="text-sm">No se encontraron tutores</p>
                                                <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTutores.map((tutor) => (
                                        <tr key={tutor.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {tutor.nombre} {tutor.apellido}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{tutor.correo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{tutor.telefono}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={tutor.estado ? "active" : "inactive"}>
                                                    {tutor.estado ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleEdit(tutor)} className="text-gray-600 hover:text-gray-900 p-1">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(tutor)} className="text-gray-600 hover:text-red-600 p-1">
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
            {showAddModal && <AddTutorModal onClose={() => setShowAddModal(false)} onAdd={handleAddTutor} />}
            {showEditModal && selectedTutor && <EditTutorModal tutor={selectedTutor} onClose={() => setShowEditModal(false)} onUpdate={handleUpdateTutor} />}
            {showDeleteModal && selectedTutor && <DeleteTutorModal tutor={selectedTutor} onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} />}
        </>
    )
}
