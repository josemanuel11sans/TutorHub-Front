import { useState } from "react";
import { Search, DoorOpen, FolderOpen } from "lucide-react";
import { MaterialesDelEspacioModal } from "../modales/MaterialesDelEspacioModal";

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

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
    {children}
  </span>
);

// ==============================
//  MOCK DATA
// ==============================

const MIS_ESPACIOS_MOCK = [
  { id: 1, nombre: "Sala 102", descripcion: "Laboratorio de Software", capacidad: 25 },
  { id: 2, nombre: "Sala Creativa", descripcion: "Espacio colaborativo", capacidad: 15 },
];

const MATERIALES_MOCK = [
  { id: 1, espacio_id: 1, titulo: "Guía de laboratorio", descripcion: "Práctica introductoria" },
  { id: 2, espacio_id: 1, titulo: "Diagrama UML", descripcion: "Caso práctico" },
  { id: 3, espacio_id: 2, titulo: "Plantilla Creativa", descripcion: "Formato editable" },
];

// ==============================
// COMPONENTE PRINCIPAL
// ==============================

export default function MisEspaciosTable() {
  const [espacios] = useState(MIS_ESPACIOS_MOCK);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);

  const filtered = espacios.filter((e) =>
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerMateriales = (id) => {
    const espacio = espacios.find((e) => e.id === id);
    setEspacioSeleccionado(espacio);
    setModalOpen(true);
  };

  const handleDownload = (material) => {
    console.log("Simulando descarga:", material);
  };

  return (
    <>
      <div className="space-y-4">

        {/* HEADER */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Mis Espacios</h2>
          <p className="text-sm text-gray-500">Espacios en los que ya estás inscrito</p>
        </div>

        {/* BUSCADOR */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Input
            placeholder="Buscar en mis espacios..."
            value={searchTerm}
            icon
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* GRID */}
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <DoorOpen className="h-10 w-10 mx-auto opacity-30" />
            <p className="text-sm mt-2">No estás inscrito en ningún espacio</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((espacio) => (
              <div
                key={espacio.id}
                className="rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <DoorOpen className="h-6 w-6 text-blue-600" />
                  <Badge>{espacio.capacidad} personas</Badge>
                </div>

                <h3 className="text-lg font-medium mt-2">{espacio.nombre}</h3>
                <p className="text-gray-600 text-sm">{espacio.descripcion}</p>

                <button
                  onClick={() => handleVerMateriales(espacio.id)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md text-sm 
                  hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <FolderOpen className="h-4 w-4" />
                  Consultar materiales
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <MaterialesDelEspacioModal
          espacio={espacioSeleccionado}
          materiales={MATERIALES_MOCK}
          onClose={() => setModalOpen(false)}
          onDownload={handleDownload}
        />
      )}
    </>
  );
}
