import React, { createContext, useState } from "react";
import { login as loginRequest, logout as logoutRequest } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (email, password) => {
    const mockAccounts = [
      {
        email: "alumno@utez.edu.mx",
        password: "alumno123",
        usuario: { 
          id: 1, 
          nombre: "Alumno", 
          apellido_paterno: "Demo", 
          email: "alumno@utez.edu.mx", 
          rol: "student"
        },
      },
      {
        email: "profe@utez.edu.mx",
        password: "profe123",
        usuario: { 
          id: 2, 
          nombre: "Tutor", 
          apellido_paterno: "Demo", 
          email: "profe@utez.edu.mx", 
          rol: "tutor" 
        },
      },
    ];

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

    // Login con backend
    try {
      setLoading(true);
      setError(null);
      const response = await loginRequest({ email, password });
      
      console.log("📦 Respuesta completa del backend:", response);
      
      // El backend devuelve { token, usuario }
      // Y dentro de usuario está el campo 'role'
      const { token, usuario: usuarioData } = response;
      
      console.log("🔍 Token:", token);
      console.log("🔍 Datos del usuario:", usuarioData);
      console.log("🔍 Role del usuario:", usuarioData?.role);
      
      // Crear el objeto usuario con el rol normalizado
      const usuario = {
        ...usuarioData,
        rol: usuarioData?.role || usuarioData?.rol // Usar 'role' del backend
      };
      
      console.log("✅ Usuario final procesado:", usuario);
      console.log("✅ Rol final:", usuario.rol);
      
      setUser(usuario);
      localStorage.setItem("user", JSON.stringify(usuario));
      
      // Opcional: guardar el token por separado si lo necesitas
      if (token) {
        localStorage.setItem("jwt", token);
      }
      
      return usuario;
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError("Credenciales incorrectas");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (e) {
      // Ignorar errores
    }
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout, logout: handleLogout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};