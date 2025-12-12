"use client"

import { useState } from "react"
import { Users, Computer, GraduationCap, UserCheck,UserStar, Building, DoorOpen, BookOpen, FolderTree, UserCog, BarChart3, UserRoundCog } from "lucide-react"
import { Navbar } from "./components/Navbar"
import CoordinadoresTable from "./tablas/CoordinadoresTable"
import TutoresTable from "./tablas/tutoresTable"
import AlumnosTable from "./tablas/AlumnosTable"
import EspaciosTable from "./tablas/EspaciosTable"
import EdificiosTable from "./tablas/EdificiosTable"
import CarreraTable from "./tablas/CarreraTable"
import AulaTable from "./tablas/AulaTable"
import MateriasTable from "./tablas/MateriasTable"
import UsersCountCard from "./components/UsersCountCard"
import BuildingCountCard from "./components/BuildingCountCard" 
import SubjectsCountCard from "./components/SubjectsCountCard"

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
)

export default function PanelCoordinador() {
  const [activeTab, setActiveTab] = useState("coordinadores")

  const tabs = [
    { id: "coordinadores", label: "Coordinadores", icon: UserRoundCog },
    { id: "tutores", label: "Tutores", icon: UserCheck },
    { id: "alumnos", label: "Alumnos", icon: UserStar },
    { id: "espacios", label: "Espacios", icon: Computer },
    { id: "edificios", label: "Edificios", icon: Building },
    { id: "aulas", label: "Aulas", icon: GraduationCap },
    { id: "materias", label: "Materias", icon: BookOpen },
    { id: "carreras", label: "Carreras", icon: FolderTree },
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
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <UsersCountCard />

          <BuildingCountCard />

          <SubjectsCountCard />
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
            {activeTab === "aulas" && <AulaTable />}
            {activeTab === "espacios" && <EspaciosTable />}
            {activeTab === "materias" && <MateriasTable />}
            {activeTab === "carreras" && <CarreraTable />}
          </div>
        </div>
      </div>
    </div>
  )
}