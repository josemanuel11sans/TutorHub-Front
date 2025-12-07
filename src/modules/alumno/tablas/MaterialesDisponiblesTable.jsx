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

const MATERIALES_MOCK = [
  {
    id: 1,
    titulo: "Guía Teórica Unidad 1",
    descripcion: "Resumen de conceptos clave.",
    espacio: "Sala 102",
    tutor: "Mtro. Juan Pérez",
    tamanio: "1.2 MB",
    fecha: "10/dic/2025",
  },
  {
    id: 2,
    titulo: "Ejercicios Unidad 2",
    descripcion: "Lista de ejercicios con soluciones.",
    espacio: "Aula Magna",
    tutor: "Mtra. Sofía Gómez",
    tamanio: "3.5 MB",
    fecha: "08/dic/2025",
  },
  {
    id: 3,
    titulo: "Proyecto Final — Plantilla",
    descripcion: "Formato base para el proyecto.",
    espacio: "Sala Creativa",
    tutor: "Mtro. Rodrigo Ríos",
    tamanio: "900 KB",
    fecha: "05/dic/2025",
  },
];

// ==============================
// TABLA PRINCIPAL
// ==============================

export default function MaterialesDisponiblesTable({ onDownload }) {
  const [materiales, setMateriales] = useState(MATERIALES_MOCK);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = materiales.filter((m) =>
    m.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Materiales Disponibles</h2>
        <p className="text-sm text-gray-500">Descarga los materiales proporcionados por tus tutores</p>
      </div>

      {/* BUSCADOR */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <Input
          placeholder="Buscar material..."
          value={searchTerm}
          icon
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* LISTA DE MATERIALES */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <FileText className="h-10 w-10 mx-auto opacity-30" />
          <p className="mt-2 text-sm">No hay materiales disponibles</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((mat) => (
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
          ))}
        </div>
      )}
    </div>
  );
}
