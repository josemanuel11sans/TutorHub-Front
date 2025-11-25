import React from "react";
import NotFoundIllustration from "./components/NotFoundIllustration";
import useRedirectHome from "./hooks/useRedirectHome";

const NotFoundPage = () => {
  const redirect = useRedirectHome();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-[#f5f9ff] text-center">
      <NotFoundIllustration />

      <h1 className="text-3xl font-semibold mt-6 text-gray-800">
        Página no encontrada
      </h1>

      <p className="text-gray-500 mt-2 mb-8 max-w-md">
        Creo que tomaste un caminito raro, amigo. Vamos de vuelta a un lugar seguro.
      </p>

      <button
        onClick={redirect}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all"
      >
        Regresar al inicio
      </button>
    </div>
  );
};

export default NotFoundPage;
