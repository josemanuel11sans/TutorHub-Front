import React from "react";
import { Users, UserCheck,UserStar, Building, DoorOpen, BookOpen, FolderTree, UserCog, BarChart3, UserRoundCog, ClipboardSignature } from "lucide-react"
import { Navbar } from "./components/Navbar";
import { useState } from "react"
import MateriasTable from "./tablas/MateriasTable";
import MaterialesTable from "./tablas/MaterialesTable";
import AsesoriasTable from "./tablas/AsesoriasTable";
import EspaciosTable from "./tablas/EspaciosTable";


const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
)

export default function TutorPage() {
  const [activeTab, setActiveTab] = useState("materias")

  const tabs = [
    { id: "materias", label: "Materias", icon: BarChart3 },
    { id: "materiales", label: "Materiales", icon: FolderTree },
    { id: "asesorias", label: "Asesorias", icon: BookOpen },
    { id: "espacios", label: "Espacios", icon: DoorOpen },
  ]
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Component */}
      <Navbar />

      {/* CONTENEDOR CENTRAL IGUAL QUE EN PANELCOORDINADOR */}
      <div className="max-w-[1400px] mx-auto p-6 space-y-6 pb-12">
        {/* Título del panel */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Panel de tutor</h2>
            <p className="text-sm text-gray-500">Administra todas asesorias y materiales</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Espacios</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">6</p>
                <p className="text-xs text-gray-500 mt-1">16 alumnos inscritos</p>
              </div>
              <DoorOpen className="h-8 w-8 text-gray-400" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Materias</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">20</p>
                <p className="text-xs text-gray-500 mt-1">Diversos ámbitos</p>
              </div>
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Asesorias registradas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">6</p>
                <p className="text-xs text-gray-500 mt-1">32</p>
              </div>
              <ClipboardSignature className="h-8 w-8 text-gray-400" />
            </div>
          </Card>
        </div>

        {/* Tabs de navegación */}
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

          {/* Contenido de tabs */}
          <div className="p-6">
            {activeTab === "materias" && <MateriasTable />}
            {activeTab === "materiales" && <MaterialesTable />}
            {activeTab === "asesorias" && <AsesoriasTable />}
            {activeTab === "espacios" && <EspaciosTable />}
          </div>
        </div>
      </div>
    </div>
  );
}