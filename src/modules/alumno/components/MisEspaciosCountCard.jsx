import { useState, useEffect } from "react";
import { DoorOpen } from "lucide-react";
import api from "../../../api/base.api";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

export default function MisEspaciosCountCard({ userId }) {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchCount = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ajusta la ruta a tu backend real
        const res = await api.get(`/espacios/mis-espacios/count/${userId}`);

        setCount(res.data.count ?? 0);
      } catch (err) {
        console.error("Error al cargar mis espacios:", err);
        setError(err.response?.data?.message || "No se pudo obtener la información.");
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [userId]);

  // =======================
  // SHIMMER LOADING
  // =======================
  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  // =======================
  // ERROR UI
  // =======================
  if (error) {
    return (
      <Card className="border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-600">Error</p>
            <p className="text-sm text-red-500 mt-2">{error}</p>
          </div>
          <DoorOpen className="h-8 w-8 text-red-400" />
        </div>
      </Card>
    );
  }

  // Si count no existe
  if (count === null) return null;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Mis Espacios</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{count}</p>
          <p className="text-xs text-gray-500 mt-1">Espacios con acceso</p>
        </div>
        <DoorOpen className="h-8 w-8 text-gray-400" />
      </div>
    </Card>
  );
}
