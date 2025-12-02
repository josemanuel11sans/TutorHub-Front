"use client"

import { useState } from "react"
import { Users, UserCheck,UserStar, Building, DoorOpen, BookOpen, FolderTree, UserCog, BarChart3, UserRoundCog } from "lucide-react"
import { Navbar } from "./components/Navbar"
import CoordinadoresTable from "./tablas/CoordinadoresTable"
import TutoresTable from "./tablas/tutoresTable"
import AlumnosTable from "./tablas/AlumnosTable"
import EdificiosTable from "./tablas/EdificiosTable"
import CategoriasTable from "./tablas/CategoriasTable"
import ResponsablesTable from "./tablas/ResponsablesTable"
import RecursosTable from "./tablas/RecursosTable"

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
)

export default function PanelCoordinador() {
  const [activeTab, setActiveTab] = useState("espacios")

  const tabs = [
    { id: "coordinadores", label: "Coordinadores", icon: UserRoundCog },
    { id: "tutores", label: "Tutores", icon: UserCheck },
    { id: "alumnos", label: "Alumnos", icon: UserStar },
    { id: "edificios", label: "Edificios", icon: Building },
    { id: "espacios", label: "Espacios", icon: DoorOpen },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Component */}
      <Navbar />

      <div className="max-w-[1400px] mx-auto p-6 space-y-6 pb-12">
        {/* Título del panel */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Panel de Coordinador</h2>
            <p className="text-sm text-gray-500">Administra todos los recursos del sistema</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <BarChart3 className="h-4 w-4" />
            Ver Estadísticas
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">6</p>
                <p className="text-xs text-gray-500 mt-1">3 alumnos, 2 tutores, 1 coordinador</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Edificios</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
                <p className="text-xs text-gray-500 mt-1">Con 5 espacios totales</p>
              </div>
              <Building className="h-8 w-8 text-gray-400" />
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
            {activeTab === "coordinadores" && <CoordinadoresTable />}
            {activeTab === "tutores" && <TutoresTable />}
            {activeTab === "alumnos" && <AlumnosTable />}

            {activeTab === "edificios" && <EdificiosTable />}
          </div>
        </div>
      </div>
    </div>
  )
}