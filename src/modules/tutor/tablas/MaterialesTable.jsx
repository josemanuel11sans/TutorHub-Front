import { useState } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { AddMaterialModal } from "../modales/AddMaterialModal"
import { DeleteMaterialModal } from "../modales/DeleteMaterialModal"
import { EditMaterialModal } from "../modales/EditMaterialModal"
// import { AddMaterialModal } from "../modales/AddMaterialModal"
// import { EditMaterialModal } from "../modales/EditMaterialModal"
// import { DeleteMaterialModal } from "../modales/DeleteMaterialModal"

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
const MATERIALES_MOCK = [
    { id: 1, nombre: "Arquitecturas de Software", espacio: "4", tipo_archivo: "pdf", estado: true },
    { id: 2, nombre: "Bases de Datos", espacio: "4", tipo_archivo: "PPP", estado: true },
    { id: 3, nombre: "Desarrollo Web", espacio: "4", tipo_archivo: "PPP",estado: false }
]

export default function MaterialesTable() {
    const [materiales, setMateriales] = useState(MATERIALES_MOCK)
    const [searchTerm, setSearchTerm] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedMaterial, setSelectedMaterial] = useState(null)

    const filteredMateriales = materiales.filter(a =>
        a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.estado.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleEdit = (material) => {
        setSelectedMaterial(material)
        setShowEditModal(true)
    }

    const handleDelete = (material) => {
        setSelectedMaterial(material)
        setShowDeleteModal(true)
    }

    const handleAddMaterial= (newmaterial) => {
        setMateriales([...materiales, { ...newmaterial, id: Date.now() }])
        setShowAddModal(false)
    }

    const handleUpdateMaterial= (updatedMateria) => {
        setMateriales(materiales.map(a => a.id === updatedMateria.id ? updatedMateria: a))
        setShowEditModal(false)
    }

    const handleConfirmDelete = () => {
        setMateriales(materiales.filter(a => a.id !== selectedMateria.id))
        setShowDeleteModal(false)
        setSelectedMaterial(null)
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Gestión de Materiales</h2>
                        <p className="text-sm text-gray-500">Administra los materiales del sistema</p>
                    </div>
                    <Button onClick={() => setShowAddModal(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Materia
                    </Button>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <Input
                        placeholder="Buscar materiales..."
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
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Nombre del material</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Espacio</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Tipo de archivo</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredMateriales.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <p className="text-sm">No se encontraron Materiales</p>
                                                <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMateriales.map((material) => (
                                        <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {material.nombre}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {material.espacio}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {material.tipo_archivo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={material.estado ? "active" : "inactive"}>
                                                    {material.estado ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleEdit(material)} className="text-gray-600 hover:text-gray-900 p-1">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(material)} className="text-gray-600 hover:text-red-600 p-1">
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
            {showAddModal && <AddMaterialModal onClose={() => setShowAddModal(false)} onAdd={handleAddMaterial} />}
            {showEditModal && selectedMaterial&& <EditMaterialModal material={selectedMaterial} onClose={() => setShowEditModal(false)} onUpdate={handleUpdateMaterial} />}
            {showDeleteModal && selectedMaterial&& <DeleteMaterialModal material={selectedMaterial} onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} />}
        </>
    )
}
