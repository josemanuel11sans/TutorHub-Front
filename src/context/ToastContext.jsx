import { createContext, useContext, useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────── */
/*                 COMPONENTE TOAST                */
/* ─────────────────────────────────────────────── */

const Toast = ({ message, type, onClose, visible }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  const icon = getIcon();

  return (
    <div
      style={{
        background: "#155bf9",
        color: "white",
        padding: "10px 14px",
        borderRadius: "10px",
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        fontSize: "14px",
        fontWeight: "600",
        minHeight: "40px",
        position: "relative",
        maxWidth: "380px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      {/* Icono */}
      <span
        style={{
          fontSize: "18px",
          color: type === "success" ? "#00ff7f" : "white",
          fontWeight: "bold",
        }}
      >
        {icon}
      </span>

      {/* Mensaje - TEXTO MÁS A LA IZQUIERDA */}
      <span
        style={{
          lineHeight: "17px",
          flex: 1,
          marginLeft: "4px", // 👈👈 TEXTITO MÁS A LA IZQUIERDA
        }}
      >
        {message}
      </span>

    </div>
  );
};

/* ─────────────────────────────────────────────── */
/*                CONTEXT / PROVIDER               */
/* ─────────────────────────────────────────────── */

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toastData, setToastData] = useState({
    message: "",
    type: "",
    visible: false,
    fading: false,
  });

  const timeoutRef = useRef(null);

  const showToast = (message, type = "info") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setToastData({
      message,
      type,
      visible: true,
      fading: false,
    });

    timeoutRef.current = setTimeout(() => {
      setToastData((prev) => ({ ...prev, fading: true }));
    }, 3000);

    timeoutRef.current = setTimeout(() => {
      setToastData((prev) => ({ ...prev, visible: false }));
    }, 3400);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toastData.visible && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9999,
          }}
        >
          <Toast
            message={toastData.message}
            type={toastData.type}
            visible={!toastData.fading}
            onClose={() =>
              setToastData((prev) => ({ ...prev, visible: false }))
            }
          />
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
