import { useState } from "react";
import { login as loginRequest } from "../../../api/auth.api";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credenciales) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await loginRequest(credenciales);

      return data; // <- regresa el usuario/token
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
};
