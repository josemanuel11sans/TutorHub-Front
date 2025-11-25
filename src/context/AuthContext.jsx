import React, { createContext, useState } from "react";
import { login as loginRequest, logout as logoutRequest } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
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
        usuario: { id: 2, nombre: "Profesor", apellido_paterno: "Demo", email: "profe@utez.edu.mx", rol: "profesor" },
      },
    ];

    // Primero intentar login local con cuentas mock
    const match = mockAccounts.find((a) => a.email === email && a.password === password);
    if (match) {
      setLoading(true);
      setError(null);
      const usuario = match.usuario;
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
      const usuario = response?.data?.usuario || response?.data || response;
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
