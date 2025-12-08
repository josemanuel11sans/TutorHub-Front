"use client"
import { Navbar } from "./components/Navbar"
import { useState } from "react"
import EspaciosView from "./views/EspaciosView"
import EspacioDetailView from "./views/EspacioDetailView"

export default function TutorPage() {
  const [selectedEspacio, setSelectedEspacio] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-[1400px] mx-auto p-6 space-y-6 pb-12">
        {selectedEspacio ? (
          <EspacioDetailView espacio={selectedEspacio} onBack={() => setSelectedEspacio(null)} />
        ) : (
          <EspaciosView onSelectEspacio={setSelectedEspacio} />
        )}
      </div>
    </div>
  )
}
