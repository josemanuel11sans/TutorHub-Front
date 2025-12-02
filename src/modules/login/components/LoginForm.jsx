"use client"

import { useState } from "react"
import { usePasswordRecovery } from "../hooks/usePasswordRecovery"

export const LoginForm = ({ onSubmit, loading, error }) => {
  const [form, setForm] = useState({ email: "", password: "" })
  const [recoveryForm, setRecoveryForm] = useState({ email: "", code: "", newPassword: "", confirmPassword: "" })
  const [isFlipped, setIsFlipped] = useState(false)
  const [recoveryStep, setRecoveryStep] = useState("email")

  const {
    sendCode,
    validateCode,
    changePassword,
    loading: recoveryLoading,
    error: recoveryError,
    success: recoverySuccess,
  } = usePasswordRecovery()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleRecoveryChange = (e) => setRecoveryForm({ ...recoveryForm, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  const handleRecoverySubmit = async (e) => {
    e.preventDefault()

    if (recoveryStep === "email") {
      console.log("[v0] Enviando código a:", recoveryForm.email)
      const success = await sendCode(recoveryForm.email)

      if (success) {
        setRecoveryStep("code")
      }
    } else if (recoveryStep === "code") {
      console.log("[v0] Verificando código:", recoveryForm.code)
      const success = await validateCode(recoveryForm.email, recoveryForm.code)

      if (success) {
        setRecoveryStep("password")
      }
    } else if (recoveryStep === "password") {
      if (recoveryForm.newPassword !== recoveryForm.confirmPassword) {
        alert("Las contraseñas no coinciden")
        return
      }

      console.log("[v0] Cambiando contraseña")
      const success = await changePassword(recoveryForm.email, recoveryForm.code, recoveryForm.newPassword)

      if (success) {
        setTimeout(() => {
          toggleForm()
        }, 2000)
      }
    }
  }

  const toggleForm = () => {
    setIsFlipped(!isFlipped)
    if (isFlipped) {
      setRecoveryForm({ email: "", code: "", newPassword: "", confirmPassword: "" })
      setRecoveryStep("email")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md relative">
        <div style={{ perspective: "1500px" }}>
          <div
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              minHeight: "520px",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* CARA DEL LOGIN */}
            <div
              className="absolute w-full h-full flex items-center justify-center"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 w-full max-w-md">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">Sistema de Gestión Educativa</h1>
                  <p className="text-xl font-semibold text-blue-600">TutorHub</p>
                  <p className="text-sm text-gray-500 mt-2">Ingresa tu correo institucional</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-gray-700 text-sm font-semibold mb-2 block">Correo electrónico</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="ejemplo@utez.edu.mx"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-700 text-sm font-semibold mb-2 block">Contraseña</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {error && <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? "Ingresando..." : "Iniciar sesión"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    ¿Olvidaste tu contraseña?
                    <svg
                      className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* CARA DE RECUPERACIÓN */}
            <div
              className="absolute w-full h-full flex items-center justify-center"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 w-full max-w-md">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">Recuperar Contraseña</h1>
                  <p className="text-sm text-gray-500 mt-2">
                    {recoveryStep === "email"
                      ? "Ingresa tu correo para recibir el código de recuperación"
                      : recoveryStep === "code"
                        ? "Verifica el código enviado a tu correo"
                        : "Ingresa tu nueva contraseña"}
                  </p>
                </div>

                <form onSubmit={handleRecoverySubmit} className="space-y-5">
                  {recoveryStep === "email" && (
                    <div>
                      <label className="text-gray-700 text-sm font-semibold mb-2 block">Correo electrónico</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                          </svg>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={recoveryForm.email}
                          onChange={handleRecoveryChange}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="ejemplo@utez.edu.mx"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {recoveryStep === "code" && (
                    <>
                      <div>
                        <label className="text-gray-700 text-sm font-semibold mb-2 block">Correo electrónico</label>
                        <input
                          type="email"
                          value={recoveryForm.email}
                          disabled
                          className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-gray-700 text-sm font-semibold mb-2 block">Código de verificación</label>
                        <input
                          type="text"
                          name="code"
                          value={recoveryForm.code}
                          onChange={handleRecoveryChange}
                          maxLength={6}
                          className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-widest text-center text-lg font-semibold"
                          placeholder="000000"
                          required
                        />
                      </div>
                    </>
                  )}

                  {recoveryStep === "password" && (
                    <>
                      <div>
                        <label className="text-gray-700 text-sm font-semibold mb-2 block">Correo electrónico</label>
                        <input
                          type="email"
                          value={recoveryForm.email}
                          disabled
                          className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-gray-700 text-sm font-semibold mb-2 block">Nueva contraseña</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={recoveryForm.newPassword}
                          onChange={handleRecoveryChange}
                          className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-gray-700 text-sm font-semibold mb-2 block">Confirmar contraseña</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={recoveryForm.confirmPassword}
                          onChange={handleRecoveryChange}
                          className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </>
                  )}

                  {recoveryError && (
                    <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{recoveryError}</div>
                  )}

                  {recoverySuccess && (
                    <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">
                      {recoverySuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {recoveryLoading
                      ? "Procesando..."
                      : recoveryStep === "email"
                        ? "Enviar código"
                        : recoveryStep === "code"
                          ? "Verificar código"
                          : "Cambiar contraseña"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    <svg
                      className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver al inicio de sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
