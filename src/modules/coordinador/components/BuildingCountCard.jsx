import { useState, useEffect } from 'react';
import { Building } from 'lucide-react';
import { getEdificios } from '../../../api/edificios.api';

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

export default function BuildingsCountCard() {
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEdificios();
        setEdificios(data);
      } catch (err) {
        console.error("Error al obtener edificios:", err);
        setError(err.message || "Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (error) {
    return (
      <Card className="border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-600">Error</p>
            <p className="text-sm text-red-500 mt-2">{error}</p>
          </div>
          <Building className="h-8 w-8 text-red-400" />
        </div>
      </Card>
    );
  }

  const totalEdificios = edificios.length;
  const edificiosActivos = edificios.filter(e => e.estado).length;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Edificios</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalEdificios}</p>
          <p className="text-xs text-gray-500 mt-1">
            {edificiosActivos === totalEdificios 
              ? `${totalEdificios === 1 ? 'Activo' : 'Todos activos'}`
              : `${edificiosActivos} ${edificiosActivos === 1 ? 'activo' : 'activos'}`
            }
          </p>
        </div>
        <Building className="h-8 w-8 text-gray-400" />
      </div>
    </Card>
  );
}