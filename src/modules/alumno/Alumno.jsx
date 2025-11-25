"use client"

import { useState } from "react"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Navbar } from "./components/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/Card"
import { Button } from "./components/Button"
import { Input } from "./components/Input"
import { Badge } from "./components/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/Tabs"
import { useAuth } from "./hooks/useAuth"
import { useToast, ToastContainer } from "./hooks/useToast"
import { mockMateriales, mockEspacios, mockAccesosEspacios, mockDescargas, mockUsuarios } from "./hooks/mock-data"
import { Download, FileText, Search, DoorOpen, BookOpen, Clock } from "./components/Icons"

export default function AlumnoPage() {
  const { user } = useAuth()
  const { toast, toasts } = useToast()
  const [descargas, setDescargas] = useState(mockDescargas)
  const [searchTerm, setSearchTerm] = useState("")

  const misAccesos = mockAccesosEspacios.filter((a) => a.alumno_id === user?.id && a.activo)
  const misEspaciosIds = misAccesos.map((a) => a.espacio_id)
  const misEspacios = mockEspacios.filter((e) => misEspaciosIds.includes(e.id))

  const materialesDisponibles = mockMateriales.filter((m) => misEspaciosIds.includes(m.espacio_id) && m.activo)

  const misDescargasIds = descargas.filter((d) => d.alumno_id === user?.id).map((d) => d.material_id)
  const materialesDescargados = mockMateriales.filter((m) => misDescargasIds.includes(m.id))

  const filteredMateriales = materialesDisponibles.filter(
    (material) =>
      material.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDownload = (material) => {
    const yaDescargado = descargas.some((d) => d.material_id === material.id && d.alumno_id === user?.id)

    if (!yaDescargado) {
      const nuevaDescarga = {
        id: descargas.length + 1,
        material_id: material.id,
        alumno_id: user.id,
        fecha_descarga: new Date().toISOString(),
      }
      setDescargas([...descargas, nuevaDescarga])
    }

    toast({
      title: "Descarga iniciada",
      description: `Descargando ${material.archivo_nombre}`,
    })
  }

  const getEspacioName = (espacioId) => {
    return mockEspacios.find((e) => e.id === espacioId)?.nombre || "N/A"
  }

  const getTutorName = (tutorId) => {
    const tutor = mockUsuarios.find((u) => u.id === tutorId)
    return tutor ? `${tutor.nombre} ${tutor.apellido_paterno}` : "N/A"
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A"
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const yaDescargado = (materialId) => {
    return descargas.some((d) => d.material_id === materialId && d.alumno_id === user?.id)
  }

  return (
    <ProtectedRoute allowedRoles={["alumno"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Panel de Alumno</h1>
              <p className="text-gray-600">Accede a los materiales de tus espacios</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mis Espacios</CardTitle>
                <DoorOpen className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{misEspacios.length}</div>
                <p className="text-xs text-gray-600">Espacios con acceso</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Materiales Disponibles</CardTitle>
                <BookOpen className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{materialesDisponibles.length}</div>
                <p className="text-xs text-gray-600">Para descargar</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Descargas Realizadas</CardTitle>
                <Download className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{materialesDescargados.length}</div>
                <p className="text-xs text-gray-600">Materiales descargados</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="disponibles" className="space-y-4">
            <TabsList>
              <TabsTrigger value="disponibles">Materiales Disponibles</TabsTrigger>
              <TabsTrigger value="espacios">Mis Espacios</TabsTrigger>
              <TabsTrigger value="historial">Historial de Descargas</TabsTrigger>
            </TabsList>

            <TabsContent value="disponibles" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Materiales Disponibles</CardTitle>
                  <CardDescription>Materiales publicados en tus espacios</CardDescription>
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
                      <h3 className="text-lg font-semibold mb-2">No hay materiales disponibles</h3>
                      <p className="text-gray-600">Los tutores aún no han publicado materiales en tus espacios</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredMateriales.map((material) => (
                        <Card key={material.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <FileText className="h-8 w-8 text-blue-600" />
                              {yaDescargado(material.id) && <Badge variant="secondary">Descargado</Badge>}
                            </div>
                            <CardTitle className="text-lg">{material.titulo}</CardTitle>
                            <CardDescription className="line-clamp-2">{material.descripcion}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Espacio:</span>
                                <span className="font-medium">{getEspacioName(material.espacio_id)}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Tutor:</span>
                                <span className="font-medium">{getTutorName(material.tutor_id)}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Tamaño:</span>
                                <span className="font-medium">{formatFileSize(material.tamanio_bytes)}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Publicado:</span>
                                <span className="font-medium">{formatDate(material.fecha_publicacion)}</span>
                              </div>
                            </div>
                            <Button className="w-full" onClick={() => handleDownload(material)}>
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
                  <CardDescription>Espacios a los que tienes acceso</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {misEspacios.map((espacio) => {
                      const materialesEnEspacio = materialesDisponibles.filter(
                        (m) => m.espacio_id === espacio.id,
                      ).length
                      return (
                        <Card key={espacio.id}>
                          <CardHeader>
                            <DoorOpen className="h-8 w-8 text-blue-600 mb-2" />
                            <CardTitle className="text-lg">{espacio.nombre}</CardTitle>
                            <CardDescription>{espacio.descripcion}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Capacidad:</span>
                                <span className="font-medium">{espacio.capacidad} personas</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Materiales:</span>
                                <Badge>{materialesEnEspacio}</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historial" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Descargas</CardTitle>
                  <CardDescription>Materiales que has descargado</CardDescription>
                </CardHeader>
                <CardContent>
                  {materialesDescargados.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Clock className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Sin descargas</h3>
                      <p className="text-gray-600">Aún no has descargado ningún material</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {materialesDescargados.map((material) => {
                        const descarga = descargas.find(
                          (d) => d.material_id === material.id && d.alumno_id === user?.id,
                        )
                        return (
                          <Card key={material.id}>
                            <CardContent className="flex items-center justify-between p-4">
                              <div className="flex items-center gap-4">
                                <FileText className="h-8 w-8 text-blue-600" />
                                <div>
                                  <p className="font-medium">{material.titulo}</p>
                                  <p className="text-sm text-gray-600">
                                    {getEspacioName(material.espacio_id)} • {material.archivo_nombre}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{descarga && formatDate(descarga.fecha_descarga)}</p>
                                <Button variant="ghost" size="sm" onClick={() => handleDownload(material)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Descargar de nuevo
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <ToastContainer toasts={toasts} />
      </div>
    </ProtectedRoute>
  )
}
