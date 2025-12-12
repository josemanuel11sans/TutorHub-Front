"use client"

import { useEffect, useState, useContext } from "react"
import { Search, FolderOpen } from "lucide-react"
import { AuthContext } from "../../../context/AuthContext"
import { getEspaciosDeAlumno } from "../../../api/alumnoEspacio.api"

const Input = ({ ...props }) => (
  <div className="relative w-full">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    <input
      className="flex h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  </div>
)

export default function MisEspaciosView({ onSelectEspacio }) {
  const { user } = useContext(AuthContext)
  const [espacios, setEspacios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!user?.id) return

    const fetchMisEspacios = async () => {
      try {
        const data = await getEspaciosDeAlumno(user.id)
        setEspacios(data)
      } catch (err) {
        console.error("Error al obtener mis espacios:", err)
      }
    }

    fetchMisEspacios()
  }, [user?.id])

  const filtered = espacios.filter((e) => {
    const term = searchTerm.toLowerCase()
    return (
      e.nombre.toLowerCase().includes(term) ||
      e.materia?.nombre_materia?.toLowerCase().includes(term) ||
      e.descripcion?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Mis espacios</h2>
        <p className="text-sm text-gray-500">Espacios en los que ya estás inscrito, selecciona para ver tus asesorias</p>
      </div>

      {/* Buscador */}
      <Input
        placeholder="Buscar por nombre o materia..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">
              <p className="text-sm">No se encontraron espacios a los que estes inscrito</p>
              <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
            </div>
          </div>
        ) : (
          filtered.map((espacio) => (
            <div
              key={espacio.id_espacio}
              onClick={() => onSelectEspacio(espacio)}
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
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">{espacio.nombre}</h3>
                  <p className="text-xs text-gray-500 mb-2">{espacio.materia}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{espacio.descripcion}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 border-t pt-3">
                    <div className="flex items-center gap-1.5">
                      <FolderOpen className="h-4 w-4" />
                      <span>{espacio.materiales} materiales</span>
                    </div>
                  </div>
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
