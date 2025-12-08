"use client"

import { useState, useEffect, useContext } from "react"
import { Search, Plus, Edit, Trash2, FileText } from "lucide-react"
import { AddMaterialModal } from "../modales/AddMaterialModal"
import { DeleteMaterialModal } from "../modales/DeleteMaterialModal"
import { EditMaterialModal } from "../modales/EditMaterialModal"
import { AuthContext } from "../../../context/AuthContext"
import { getFilesByUser } from "../../../api/claudinary.api"

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
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  )
}

const Input = ({ className = "", icon, ...props }) => (
  <div className="relative w-full">
    {icon && <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />}
    <input
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${icon ? "pl-10" : ""} ${className}`}
      {...props}
    />
  </div>
)

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-500",
    pdf: "bg-red-100 text-red-800",
    ppt: "bg-orange-100 text-orange-800",
    doc: "bg-blue-100 text-blue-800",
    default: "bg-gray-200 text-gray-700",
  }

  return (
    <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

// Datos de prueba
const MATERIALES_MOCK = [
  {
    id: 1,
    nombre: "Introducción a React Hooks",
    espacio: "Desarrollo Web Avanzado",
    tipo_archivo: "PDF",
    estado: true,
    fecha: "2024-01-15",
  },
  {
    id: 2,
    nombre: "Patrones de diseño en JavaScript",
    espacio: "Desarrollo Web Avanzado",
    tipo_archivo: "PPT",
    estado: true,
    fecha: "2024-01-12",
  },
  {
    id: 3,
    nombre: "Normalización de Bases de Datos",
    espacio: "Bases de Datos II",
    tipo_archivo: "PDF",
    estado: true,
    fecha: "2024-01-10",
  },
  {
    id: 4,
    nombre: "SQL Avanzado - Optimización",
    espacio: "Bases de Datos II",
    tipo_archivo: "PDF",
    estado: true,
    fecha: "2024-01-08",
  },
  {
    id: 5,
    nombre: "Arquitectura Hexagonal",
    espacio: "Arquitectura de Software",
    tipo_archivo: "PPT",
    estado: false,
    fecha: "2024-01-05",
  },
  {
    id: 6,
    nombre: "Clean Code Principles",
    espacio: "Arquitectura de Software",
    tipo_archivo: "PDF",
    estado: true,
    fecha: "2024-01-03",
  },
]

export default function MaterialesView({ tutorId: propTutorId }) {
  const { user } = useContext(AuthContext)
  const [materiales, setMateriales] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  const filteredMateriales = materiales.filter(
    (m) =>
      m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.espacio.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (material) => {
    setSelectedMaterial(material)
    setShowEditModal(true)
  }

  const handleDelete = (material) => {
    setSelectedMaterial(material)
    setShowDeleteModal(true)
  }

  const handleAddMaterial = () => {
    // Cuando se cierra el modal de agregar, re-fetch de archivos se maneja en useEffect
    setShowAddModal(false)
  }

  const handleUpdateMaterial = (updatedMaterial) => {
    setMateriales(materiales.map((m) => (m.id === updatedMaterial.id ? updatedMaterial : m)))
    setShowEditModal(false)
  }

  const handleConfirmDelete = () => {
    setMateriales(materiales.filter((m) => m.id !== selectedMaterial.id))
    setShowDeleteModal(false)
  }

  const getFileIcon = (tipo) => {
    return <FileText className="h-5 w-5 text-gray-400" />
  }

  const getFileBadgeVariant = (tipo) => {
    if (tipo === "PDF") return "pdf"
    if (tipo === "PPT") return "ppt"
    if (tipo === "DOC") return "doc"
    return "default"
  }

  // Helper para convertir la respuesta del backend a la forma que espera la UI
  const mapFileToMaterial = (file) => {
    const nombre = file.originalName || file.publicId || "Archivo"
    const fecha = file.createdAt ? file.createdAt.split("T")[0] : ""
    let tipo_archivo = "OTRO"
    const mt = (file.mimetype || "").toLowerCase()
    if (mt.includes("pdf")) tipo_archivo = "PDF"
    else if (mt.includes("presentation") || mt.includes("powerpoint") || file.originalName?.toLowerCase().endsWith(".ppt") || file.originalName?.toLowerCase().endsWith(".pptx")) tipo_archivo = "PPT"
    else if (mt.includes("word") || file.originalName?.toLowerCase().endsWith(".doc") || file.originalName?.toLowerCase().endsWith(".docx")) tipo_archivo = "DOC"
    else if (mt.includes("image")) tipo_archivo = "IMG"

    return {
      id: file.id,
      nombre,
      espacio: file.folder || "general",
      tipo_archivo,
      estado: true,
      fecha,
      url: file.url,
      publicId: file.publicId,
    }
  }

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const id = propTutorId ?? user?.id
        if (!id) return
        const data = await getFilesByUser(id)
        if (Array.isArray(data)) {
          setMateriales(data.map(mapFileToMaterial))
        } else if (Array.isArray(data.data)) {
          setMateriales(data.data.map(mapFileToMaterial))
        } else {
          console.warn('Formato inesperado de archivos:', data)
        }
      } catch (err) {
        console.error('Error cargando archivos:', err)
      }
    }

    fetchFiles()
  }, [user?.id, propTutorId, showAddModal])

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Materiales Publicados</h2>
            <p className="text-sm text-gray-500">Como publicaciones en Classroom dentro de cada espacio</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Publicar Material
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Input
            placeholder="Buscar materiales por nombre o espacio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon
          />
        </div>

        {/* Lista de materiales tipo feed */}
        <div className="space-y-3">
          {filteredMateriales.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-gray-500">
                <p className="text-sm">No se encontraron materiales</p>
                <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
              </div>
            </div>
          ) : (
            filteredMateriales.map((material) => (
              <div
                key={material.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getFileIcon(material.tipo_archivo)}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{material.nombre}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <span className="text-xs">{material.espacio}</span>
                          <span>•</span>
                          <span className="text-xs">{material.fecha}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getFileBadgeVariant(material.tipo_archivo)}>{material.tipo_archivo}</Badge>
                          <Badge variant={material.estado ? "active" : "inactive"}>
                            {material.estado ? "Publicado" : "Borrador"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(material)}
                        className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(material)}
                        className="text-gray-600 hover:text-red-600 p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modales */}
      {showAddModal && <AddMaterialModal onClose={() => setShowAddModal(false)} />}
      {showEditModal && selectedMaterial && (
        <EditMaterialModal
          material={selectedMaterial}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateMaterial}
        />
      )}
      {showDeleteModal && selectedMaterial && (
        <DeleteMaterialModal
          material={selectedMaterial}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  )
}
