"use client";

import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { useAuth } from "./hooks/useAuth";

// CARDS
import MisEspaciosCountCard from "./components/MisEspaciosCountCard";
import MaterialesDescargadosCountCard from "./components/MaterialesDescargadosCountCard";
import MaterialesDisponiblesCountCard from "./components/MaterialesDisponiblesCountCard";

// TABLAS
import MisAsesoriasTable from "./tablas/MisAsesoriasTable";
import MisEspaciosTable from "./tablas/MisEspaciosTable";
import EspaciosDisponiblesTable from "./tablas/EspaciosDisponiblesTable";
import MaterialesDisponiblesTable from "./tablas/MaterialesDisponiblesTable";
import MaterialesDescargadosTable from "./tablas/MaterialesDescargadosTable";

// MOCK DATA
import { mockMateriales,mockEspacios,mockAccesosEspacios,mockDescargas,mockUsuarios} from "./hooks/mock-data";

// ICONS
import { FileText, DoorOpen, BookOpen, Clock } from "./components/Icons";

export default function AlumnoPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("asesorias");

  const misAccesos = mockAccesosEspacios.filter(
    (a) => a.alumno_id === user?.id && a.activo
  );

  const misEspaciosIds = misAccesos.map((a) => a.espacio_id);

  const misEspacios = mockEspacios.filter((e) =>
    misEspaciosIds.includes(e.id)
  );

  const espaciosDisponibles = mockEspacios.filter(
    (e) => !misEspaciosIds.includes(e.id)
  );

  const descargas = mockDescargas;

  const materialesDisponibles = mockMateriales.filter(
    (m) => misEspaciosIds.includes(m.espacio_id)
  );

  const materialesDescargados = mockMateriales.filter((m) =>
    descargas.some((d) => d.material_id === m.id && d.alumno_id === user?.id)
  );

  // AUX
  const getEspacioName = (id) =>
    mockEspacios.find((e) => e.id === id)?.nombre || "N/A";

  const getTutorName = (id) => {
    const t = mockUsuarios.find((u) => u.id === id);
    return t ? `${t.nombre} ${t.apellido_paterno}` : "N/A";
  };

  const formatFileSize = (bytes) =>
    bytes ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : "N/A";

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const tabs = [
    { id: "asesorias", label: "Mis Asesorías", icon: BookOpen },
    { id: "espaciosDisponibles", label: "Espacios disponibles", icon: DoorOpen },
    { id: "misEspacios", label: "Mis espacios", icon: DoorOpen },
    { id: "materiales", label: "Materiales Disponibles", icon: FileText },
    { id: "descargados", label: "Historial de descargas", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Component */}
      <Navbar />

      <div className="max-w-[1400px] mx-auto p-6 space-y-6 pb-12">
        {/* Título del panel */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Panel de Alumno</h2>
            <p className="text-sm text-gray-500">Administra todos los recursos del sistema</p>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid gap-4 md:grid-cols-3">
          <MisEspaciosCountCard userId={user?.id} />
          <MaterialesDescargadosCountCard userId={user?.id} />
          <MaterialesDisponiblesCountCard userId={user?.id} />
        </div>

        {/* TABS */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* CONTENIDO */}
          <div className="p-6">
            {activeTab === "asesorias" && (
              <MisAsesoriasTable
                asesorias={[]} // Ajusta cuando actives API
                getTutorName={getTutorName}
                formatDate={formatDate}
              />
            )}

            {activeTab === "espaciosDisponibles" && (
              <EspaciosDisponiblesTable
                espacios={mockEspacios}
                misEspaciosIds={misEspaciosIds}
                onInscribir={() => {}}
              />
            )}

            {activeTab === "misEspacios" && (
              <MisEspaciosTable
                misEspacios={misEspacios}
                materialesDisponibles={materialesDisponibles}
                onOpenDetail={() => {}}
              />
            )}

            {activeTab === "materiales" && (
              <MaterialesDisponiblesTable
                materiales={materialesDisponibles}
                yaDescargado={(id) =>
                  descargas.some((d) => d.material_id === id && d.alumno_id === user?.id)
                }
                handleDownload={() => {}}
                getEspacioName={getEspacioName}
                getTutorName={getTutorName}
                formatFileSize={formatFileSize}
                formatDate={formatDate}
              />
            )}

            {activeTab === "descargados" && (
              <MaterialesDescargadosTable
                materialesDescargados={materialesDescargados}
                descargas={descargas}
                user={user}
                getEspacioName={getEspacioName}
                handleDownload={() => {}}
                formatDate={formatDate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
