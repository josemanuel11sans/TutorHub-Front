"use client"

import { useState, useCallback } from "react"

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ title, description }) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, title, description }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return { toast, toasts }
}

export function ToastContainer({ toasts }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[300px] animate-slide-in"
        >
          <h4 className="font-semibold text-gray-900">{toast.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{toast.description}</p>
        </div>
      ))}
    </div>
  )
}
