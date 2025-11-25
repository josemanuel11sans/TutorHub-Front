import React, { createContext, useState, useEffect } from "react";
// import React, {  useState, useEffect } from "react";
import { login } from "../api/auth.api";

 export const AuthContext = createContext();




export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(() => {
  const storedUser = localStorage.getItem("user");
  const storedJwt = localStorage.getItem("jwt");
  if (storedUser && storedJwt) {
    return JSON.parse(storedUser);
  }
  return null;
});
  const [error, setError] = useState(null);

  // Función para manejar el login
  const handleLogin = async (correo, password) => {
    try {
      const response = await login({ correo, password });
      if (response.status === 200) {
        // Guardar el JWT y el usuario en el localStorage
        const { jwt, username, expiration , role} = response.data;
        localStorage.setItem("jwt", jwt);
        localStorage.setItem("user", JSON.stringify({username}));
        localStorage.setItem("expiration", Date.now() + expiration); // Guardar el tiempo de expiración
        setUser({ username, role });
        setUser({username});
        setError(null);
      } 
    } catch (err) {
      console.error("Error en la conexión:", err);
      setError(true);
      setUser(null);
    }
  };


  // Función para manejar el logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    localStorage.removeItem("expiration");

  };

  // Comprobar si el token ha expirado al cargar la aplicación
  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedExpiration = localStorage.getItem("expiration");
      const currentTime = Date.now();
      if (storedExpiration && currentTime > storedExpiration) {
        handleLogout();
      }
    };
    checkTokenExpiration();
  }, []);
  return (
    <AuthContext.Provider value={{ user, handleLogout, handleLogin, error }}>
      {children}
    </AuthContext.Provider>
  );
};
