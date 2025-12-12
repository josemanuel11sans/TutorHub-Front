"use client";

import { Navbar } from "./components/Navbar";
import { useState, useEffect } from "react"
import EspaciosView from "./views/EspaciosView"
import EspacioDetailView from "./views/EspacioDetailView"
import { DoorClosed, DoorOpen } from "lucide-react";

export default function AlumnoPage() {
    const [selectedEspacio, setSelectedEspacio] = useState(null)
    const [activeTab, setActiveTab] = useState("coordinadores")
    
    const tabs = [
      { id: "disponibles", label: "Espacios disponibles", icon: DoorOpen },
      { id: "misEspacios", label: "Mis espacios", icon: DoorClosed },
    ]
    
  
    useEffect(() => {
      console.log('TutorPage mounted')
    }, [])
  
    useEffect(() => {
      console.log('TutorPage selectedEspacio changed:', selectedEspacio)
    }, [selectedEspacio])
  
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
  
        <div className="max-w-[1400px] mx-auto p-6 space-y-6 pb-12">
          {selectedEspacio ? (
            <EspacioDetailView espacio={selectedEspacio} onBack={() => setSelectedEspacio(null)} />
          ) : (
            <EspaciosView onSelectEspacio={(espacio) => setSelectedEspacio(espacio)} />
          )}
        </div>
      </div>
    )
}
