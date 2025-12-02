"use client";

import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  /*if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">Por favor inicia sesión</p>
        </div>
      </div>
    )
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin Permisos</h2>
          <p className="text-gray-600">No tienes acceso a esta sección</p>
        </div>
      </div>
    )
  }*/

  return children;
}
