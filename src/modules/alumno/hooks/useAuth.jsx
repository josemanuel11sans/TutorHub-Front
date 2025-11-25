"use client"

import { createContext, useContext, useState } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 1,
    nombre: "Juan",
    apellido_paterno: "Pérez",
    email: "alumno@example.com",
    rol: "alumno",
  })

  const logout = () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
