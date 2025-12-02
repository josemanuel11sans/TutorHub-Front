"use client";

import { useState } from "react";
import { Navbar } from "./components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/Card";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { Badge } from "./components/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/Tabs";
import { useAuth } from "./hooks/useAuth";
import { useToast, ToastContainer } from "./hooks/useToast";
import {
  mockMateriales,
  mockEspacios,
  mockAccesosEspacios,
  mockDescargas,
  mockUsuarios,
} from "./hooks/mock-data";
import {
  Download,
  FileText,
  Search,
  DoorOpen,
  BookOpen,
  Clock,
} from "./components/Icons";

export default function AlumnoPage() {
  const { user } = useAuth();
  const { toast, toasts } = useToast();
  const [descargas, setDescargas] = useState(mockDescargas);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal

  const misAccesos = mockAccesosEspacios.filter(
    (a) => a.alumno_id === user?.id && a.activo
  );
  const misEspaciosIds = misAccesos.map((a) => a.espacio_id);
  const misEspacios = mockEspacios.filter((e) => misEspaciosIds.includes(e.id));

  const materialesDisponibles = mockMateriales.filter(
    (m) => misEspaciosIds.includes(m.espacio_id) && m.activo
  );

  const misDescargasIds = descargas
    .filter((d) => d.alumno_id === user?.id)
    .map((d) => d.material_id);
  const materialesDescargados = mockMateriales.filter((m) =>
    misDescargasIds.includes(m.id)
  );

  // Estado para manejar el modal
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null); // Estado para el espacio seleccionado

  // Función para abrir el modal y mostrar los materiales de un espacio
  const openModal2 = (espacioId) => {
    const espacio = mockEspacios.find((e) => e.id === espacioId);
    setEspacioSeleccionado(espacio);
    setIsModalOpen2(true);
  };

  // Función para cerrar el modal
  const closeModal2 = () => {
    setIsModalOpen2(false);
    setEspacioSeleccionado(null);
  };

  // Para el apartado de asesorías
  const [materia, setMateria] = useState("");
  const [motivo, setMotivo] = useState("");
  const [fecha, setFecha] = useState("");
  const [tutor, setTutor] = useState("");
  const [misAsesorias, setMisAsesorias] = useState([]); // Guardar las asesorías registradas

  const filteredMateriales = materialesDisponibles.filter(
    (material) =>
      material.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (material) => {
    const yaDescargado = descargas.some(
      (d) => d.material_id === material.id && d.alumno_id === user?.id
    );

    if (!yaDescargado) {
      const nuevaDescarga = {
        id: descargas.length + 1,
        material_id: material.id,
        alumno_id: user.id,
        fecha_descarga: new Date().toISOString(),
      };
      setDescargas([...descargas, nuevaDescarga]);
    }

    toast({
      title: "Descarga iniciada",
      description: `Descargando ${material.archivo_nombre}`,
    });
  };

  const getEspacioName = (espacioId) => {
    return mockEspacios.find((e) => e.id === espacioId)?.nombre || "N/A";
  };

  const getTutorName = (tutorId) => {
    const tutor = mockUsuarios.find((u) => u.id === tutorId);
    return tutor ? `${tutor.nombre} ${tutor.apellido_paterno}` : "N/A";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const yaDescargado = (materialId) => {
    return descargas.some(
      (d) => d.material_id === materialId && d.alumno_id === user?.id
    );
  };

  // Para asesorias
  const handleRegistrarAsesoria = (e) => {
    e.preventDefault();

    const nuevaAsesoria = {
      id: misAsesorias.length + 1,
      materia,
      motivo,
      fecha,
      tutorId: Number(tutor),
    };

    setMisAsesorias([...misAsesorias, nuevaAsesoria]);

    toast({
      title: "Asesoría registrada",
      description: `Has registrado una nueva asesoría en ${materia}.`,
    });

    // Limpiar los campos del formulario
    setMateria("");
    setMotivo("");
    setFecha("");
    setTutor("");

    // Cerrar el modal después de registrar la asesoría
    setIsModalOpen(false);
  };

  // Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Panel de Alumno
              </h1>
              <p className="text-gray-600">
                Accede a los materiales de tus espacios
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Mis Espacios
                </CardTitle>
                <DoorOpen className="h-4 w-4 text-black-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{misEspacios.length}</div>
                <p className="text-xs text-neutral-400 font-semibold">
                  Espacios con acceso
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Materiales Disponibles
                </CardTitle>
                <BookOpen className="h-4 w-4 text-black-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {materialesDisponibles.length}
                </div>
                <p className="text-xs text-neutral-400 font-semibold">
                  Para descargar
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Descargas Realizadas
                </CardTitle>
                <Download className="h-4 w-4 text-black-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {materialesDescargados.length}
                </div>
                <p className="text-xs text-neutral-400 font-semibold">
                  Materiales descargados
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="disponibles" className="space-y-4">
            <TabsList>
              <TabsTrigger value="disponibles">
                Materiales Disponibles
              </TabsTrigger>
              <TabsTrigger value="espacios">Mis Espacios</TabsTrigger>
              <TabsTrigger value="historial">
                Historial de Descargas
              </TabsTrigger>
              <TabsTrigger value="asesorias">Asesorias</TabsTrigger>
            </TabsList>

            <TabsContent value="disponibles" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Materiales Disponibles</CardTitle>
                  <CardDescription>
                    Materiales publicados en tus espacios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                    <Input
                      placeholder="Buscar materiales..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {filteredMateriales.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No hay materiales disponibles
                      </h3>
                      <p className="text-gray-600">
                        Los tutores aún no han publicado materiales en tus
                        espacios
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredMateriales.map((material) => (
                        <Card
                          key={material.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <FileText className="h-8 w-8 text-blue-600" />
                              {yaDescargado(material.id) && (
                                <Badge variant="secondary">Descargado</Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg">
                              {material.titulo}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {material.descripcion}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Espacio:</span>
                                <span className="font-medium">
                                  {getEspacioName(material.espacio_id)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Tutor:</span>
                                <span className="font-medium">
                                  {getTutorName(material.tutor_id)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Tamaño:</span>
                                <span className="font-medium">
                                  {formatFileSize(material.tamanio_bytes)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                  Publicado:
                                </span>
                                <span className="font-medium">
                                  {formatDate(material.fecha_publicacion)}
                                </span>
                              </div>
                            </div>
                            <Button
                              className="w-full"
                              onClick={() => handleDownload(material)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Descargar
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="espacios" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Espacios</CardTitle>
                  <CardDescription>
                    Espacios a los que tienes acceso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {misEspacios.map((espacio) => {
                      const materialesEnEspacio = materialesDisponibles.filter(
                        (m) => m.espacio_id === espacio.id
                      ).length;
                      return (
                        <Card
                          key={espacio.id}
                          onClick={() => openModal2(espacio.id)}
                          className="hover:cursor-pointer"
                        >
                          <CardHeader>
                            <DoorOpen className="h-8 w-8 text-blue-600 mb-2" />
                            <CardTitle className="text-lg">
                              {espacio.nombre}
                            </CardTitle>
                            <CardDescription>
                              {espacio.descripcion}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                  Capacidad:
                                </span>
                                <span className="font-medium">
                                  {espacio.capacidad} personas
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                  Materiales:
                                </span>
                                <Badge>{materialesEnEspacio}</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historial" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Descargas</CardTitle>
                  <CardDescription>
                    Materiales que has descargado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {materialesDescargados.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Clock className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Sin descargas
                      </h3>
                      <p className="text-gray-600">
                        Aún no has descargado ningún material
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {materialesDescargados.map((material) => {
                        const descarga = descargas.find(
                          (d) =>
                            d.material_id === material.id &&
                            d.alumno_id === user?.id
                        );
                        return (
                          <Card key={material.id}>
                            <CardContent className="flex items-center justify-between p-4">
                              <div className="flex items-center gap-4">
                                <FileText className="h-8 w-8 text-blue-600" />
                                <div>
                                  <p className="font-medium">
                                    {material.titulo}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {getEspacioName(material.espacio_id)} •{" "}
                                    {material.archivo_nombre}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {descarga &&
                                    formatDate(descarga.fecha_descarga)}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownload(material)}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Descargar de nuevo
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="asesorias" className="space-y-4">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>Asesorías</CardTitle>
                  <Button onClick={openModal}>+ Nueva Asesoría</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Mostrar Asesorías Registradas */}
                    {misAsesorias.length === 0 ? (
                      <p className="text-gray-600">
                        No tienes asesorías programadas.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {misAsesorias.map((asesoria) => (
                          <Card key={asesoria.id}>
                            <CardHeader>
                              <CardTitle>{asesoria.materia}</CardTitle>
                              <CardDescription>
                                {asesoria.motivo}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Fecha:</span>
                                <span className="font-medium">
                                  {formatDate(asesoria.fecha)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Tutor:</span>
                                <span className="font-medium">
                                  {getTutorName(asesoria.tutorId)}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Modal */}
          {isModalOpen && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-opacity-60 p-4 backdrop-blur-sm"
              style={{ zIndex: 9999 }}
              onClick={closeModal}
            >
              <div
                className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">
                      Nueva Asesoría
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">
                    Registra tu solicitud de asesoría académica
                  </p>
                </div>

                {/* Body */}
                <form
                  onSubmit={handleRegistrarAsesoria}
                  className="p-6 space-y-5"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Materia <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={materia}
                      onChange={(e) => setMateria(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    >
                      <option value="">Selecciona una materia</option>
                      <option value="Matemáticas">Matemáticas</option>
                      <option value="Física">Física</option>
                      <option value="Química">Química</option>
                      <option value="Programación">Programación</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Motivo <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      placeholder="Describe brevemente el tema que necesitas revisar..."
                      required
                      rows={3}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tutor <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={tutor}
                      onChange={(e) => setTutor(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    >
                      <option value="">Selecciona un tutor</option>
                      <option value="tutor1">Juan Pérez</option>
                      <option value="tutor2">Ana Gómez</option>
                      <option value="tutor3">Carlos Rodríguez</option>
                    </select>
                  </div>

                  {/* Footer */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={closeModal}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Registrar Asesoría
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal para mostrar los materiales de un espacio */}
          {isModalOpen2 && espacioSeleccionado && (
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-60 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">
                      {espacioSeleccionado.nombre}
                    </h2>
                    <button
                      onClick={closeModal2}
                      className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Cuerpo del Modal */}
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Materiales Publicados
                  </h3>
                  <div>
                    {materialesDisponibles
                      .filter(
                        (material) =>
                          material.espacio_id === espacioSeleccionado.id
                      )
                      .map((material) => (
                        <div
                          key={material.id}
                          className="flex items-center justify-between p-2 border-b"
                        >
                          <div className="flex items-center">
                            <FileText className="h-6 w-6 text-blue-600 mr-2" />
                            <span className="text-sm font-medium">
                              {material.titulo}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleDownload(material)}
                          >
                            Descargar
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        <ToastContainer toasts={toasts} />
      </div>
  );
}
