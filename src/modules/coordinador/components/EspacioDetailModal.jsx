import { X, Calendar } from "./Icons"
import { Button } from "./Button"
import { Badge } from "./Badge"

export function EspacioDetailModal({ espacio, isOpen, onClose, onEdit, onDelete }) {
  if (!isOpen || !espacio) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {espacio.nombre}
            </h2>
            <Badge variant={espacio.estado ? "success" : "secondary"}>
              {espacio.estado ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Portada */}
          {espacio.portada && (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={espacio.portada}
                alt={espacio.nombre}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Descripción */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Descripción
            </h3>
            <p className="text-gray-600">
              {espacio.descripcion || "Sin descripción"}
            </p>
          </div>

          {/* Información del tutor */}
          {espacio.tutor && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Tutor
              </h3>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    {espacio.tutor.nombre} {espacio.tutor.apellido}
                  </p>
                  <p className="text-sm text-gray-600">
                    {espacio.tutor.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Fecha de Creación
              </h3>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formatDate(espacio.createdAt)}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Última Actualización
              </h3>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formatDate(espacio.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  )
}