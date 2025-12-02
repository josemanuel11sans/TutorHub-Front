import { useState } from "react"

export function AddMateriaModal({ onClose, onAdd, carreras }) {
    const [formData, setFormData] = useState({
        nombre: "",
        objetivo: "",
        estado: true,
        carrera_id: ""
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.nombre.trim() || !formData.objetivo.trim() || !formData.carrera_id) {
            alert("Todos los campos son obligatorios")
            return
        }
        onAdd(formData)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Agregar Nueva Materia</h3>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre de la Materia *
                            </label>
                            <input
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: Matemáticas I"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción/Objetivo *
                            </label>
                            <textarea
                                value={formData.objetivo}
                                onChange={(e) => setFormData({...formData, objetivo: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Describe la materia..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Carrera *
                            </label>
                            <select
                                value={formData.carrera_id}
                                onChange={(e) => setFormData({...formData, carrera_id: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecciona una carrera</option>
                                {carreras.map(carrera => (
                                    <option key={carrera.id_carrera} value={carrera.id_carrera}>
                                        {carrera.nombre_carrera}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.estado}
                                    onChange={(e) => setFormData({...formData, estado: e.target.checked})}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Activa</span>
                            </label>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Crear Materia
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}