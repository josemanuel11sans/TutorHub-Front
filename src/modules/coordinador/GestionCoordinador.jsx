import { useState } from "react"
import { Users, Building, DoorOpen, BookOpen, FolderTree, UserCog, BarChart3 } from "lucide-react"

import UsuariosTable from "./UsuariosTable"
import EspaciosTable from "./EspaciosTable"
import EdificiosTable from "./EdificiosTable"
import CategoriasTable from "./CategoriasTable"
import ResponsablesTable from "./ResponsablesTable"
import RecursosTable from "./RecursosTable"
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
)

// Componente principal
export default function PanelCoordinador() {
  const [activeTab, setActiveTab] = useState("espacios")

  const tabs = [
    { id: "usuarios", label: "Usuarios", icon: Users },
    { id: "edificios", label: "Edificios", icon: Building },
    { id: "espacios", label: "Espacios", icon: DoorOpen },
    { id: "recursos", label: "Recursos", icon: BookOpen },
    { id: "categorias", label: "Categorías", icon: FolderTree },
    { id: "responsables", label: "Responsables", icon: UserCog },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white rounded-lg p-2 font-bold text-sm">
                SGE
              </div>
              <div>
                <h1 className="text-base font-semibold text-gray-900">Sistema de Gestión Educativa</h1>
                <p className="text-xs text-gray-500">Coordinador</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">CR</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
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
                <p className="text-sm font-medium text-gray-600">Recursos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">260</p>
                <p className="text-xs text-gray-500 mt-1">Distribuidos en 6 categorías</p>
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
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
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

          {/* Gestión de espacios */}
          <div className="p-6">
            {activeTab === "espacios" && <EspaciosTable />}
            {activeTab === "usuarios" && <UsuariosTable />}
            {activeTab === "edificios" && <EdificiosTable />} 
            {activeTab === "categorias" && <CategoriasTable />}
            {activeTab === "responsables" && <ResponsablesTable />}
            {activeTab === "recursos" && <RecursosTable />}

            {(activeTab !== "espacios" && activeTab !== "usuarios") && (
              <div className="text-center py-12">
                <p className="text-gray-500">Vista de {tabs.find(t => t.id === activeTab)?.label}</p>
                <p className="text-sm text-gray-400 mt-2">Esta vista aún no está implementada</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}