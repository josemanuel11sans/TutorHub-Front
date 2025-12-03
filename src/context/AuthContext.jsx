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
      localStorage.removeItem("user");
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para normalizar roles
  const normalizeRole = (role) => {
    const roleMap = {
      'alumno': 'student',
      'estudiante': 'student',
      'student': 'student',
      'tutor': 'tutor',
      'profesor': 'tutor',
      'teacher': 'tutor',
      'coordinador': 'coordinator',
      'coordinator': 'coordinator',
      'administrador': 'admin',
      'admin': 'admin'
    };
    return roleMap[role?.toLowerCase()] || 'student';
  };

  const handleLogin = async (email, password) => {
    // Cuentas mock para desarrollo
    const mockAccounts = [
      {
        email: "alumno@utez.edu.mx",
        password: "alumno123",
        usuario: { 
          id: 1, 
          nombre: "Alumno", 
          apellido: "Demo", 
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
          apellido: "Demo", 
          email: "profe@utez.edu.mx", 
          rol: "tutor" 
        },
      },
    ];

    const match = mockAccounts.find((a) => a.email === email && a.password === password);
    if (match) {
      setUser(match.usuario);
      localStorage.setItem("user", JSON.stringify(match.usuario));
      return match.usuario;
    }

    // Login con backend real
    try {
      setLoading(true);
      setError(null);
      
      const response = await loginRequest({ email, password });
      
      console.log("📦 Respuesta del backend:", response);
      
      // Extraer token y datos del usuario
      const { token, usuario: usuarioData } = response;
      
      if (!usuarioData) {
        throw new Error("No se recibieron datos del usuario");
      }

      // Crear objeto usuario limpio con solo los datos necesarios
      const usuario = {
        id: usuarioData.id_usuario,
        nombre: usuarioData.nombre,
        apellido: usuarioData.apellido,
        email: usuarioData.email,
        telefono: usuarioData.telefono,
        // El rol viene en el campo "role" del backend
        rol: normalizeRole(usuarioData.role),
        estado: usuarioData.estado,
        carrera_id: usuarioData.carrera_id
      };
      
      console.log("✅ Usuario procesado:", usuario);
      console.log("✅ Rol normalizado:", usuario.rol);
      
      // Guardar usuario y token
      setUser(usuario);
      localStorage.setItem("user", JSON.stringify(usuario));
      
      if (token) {
        localStorage.setItem("jwt", token);
        console.log("🔑 Token guardado");
      }
      
      return usuario;
      
    } catch (err) {
      console.error("❌ Error en login:", err);
      const errorMessage = err.response?.data?.message || "Credenciales incorrectas";
      setError(errorMessage);
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("jwt");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (token) {
        await logoutRequest();
      }
    } catch (e) {
      console.error("Error en logout:", e);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("jwt");
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        handleLogin, 
        handleLogout, 
        logout: handleLogout, 
        loading, 
        error 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};