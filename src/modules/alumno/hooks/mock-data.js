export const mockUsuarios = [
  {
    id: 1,
    nombre: "Juan",
    apellido_paterno: "Pérez",
    apellido_materno: "García",
    email: "alumno@example.com",
    rol: "alumno",
  },
  {
    id: 2,
    nombre: "María",
    apellido_paterno: "López",
    apellido_materno: "Martínez",
    email: "tutor@example.com",
    rol: "tutor",
  },
]

export const mockEspacios = [
  {
    id: 1,
    nombre: "Matemáticas Avanzadas",
    descripcion: "Espacio para material de matemáticas nivel avanzado",
    capacidad: 30,
    activo: true,
  },
  {
    id: 2,
    nombre: "Programación Web",
    descripcion: "Materiales de desarrollo web y frameworks modernos",
    capacidad: 25,
    activo: true,
  },
  {
    id: 3,
    nombre: "Base de Datos",
    descripcion: "SQL, NoSQL y diseño de bases de datos",
    capacidad: 20,
    activo: true,
  },
]

export const mockAccesosEspacios = [
  {
    id: 1,
    espacio_id: 1,
    alumno_id: 1,
    activo: true,
    fecha_acceso: "2024-01-15T10:00:00",
  },
  {
    id: 2,
    espacio_id: 2,
    alumno_id: 1,
    activo: true,
    fecha_acceso: "2024-01-16T10:00:00",
  },
  {
    id: 3,
    espacio_id: 3,
    alumno_id: 1,
    activo: true,
    fecha_acceso: "2024-01-17T10:00:00",
  },
]

export const mockMateriales = [
  {
    id: 1,
    espacio_id: 1,
    tutor_id: 2,
    titulo: "Cálculo Diferencial - Unidad 1",
    descripcion: "Introducción al cálculo diferencial y límites",
    archivo_nombre: "calculo_unidad1.pdf",
    archivo_url: "/materiales/calculo_unidad1.pdf",
    tamanio_bytes: 2500000,
    fecha_publicacion: "2024-01-20T10:00:00",
    activo: true,
  },
  {
    id: 2,
    espacio_id: 1,
    tutor_id: 2,
    titulo: "Ejercicios de Derivadas",
    descripcion: "Problemas resueltos y propuestos de derivadas",
    archivo_nombre: "ejercicios_derivadas.pdf",
    archivo_url: "/materiales/ejercicios_derivadas.pdf",
    tamanio_bytes: 1800000,
    fecha_publicacion: "2024-01-22T10:00:00",
    activo: true,
  },
  {
    id: 3,
    espacio_id: 2,
    tutor_id: 2,
    titulo: "Introducción a React",
    descripcion: "Fundamentos de React y componentes",
    archivo_nombre: "react_intro.pdf",
    archivo_url: "/materiales/react_intro.pdf",
    tamanio_bytes: 3200000,
    fecha_publicacion: "2024-01-25T10:00:00",
    activo: true,
  },
  {
    id: 4,
    espacio_id: 2,
    tutor_id: 2,
    titulo: "JavaScript Moderno ES6+",
    descripcion: "Características modernas de JavaScript",
    archivo_nombre: "javascript_es6.pdf",
    archivo_url: "/materiales/javascript_es6.pdf",
    tamanio_bytes: 2900000,
    fecha_publicacion: "2024-01-28T10:00:00",
    activo: true,
  },
  {
    id: 5,
    espacio_id: 3,
    tutor_id: 2,
    titulo: "SQL Básico",
    descripcion: "Consultas SQL y diseño de tablas",
    archivo_nombre: "sql_basico.pdf",
    archivo_url: "/materiales/sql_basico.pdf",
    tamanio_bytes: 2100000,
    fecha_publicacion: "2024-02-01T10:00:00",
    activo: true,
  },
]

export const mockDescargas = [
  {
    id: 1,
    material_id: 1,
    alumno_id: 1,
    fecha_descarga: "2024-01-21T14:30:00",
  },
]
