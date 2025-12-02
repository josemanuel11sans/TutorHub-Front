"use client"

import { useState } from "react"
import { requestPasswordReset, verifyResetCode, resetPassword } from "../../../api/auth.api"

export const usePasswordRecovery = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const sendCode = async (email) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const response = await requestPasswordReset(email)
      console.log("[v0] Código enviado exitosamente:", response)
      setSuccess(response.message || "Correo enviado. Revisa tu bandeja.")
      return true
    } catch (e) {
      const errorMsg = e.response?.data?.message || "Error al enviar el código."
      console.error("[v0] Error en sendCode:", errorMsg)
      setError(errorMsg)
      return false
    } finally {
      setLoading(false)
    }
  }

  const validateCode = async (email, code,newPassword ) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      await verifyResetCode(email, code, newPassword)
      setSuccess("Código verificado correctamente")
      return true
    } catch (e) {
      const errorMsg = e.response?.data?.message || "Código inválido."
      console.error("[v0] Error en validateCode:", errorMsg)
      setError(errorMsg)
      return false
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (email, code, newPassword) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
        console.log(email + " " + code + " " + newPassword )
      await resetPassword(email, code, newPassword)
      setSuccess("Contraseña actualizada correctamente")
      return true
    } catch (e) {
      const errorMsg = e.response?.data?.message || "No se pudo cambiar la contraseña."
      console.error("[v0] Error en changePassword:", errorMsg)
      setError(errorMsg)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, success, sendCode, validateCode,changePassword }
}
