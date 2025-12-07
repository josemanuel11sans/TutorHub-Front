import { useState } from "react";
import { Search, FileText, Download } from "lucide-react";

// ==============================
// COMPONENTES UI BASE
// ==============================

const Input = ({ className = "", icon, ...props }) => (
  <div className="relative w-full">
    {icon && (
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    )}
    <input
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
      focus:outline-none focus:ring-2 focus:ring-blue-500
      ${icon ? "pl-10" : ""} ${className}`}
      {...props}
    />
  </div>
);

// ==============================
// DATOS DE PRUEBA (MOCK)
// ==============================

const DESCARGAS_MOCK = [
  {
    id: 1,
    archivo: "Guía de Ejercicios - Unidad 2.pdf",
    espacio: "Sala 102",
    fecha: "09/dic/2025",
    tamanio: "2.4 MB",
  },
  {
    id: 2,
    archivo: "Ejemplo de Código - Arquitecturas.zip",
    espacio: "Sala Creativa",
    fecha: "08/dic/2025",
    tamanio: "5.1 MB",
  },
  {
    id: 3,
    archivo: "Presentación Tema 4.pptx",
    espacio: "Aula Magna",
    fecha: "05/dic/2025",
    tamanio: "3.2 MB",
  },
];

// ==============================
// TABLA PRINCIPAL
// ==============================

export default function HistorialDescargasTable({ onDownloadAgain }) {
  const [descargas, setDescargas] = useState(DESCARGAS_MOCK);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = descargas.filter((d) =>
    d.archivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Historial de Descargas</h2>
        <p className="text-sm text-gray-500">Archivos que has descargado anteriormente</p>
      </div>

      {/* BUSCADOR */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <Input
          placeholder="Buscar archivo..."
          value={searchTerm}
          icon
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* LISTA DE DESCARGAS */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <FileText className="h-10 w-10 mx-auto opacity-30" />
          <p className="mt-2 text-sm">No has descargado ningún archivo aún</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition flex items-center justify-between"
            >
              {/* IZQUIERDA: ICONO + INFO */}
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-blue-600" />

                <div>
                  <p className="font-medium text-gray-900">{item.archivo}</p>
                  <p className="text-sm text-gray-600">
                    {item.espacio} • {item.tamanio}
                  </p>
                </div>
              </div>

              {/* DERECHA: FECHA + BOTÓN */}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{item.fecha}</p>

                <button
                  className="mt-2 bg-gray-100 border rounded px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 flex items-center gap-1"
                  onClick={() => onDownloadAgain?.(item)}
                >
                  <Download className="h-3 w-3" />
                  Descargar otra vez
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
