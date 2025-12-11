"use client";

import { useState, useRef, useEffect } from "react";
import { User, FileText, Lock, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ChangePasswordModal } from "./ChangePasswordModal";

export function UserMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const menuRef = useRef(null);
  const { logout } = useAuth();

  // Obtener la inicial del nombre
  const getInitial = () => {
    if (user?.nombre) {
      return user.nombre.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Cerrar el menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleDownloadManual = () => {
    // Aquí va la lógica para descargar el PDF
    const link = document.createElement("a");
    link.href = "/manuals/manual-usuario.pdf";
    link.download = "Manual_de_Usuario.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Avatar Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {getInitial()}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.nombre} {user?.apellido_paterno}
              </p>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleChangePassword}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>Cambiar Contraseña</span>
            </button>

            <div className="border-t border-gray-200 my-1"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal de Cambio de Contraseña */}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
}
