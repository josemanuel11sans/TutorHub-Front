"use client"

import { X, CheckCircle } from "lucide-react"

export function AttendanceAsesoriaModal({ asesoria, onClose, onConfirm }) {
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
            <div className="bg-blue-600 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">Confirmar Asistencia</h2>
              <p className="text-gray-500 text-xs">Registra la asistencia del alumno</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            ¿Deseas registrar que el alumno{" "}
            <span className="font-semibold">{asesoria.alumno}</span>{" "}
            asistió a la asesoría de{" "}
            <span className="font-semibold">{asesoria.materia}</span>{" "}
            programada el día{" "}
            <span className="font-semibold">{asesoria.fecha}</span>{" "}
            a las{" "}
            <span className="font-semibold">{asesoria.hora}</span>?
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2 mb-6">
            <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              Esta acción guardará el registro de asistencia en el sistema.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 
              bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 px-4 py-2 text-sm font-medium text-white 
              bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg 
              hover:from-blue-700 hover:to-blue-800 transition-all shadow-md 
              shadow-blue-500/20"
            >
              Confirmar Asistencia
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
