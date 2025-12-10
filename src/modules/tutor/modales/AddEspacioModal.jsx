"use client";

import { useEffect, useState } from "react";
import { X, Layers, FileText, Hash } from "lucide-react";
import { getMaterias } from "../../../api/materias.api";
import { createEspacio } from "../../../api/espacios.api";
import { UploadFileModal } from "./UploadFileModal";

export function AddEspacioModal({ onClose, onCreated }) {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  //saca el id del tutor del local storage
  const tutor = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    portada: "",
    tutor_id: tutor.id,
    materia_id: "",
  });

  // Cargar materias
  useEffect(() => {
    cargarMaterias();
  }, []);

  const cargarMaterias = async () => {
    try {
      const data = await getMaterias();
      setMaterias(data);
    } catch (error) {
      console.error("Error al cargar materias", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const CrearEspacio = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createEspacio(formData);

      if (onCreated) onCreated(res);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al crear el espacio");
    }

    setLoading(false);
  };

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
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Nuevo Espacio</h2>
              <p className="text-gray-500 text-xs">
                Registra un nuevo espacio en el sistema
              </p>
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
        <form onSubmit={CrearEspacio} className="p-6 space-y-4">
          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <Layers className="h-3.5 w-3.5 text-gray-400" />
              Nombre del espacio
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
              transition-all text-gray-900 placeholder:text-gray-400"
              placeholder="Ej. Aula 101"
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <FileText className="h-3.5 w-3.5 text-gray-400" />
              Descripción
            </label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
              focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
              transition-all text-gray-900 placeholder:text-gray-400"
              placeholder="Ej. Laboratorio de computación"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <FileText className="h-3.5 w-3.5 text-gray-400" />
              URL de portada
            </label>
            <input
              type="text"
              name="portada"
              value={formData.portada}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
    focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
    transition-all text-gray-900 placeholder:text-gray-400"
              placeholder="https://ejemplo.com/imagen.jpg"
              required
            />
          </div>

          {/* Materias */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <Layers className="h-3.5 w-3.5 text-gray-400" />
              Materia
            </label>

            <select
              name="materia_id"
              value={formData.materia_id}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
    focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none 
    transition-all text-gray-900 placeholder:text-gray-400"
              required
            >
              <option value="">Selecciona una materia</option>

              {materias.map((m) => (
                <option key={m.id_materia} value={m.id_materia}>
                  {m.nombre_materia}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg 
              hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r 
              from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all 
              shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed 
              disabled:shadow-none"
            >
              {loading ? "Guardando..." : "Crear"}
            </button>
          </div>
        </form>

        {showUpload && (
          <UploadFileModal
            onClose={() => setShowUpload(false)}
            onUpload={(res) => {
              console.log("Archivo subido:", res);
              // Actualizar estado o mostrar toast
            }}
          />
        )}
      </div>
    </div>
  );
}
