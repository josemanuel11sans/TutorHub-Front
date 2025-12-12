"use client"

import { useState, useEffect } from "react"
import { X, DoorOpen, FileText, Building2 } from "lucide-react"
import { getEdificios } from "../../../api/edificios.api"

export function AddAulaModal({ onClose, onAdd, edificios = [] }) {
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        edificioId: "",
        edificioNombre: "",
        estado: true,
    })
    const [loading, setLoading] = useState(false)
    const [edificiosList, setEdificiosList] = useState([])
    const [loadingEdificios, setLoadingEdificios] = useState(false)
    const [errorEdificios, setErrorEdificios] = useState(null)

    // Cargar edificios y mostrar solo activos
    useEffect(() => {
        let isMounted = true
        const fetchEdificios = async () => {
            try {
                setLoadingEdificios(true)
                setErrorEdificios(null)
                const data = await getEdificios()
                if (!isMounted) return
                const list = Array.isArray(data) ? data : []
                setEdificiosList(list)
            } catch (err) {
                if (!isMounted) return
                setErrorEdificios(err?.message || "No se pudieron cargar los edificios")
            } finally {
                if (isMounted) setLoadingEdificios(false)
            }
        }
        // Si el padre no pasa edificios, o pasa vacío, cargamos nosotros
        if (!edificios || edificios.length === 0) {
            fetchEdificios()
        } else {
            setEdificiosList(edificios)
        }
        return () => { isMounted = false }
    }, [edificios])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        
        if (name === "edificioId") {
            const activos = (edificios?.length ? edificios : edificiosList).filter(e => e?.estado)
            const edificioSeleccionado = activos.find(e => e.id === parseInt(value))
            setFormData({
                ...formData,
                edificioId: value,
                edificioNombre: edificioSeleccionado ? edificioSeleccionado.nombre : ""
            })
        } else {
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value,
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            await onAdd(formData)
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
                            <DoorOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Nueva Aula</h2>
                            <p className="text-gray-500 text-xs">Registra una nueva aula en el sistema</p>
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
                            <DoorOpen className="h-3.5 w-3.5 text-gray-400" />
                            Nombre del aula
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                            placeholder="Ej: Aula 101"
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                            <FileText className="h-3.5 w-3.5 text-gray-400" />
                            Descripción
                        </label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400"
                            placeholder="Escribe una descripción del aula"
                            rows={3}
                            required
                        />
                    </div>

                    {/* Edificio */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                            <Building2 className="h-3.5 w-3.5 text-gray-400" />
                            Edificio
                        </label>
                        <select
                            name="edificioId"
                            value={formData.edificioId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                            required
                        >
                            <option value="" disabled={loadingEdificios}>
                                {loadingEdificios ? "Cargando edificios..." : "Selecciona un edificio"}
                            </option>
                            {(edificios?.length ? edificios : edificiosList)
                                .filter(e => e?.estado)
                                .map((edificio) => (
                                    <option key={edificio.id} value={edificio.id}>
                                        {edificio.nombre}
                                    </option>
                                ))}
                        </select>
                        {errorEdificios && (
                            <p className="text-xs text-red-600">{errorEdificios}</p>
                        )}
                    </div>

                    {/* Estado */}
                    <div className="hidden items-center gap-2">
                        <input
                            type="checkbox"
                            name="estado"
                            checked={formData.estado}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label className="text-sm text-gray-700">Activo</label>
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
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}