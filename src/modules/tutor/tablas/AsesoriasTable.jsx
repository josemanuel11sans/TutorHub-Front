import { useState } from "react"
import { Search, Plus, Edit, Trash2, Check } from "lucide-react"
import { AddAsesoriaModal } from "../modales/AddAsesoriaModal"
import { DeleteAsesoriaModal } from "../modales/DeleteAsesoriaModal"
import { EditAsesoriaModal } from "../modales/EditAsesoriaModal"
import { AttendanceAsesoriaModal } from "../modales/AttendanceAsesoriaModal"


// Botón compacto
const Button = ({ children, onClick, variant = "default", size = "default", className = "" }) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors"
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        ghost: "hover:bg-gray-100 text-gray-700",
    }
    const sizes = {
        default: "px-4 py-2",
        sm: "px-2 py-1 text-sm",
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
const ASESORIAS_MOCK = [
    { id: 1, materia: "Arquitecturas de Software", fecha: "09/dic/2025", hora: "5:00 PM", alumno: "Juan Carlos Garcia", estado: true },
    { id: 2, materia: "Arquitecturas de Software", fecha: "09/dic/2025", hora: "5:00 PM", alumno: "Juan Carlos Garcia", estado: true },
    { id: 3, materia: "Arquitecturas de Software", fecha: "09/dic/2025", hora: "5:00 PM", alumno: "Juan Carlos Garcia", estado: true },
]

export default function AsesoriasTable() {
    const [asesorias, setAsesorias] = useState(ASESORIAS_MOCK)
    const [searchTerm, setSearchTerm] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedAsesoria, setSelectedAsesoria] = useState(null)
    const [showAttendanceModal, setShowAttendanceModal] = useState(false)

    const filteredAsesorias = asesorias.filter(a =>
        a.materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.estado.toString().toLowerCase().includes(searchTerm.toLowerCase())

    )

    const handleEdit = (asesoria) => {
        setSelectedAsesoria(asesoria)
        setShowEditModal(true)
    }

    const handleDelete = (asesoria) => {
        setSelectedAsesoria(asesoria)
        setShowDeleteModal(true)
    }

    const handleAddAsesoria= (newAsesoria) => {
        setAsesorias([...asesorias, { ...newAsesoria, id: Date.now() }])
        setShowAddModal(false)
    }

    const handleUpdateAsesoria= (updatedAsesoria) => {
        setAsesorias(asesorias.map(a => a.id === updatedAsesoria.id ? updatedAsesoria: a))
        setShowEditModal(false)
    }

    const handleConfirmDelete = () => {
        setAsesorias(asesorias.filter(a => a.id !== selectedAsesoria.id))
        setShowDeleteModal(false)
        setSelectedAsesoria(null)
    }

    const handleAttendance = (asesoria) => {
        setSelectedAsesoria(asesoria)
        setShowAttendanceModal(true)
    }

    const handleConfirmAttendace = () => {
        setAsesorias(asesorias.map(a => a.id === selectedAsesoria.id ? { ...a, asistencia: true } : a))
        setShowAttendanceModal(false)
        setSelectedAsesoria(null)
    }


    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Gestión de Asesorias</h2>
                        <p className="text-sm text-gray-500">Administra los asesorias del sistema</p>
                    </div>
                    <Button onClick={() => setShowAddModal(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Asesoria
                    </Button>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <Input
                        placeholder="Buscar asesorias..."
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
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Materia</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Alumno</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Asistencia</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAsesorias.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <p className="text-sm">No se encontraron Asesorias</p>
                                                <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAsesorias.map((asesoria) => (
                                        <tr key={asesoria.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {asesoria.materia}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {asesoria.fecha} - {asesoria.hora}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {asesoria.alumno}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={asesoria.estado ? "active" : "inactive"}>
                                                    {asesoria.estado ? "Confirmada" : "Cancelada"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={asesoria.asistencia ? "active" : "inactive"}>
                                                    {asesoria.asistencia ? "Asistio" : "No Asistio"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleEdit(asesoria)} className="text-gray-600 hover:text-gray-900 p-1">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(asesoria)} className="text-gray-600 hover:text-red-600 p-1">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleAttendance(asesoria)} className="text-gray-600 hover:text-green-600 p-1">
                                                        <Check className="h-4 w-4" />
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
            {showAddModal && <AddAsesoriaModal onClose={() => setShowAddModal(false)} onAdd={handleAddAsesoria} />}
            {showEditModal && selectedAsesoria&& <EditAsesoriaModal asesoria={selectedAsesoria} onClose={() => setShowEditModal(false)} onUpdate={handleUpdateAsesoria} />}
            {showDeleteModal && selectedAsesoria&& <DeleteAsesoriaModal asesoria={selectedAsesoria} onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} />}
            {showAttendanceModal && selectedAsesoria&& <AttendanceAsesoriaModal asesoria={selectedAsesoria} onClose={() => setShowAttendanceModal(false)} onConfirm={handleConfirmAttendace} />}
        </>
    )
}
