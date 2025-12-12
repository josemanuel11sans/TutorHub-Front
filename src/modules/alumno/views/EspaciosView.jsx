"use client"

import { useState, useEffect, useContext } from "react"
import { Search, Plus, Edit, Trash2, Users, FolderOpen, CheckCircle, Building2, DoorOpen } from "lucide-react"
import { AuthContext } from "../../../context/AuthContext"
import { getEspaciosBySCarrera } from "../../../api/espacios.api"

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
    default: "bg-gray-200 text-gray-700",
  }

  return (
    <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

// NOTE: removed local mock data — espacios now come from backend via getEspaciosBySCarrera

export default function EspaciosView({ onSelectEspacio, tutorId: propStudentId }) {
  const { user } = useContext(AuthContext)
  const [espacios, setEspacios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEspacio, setSelectedEspacio] = useState(null)

  // fetchEspacios moved to component scope so we can call it on demand
  const fetchEspacios = async () => {
    try {
      const id = propStudentId ?? user?.id
      if (!id) return
      const data = await getEspaciosBySCarrera(id)

      // Normalizar la respuesta a un arreglo y mapear campos esperados
      let raw = []
      if (Array.isArray(data)) raw = data
      else if (Array.isArray(data.espacios)) raw = data.espacios
      else if (Array.isArray(data.data)) raw = data.data
      else {
        console.warn('Respuesta inesperada al obtener espacios:', data)
      }

      const normalized = raw.map((r) => {

        // materiales: usa la misma lógica del listado de tutor (prioriza materialesCount)
        let materialesCount = 0
        if (typeof r.materialesCount === 'number') materialesCount = r.materialesCount
        else if (typeof r.materialesCount === 'string') materialesCount = Number(r.materialesCount)
        else if (Array.isArray(r.materiales)) materialesCount = r.materiales.length
        else if (Array.isArray(r.files)) materialesCount = r.files.length
        else if (typeof r.materiales === 'number') materialesCount = r.materiales

        return {
          id: r.id_espacio ?? r.id ?? r._id ?? null,
          nombre: r.nombre ?? r.name ?? "",
          materiaNombre: typeof r.materia === "object" ? r.materia.nombre_materia : (r.materiaNombre || r.materia || ""),
          materia: typeof r.materia === "object" ? r.materia.nombre_materia : (r.materiaNombre || r.materia || ""),
          materiaObj: r.materia ?? null,
          descripcion: r.descripcion ?? r.descripcion_corta ?? r.description ?? "",
          portada: r.portada ?? r.cover ?? r.image ?? null,
          materiales: Number(materialesCount ?? 0),
          color: r.color ?? r.bgColor ?? "bg-blue-500",
          _raw: r,
        }
      })

      console.log('Espacios (normalizados):', normalized.map((x) => ({ id: x.id, nombre: x.nombre, alumnos: x.alumnos, materiales: x.materiales })))
      setEspacios(normalized)

      // Guardar ids de espacios en localStorage para referencia posterior
      try {
        const ids = normalized.map((e) => e.id)
        console.log('Espacios obtenidos:', ids)
        if (ids.length) localStorage.setItem('espaciosIds', JSON.stringify(ids))
      } catch (err) {
        console.warn('No se pudo guardar espaciosIds en localStorage', err)
      }
    } catch (err) {
      console.error('Error al obtener espacios:', err)
    }
  }

  const filteredEspacios = espacios.filter((e) => {
    const nombre = (e.nombre || "").toString().toLowerCase()
    const materia = (e.materia || e.materiaNombre || "").toString().toLowerCase()
    const descripcion = (e.descripcion || "").toString().toLowerCase()
    const term = (searchTerm || "").toLowerCase()
    return nombre.includes(term) || materia.includes(term) || descripcion.includes(term)
  })

  // handleAddEspacio now se define más abajo y recibe la respuesta del API

  useEffect(() => {
    fetchEspacios()
  }, [user?.id, propStudentId])

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Espacios disponibles</h2>
            <p className="text-sm text-gray-500 mt-1">Selecciona un espacio para ver sus materiales</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => fetchEspacios()}
              variant="ghost"
              size="sm"
              className="mr-2 px-3 py-1 text-xs"
            >
              Actualizar
            </Button>
          </div>
        </div>

        {/* Buscador */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Input
            placeholder="Buscar espacios por nombre o materia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon
          />
        </div>

        {/* Grid de tarjetas tipo Classroom */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEspacios.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">
                <p className="text-sm">No se encontraron espacios</p>
                <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
              </div>
            </div>
          ) : (
            filteredEspacios.map((espacio, _idx) => (
              <div
                key={espacio.id ?? `espacio-${_idx}`}
                onClick={() => {
                  try {
                    localStorage.setItem('lastSelectedEspacioId', String(espacio.id))
                  } catch (err) {
                    /* noop */
                  }
                  onSelectEspacio(espacio)
                }}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                {/* Header con portada o color */}
                <div className={`h-24 relative overflow-hidden ${!espacio.portada ? espacio.color : ''}`}>
                  {espacio.portada ? (
                    <img src={espacio.portada} alt={`${espacio.nombre} - portada`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg width="120" height="60" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
                        <rect width="160" height="80" rx="6" fill="#F3F4F6" />
                        <g fill="#9CA3AF">
                          <rect x="12" y="18" width="40" height="28" rx="3" />
                          <rect x="60" y="14" width="88" height="12" rx="2" />
                          <rect x="60" y="32" width="56" height="8" rx="2" />
                        </g>
                      </svg>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex gap-1">
                    <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEnroll(espacio)
                        }}
                        className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm transition-colors"
                      >
                        <CheckCircle className="h-4 w-4 text-gray-700" />
                      </button>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">{espacio.nombre}</h3>
                  <p className="text-xs text-gray-500 mb-2">{espacio.materia}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{espacio.descripcion}</p>

                  {/* Se ocultó el contador de materiales porque no se recibe un valor confiable en esta vista */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modales */}
    </>
  )
}
