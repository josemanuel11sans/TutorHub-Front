import React, { useContext} from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// aqui van todas las importaciones
import LoginPage from "../modules/login/LoginPage";
import NotFoundPage from "../modules/notFoundPage/NotFoundPage";



export const RoutesConfig = () => {
  const { user } = useContext(AuthContext);
  // console.log(user)
   return (
    <Routes>
      {user ? (
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/home" element={<Home />} />
          <Route path="/gestion-inventarios" element={<GestionInventarios />} />
          <Route path="/categorias-espacios" element={<CategoriasEspacios />} />
          <Route path="/categoria-recursos" element={<CategoriaRecursos />} />
          <Route path="/responsables" element={<Responsables />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/nuevas-cuentas" element={<NuevasCuentas />} />
          <Route path="/gestion-inventarios/espacios/:id" element={<Espacios/>}/>
          <Route path="/gestion-inventarios/espacios/:id/inventarios/:id" element={<Inventarios/>}/>
          <Route path="/gestion-inventarios/espacios/:id/inventarios/:id/recursos/:id" element={<Recursos/>}/> */}
        </Route>
      ) : (
        <>
          <Route path="/" element={<LoginPage/>} />
          {/* <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
          <Route path="/codigo-verificacion" element={<CodigoRecuperacion />} />
          <Route path="/cambio-contrasena" element={<CambioContrasena />} /> */}
        </>
      )}
      <Route path="*" element={<NotFoundPage/>} />
    </Routes>
  );
};