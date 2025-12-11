"use client"

import { X, CheckCircle } from "lucide-react"

export function ConfirmAsesoriaModal({ asesoria, onClose, onConfirm, isLoading = false }) {
  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 relative">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">Confirmar Asesoría</h2>
              <p className="text-gray-500 text-xs">Marcar como confirmada</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            ¿Deseas confirmar la asesoría con el alumno{" "}
            <span className="font-semibold">
              {asesoria.estudiante?.nombre} {asesoria.estudiante?.apellido}
            </span>
            {" "}con el tutor{" "}
            <span className="font-semibold">
              {asesoria.tutor?.nombre} {asesoria.tutor?.apellido}
            </span>
            , programada para el día{" "}
            <span className="font-semibold">{asesoria.fecha}</span>
            {" "}a las{" "}
            <span className="font-semibold">{asesoria.hora}</span>?
          </p>

          {asesoria.comentarios && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6">
              <p className="text-xs text-blue-700 font-medium mb-1">Comentarios:</p>
              <p className="text-xs text-blue-600 italic">"{asesoria.comentarios}"</p>
            </div>
          )}

          <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex gap-2 mb-6">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-700">
              Esta acción marcará la asesoría como confirmada en el sistema.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 
              bg-gray-100 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white 
              bg-gradient-to-r from-green-600 to-green-700 rounded-lg 
              hover:from-green-700 hover:to-green-800 transition-all shadow-md 
              shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin">⟳</span>
                  Confirmando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Confirmar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
