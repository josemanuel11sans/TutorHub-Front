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
    try {
      setLoading(true);
      setError(null);
      const usuario = await loginRequest({ email, password });
      setUser(usuario);
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
