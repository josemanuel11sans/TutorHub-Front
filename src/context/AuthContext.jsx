import React, { createContext, useState } from "react";
import { login as loginRequest, logout as logoutRequest } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    try {
      const parsed = JSON.parse(storedUser);
      // Asegurar que exista la propiedad `rol` usada por la UI
      if (parsed && !parsed.rol) {
        return { ...parsed, rol: mapRole(parsed.role) || mapRole(parsed.rol) };
      }
      return parsed;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (email, password) => {
    // Cuentas de prueba locales (para desarrollo sin backend)
    const mockAccounts = [
      {
        email: "alumno@utez.edu.mx",
        password: "alumno123",
        usuario: { id: 1, nombre: "Alumno", apellido_paterno: "Demo", email: "alumno@utez.edu.mx", rol: "alumno" },
      },
      {
        email: "profe@utez.edu.mx",
        password: "profe123",
        usuario: { id: 2, nombre: "Tutor", apellido_paterno: "Demo", email: "profe@utez.edu.mx", rol: "tutor" },
      },
    ];

    // Primero intentar login local con cuentas mock
    const match = mockAccounts.find((a) => a.email === email && a.password === password);
    if (match) {
      setLoading(true);
      setError(null);
      const raw = match.usuario;
      // Normalizar la propiedad de rol a `rol` (valores en español usados por la UI)
      const usuario = {
        ...raw,
        rol: raw.rol || mapRole(raw.role) || "alumno",
      };
      setUser(usuario);
      localStorage.setItem("user", JSON.stringify(usuario));
      setLoading(false);
      return usuario;
    }

    // Si no coincide con cuentas de prueba, intentar con el backend
    try {
      setLoading(true);
      setError(null);
      const response = await loginRequest({ email, password });
      // loginRequest devuelve response (según api), intentamos obtener usuario
      const raw = response?.data?.usuario || response?.data || response;
      const usuario = {
        ...raw,
        // Normalizar roles del backend (ej. 'student','coordinator') a valores que usa la UI ('alumno','coordinador',...)
        rol: raw?.rol || mapRole(raw?.role) || mapRole(raw?.rol) || "alumno",
      };
      setUser(usuario);
      try { localStorage.setItem("user", JSON.stringify(usuario)); } catch (e) {}
      return usuario;
    } catch (err) {
      setError("Credenciales incorrectas");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper para mapear roles del backend (en inglés) a los roles que usa la UI (en español)
  function mapRole(r) {
    if (!r) return undefined;
    const rLower = String(r).toLowerCase();
    switch (rLower) {
      case "student":
      case "alumno":
        return "alumno";
      case "tutor":
        return "tutor";
      case "profesor":
        return "tutor";
      case "coordinator":
      case "coordinador":
        return "coordinador";
      case "admin":
      case "administrador":
        return "admin";
      default:
        return rLower;
    }
  }

  const handleLogout = async () => {
    await logoutRequest();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
