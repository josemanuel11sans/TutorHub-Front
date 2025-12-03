"use client"

import { useContext } from "react"
import { AuthContext } from "../../../context/AuthContext"

export const useLogin = () => {
  const { handleLogin, loading, error } = useContext(AuthContext);

  const login = async ({ email, password }) => {
    // handleLogin ya retorna el objeto usuario procesado
    const usuario = await handleLogin(email, password);
    return usuario;
  };

  return { login, loading, error };
};