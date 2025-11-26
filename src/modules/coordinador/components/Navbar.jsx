"use client"

import { useAuth } from "../hooks/useAuth"

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">Sistema de Materiales</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-600">Bienvenido, </span>
              <span className="font-semibold text-gray-900">
                {user?.nombre} {user?.apellido_paterno}
              </span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
