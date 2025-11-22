// import { createContext, useState, useMemo, useEffect, useContext } from 'react';
// // 1. Asumo que tu archivo de API exporta la instancia de axios
// //    (Si no lo hace, deberías crear un archivo api/axios.js que la exporte)
// import { api, login as api_login, register as api_register } from '../api/auth.api';
// import { useNavigate } from 'react-router-dom';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   // Opcional, pero recomendado:
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // 2. Revisar *ambas* cosas en localStorage
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     const storedToken = localStorage.getItem("token");

//     if (storedUser && storedToken) {
//       setUser(storedUser);
//       // 3. ¡Lo más importante! Sincronizar el token con axios
//       api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
//     }
//     setLoading(false); // <--- Dejar de cargar
//   }, []);

//   const login = async (credentials) => {
//   try {
//       const response = await api_login(credentials);
//       console.log("Login response:", response);

//       // 4. Configurar el token en axios
//       api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
//       setUser(response.data.user);
//       localStorage.setItem("user", JSON.stringify(response.data.user));
//       localStorage.setItem("token", response.data.token);
      
//       if (response.data.user.userType === "enterprise" || response.data.user.role === "enterprise") {
//         navigate("/home/enterprise");
//         return;
//       }

//       navigate("/user/home");
//     } catch (error) {
//       console.error("Error en login:", error.response?.data?.message || error.message);
//       throw error;
//     }
//   };

//   const logout = () => {
//     try {
//       // 5. Eliminar el token de axios
//       delete api.defaults.headers.common['Authorization'];

//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       setUser(null);
//     } catch (error) {
//       console.error("Error en logout:", error);
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await api_register(userData);
//       console.log("Register response:", response);

//       // 6. Configurar el token en axios
//       api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
//       setUser(response.data.user);
//       localStorage.setItem("user", JSON.stringify(response.data.user));
//       localStorage.setItem("token", response.data.token);
//     } catch (error) {
//       console.error("Error en registro:", error.response?.data?.message || error.message);
//       throw error;
//     }
//   };

//   const value = useMemo(
//     () => ({
//       user,
//       loading, // <--- Exportar 'loading'
//       login,
//       logout,
//       register
//     }),
//     [user, loading] // <--- Añadir 'loading'
//   );

//   return (
//     <AuthContext.Provider value={value}>
//       {/* Si 'loading' es true, no renderizar los hijos (App)
//         previene un "parpadeo" donde se ve la app como "deslogueado"
//         por un instante antes de que el useEffect termine.
//       */}
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// // Tu hook 'useAuth' está perfecto, no necesita cambios
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };