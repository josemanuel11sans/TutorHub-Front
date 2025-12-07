"use client";

import { X, FileText, Download, FolderOpen } from "lucide-react";

export function MaterialesDelEspacioModal({ espacio, materiales, onClose, onDownload }) {
  if (!espacio) return null;

  const materialesFiltrados = materiales.filter(
    (m) => m.espacio_id === espacio.id
  );

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 relative">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FolderOpen className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Materiales del espacio: {espacio.nombre}
              </h2>
              <p className="text-gray-500 text-xs">Archivos disponibles para descarga</p>
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
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">

          {materialesFiltrados.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              No hay materiales publicados para este espacio.
            </p>
          ) : (
            materialesFiltrados.map((mat) => (
              <div
                key={mat.id}
                className="rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition flex justify-between"
              >
                {/* IZQUIERDA */}
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-blue-600" />

                  <div>
                    <p className="font-medium text-gray-900">{mat.titulo}</p>
                    <p className="text-sm text-gray-600">{mat.descripcion}</p>

                    <p className="text-xs text-gray-500 mt-1">
                      {mat.espacio} • {mat.tutor}
                    </p>
                  </div>
                </div>

                {/* DERECHA */}
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{mat.fecha}</p>
                  <p className="text-xs text-gray-500">{mat.tamanio}</p>

                  <button
                    className="mt-2 bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700 transition flex items-center gap-1"
                    onClick={() => onDownload?.(mat)}
                  >
                    <Download className="h-4 w-4" />
                    Descargar
                  </button>
                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}
