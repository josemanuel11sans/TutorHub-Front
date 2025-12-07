import { useState } from "react";
import { Search, DoorOpen } from "lucide-react";
import { InscribirEspacioModal } from "../modales/InscribirEspacioModal";

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
  <span className="inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700">
    {children}
  </span>
);

// ==============================
// DATOS DE PRUEBA
// ==============================

const ESPACIOS_MOCK = [
  { id: 1, nombre: "Sala 102", descripcion: "Laboratorio de Software", capacidad: 25 },
  { id: 2, nombre: "Aula Magna", descripcion: "Auditorio principal", capacidad: 80 },
  { id: 3, nombre: "Sala Creativa", descripcion: "Espacio colaborativo", capacidad: 15 },
];

// ==============================
// TABLA PRINCIPAL
// ==============================

export default function EspaciosDisponiblesTable() {
  const [espacios, setEspacios] = useState(ESPACIOS_MOCK);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para modal
  const [modalOpen, setModalOpen] = useState(false);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);

  const filtered = espacios.filter((e) =>
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal
  const handleOpenModal = (espacio) => {
    setEspacioSeleccionado(espacio);
    setModalOpen(true);
  };

  // Confirmar inscripción (solo mock)
  const handleConfirm = () => {
    console.log("Inscrito en:", espacioSeleccionado);
    setModalOpen(false);
    setEspacioSeleccionado(null);
  };

  return (
    <>
      <div className="space-y-4">
        {/* HEADER */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Espacios Disponibles</h2>
          <p className="text-sm text-gray-500">Consulta e inscríbete a un espacio</p>
        </div>

        {/* BUSCADOR */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Input
            placeholder="Buscar espacios..."
            value={searchTerm}
            icon
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* LISTA / GRID */}
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
                onClick={() => handleOpenModal(espacio)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700 transition"
              >
                Inscribirme
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <InscribirEspacioModal
          espacio={espacioSeleccionado}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
