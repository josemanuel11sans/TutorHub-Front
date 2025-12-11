"use client"

import { useState } from "react"
import { X, Building2, FileText, MapPin } from "lucide-react"
import { createEdificio } from "../../../api/edificios.api"

export function AddEdificioModal({ onClose, onCreated }) {
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        ubicacion: "",
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Enviar datos con descripción incluida
            const dataToSend = {
                nombre: formData.nombre.trim(),
                ubicacion: formData.ubicacion,
                descripcion: formData.descripcion.trim() || null
            }

            const res = await createEdificio(dataToSend)

            if (onCreated) onCreated(res)
            onClose()
        } catch (error) {
            console.error("Error al crear edificio:", error)
            
            // Manejo de errores específicos
            if (error.message) {
                alert(error.message)
            } else {
                alert("Error al crear el edificio")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 relative">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Nuevo Edificio</h2>
                            <p className="text-gray-500 text-xs">Registra un nuevo edificio en el sistema</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Nombre */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                            <Building2 className="h-3.5 w-3.5 text-gray-400" />
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
                            focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
                            transition-all text-gray-900 placeholder:text-gray-400"
                            placeholder="Ej. Edificio A"
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                            <FileText className="h-3.5 w-3.5 text-gray-400" />
                            Descripción (opcional)
                        </label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
                            focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
                            transition-all resize-none text-gray-900 placeholder:text-gray-400"
                            placeholder="Escribe una descripción del edificio"
                            rows={3}
                        />
                    </div>

                    {/* Ubicación */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            Ubicación
                        </label>
                        <select
                            name="ubicacion"
                            value={formData.ubicacion}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
                            focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
                            transition-all text-gray-900"
                            required
                        >
                            <option value="">Selecciona una ubicación</option>
                            <option value="norte">Norte</option>
                            <option value="sur">Sur</option>
                            <option value="este">Este</option>
                            <option value="oeste">Oeste</option>
                            <option value="centro">Centro</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {loading ? "Guardando..." : "Crear"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}