"use client"

import { Navbar } from "./components/Navbar"
import { useState } from "react"
import EspaciosView from "./views/EspaciosView"
import MisEspaciosView from "./views/MisEspaciosView"
import EspacioDetailView from "./views/EspacioDetailView"
import { DoorOpen, DoorClosed } from "lucide-react"

export default function AlumnoPage() {
  const [activeTab, setActiveTab] = useState("mis")
  const [selectedEspacio, setSelectedEspacio] = useState(null)

  const tabs = [
    { id: "mis", label: "Mis espacios", icon: DoorClosed },
    { id: "disponibles", label: "Espacios disponibles", icon: DoorOpen },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-[1400px] mx-auto p-6 space-y-6 pb-12">
        {selectedEspacio ? (
          <EspacioDetailView
            espacio={selectedEspacio}
            onBack={() => setSelectedEspacio(null)}
          />
        ) : (
          <>
            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
                          activeTab === tab.id
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="p-6">
                {activeTab === "disponibles" && (
                  <EspaciosView onSelectEspacio={setSelectedEspacio} />
                )}

                {activeTab === "mis" && (
                  <MisEspaciosView onSelectEspacio={setSelectedEspacio} />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
