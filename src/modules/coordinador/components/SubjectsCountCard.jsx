import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import api from '../../../api/base.api';

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

export default function SubjectsCountCard() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/materias');
        setMaterias(response.data);
      } catch (err) {
        console.error("Error al obtener materias:", err);
        setError(err.response?.data?.message || "Error al conectar con el servidor");
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
          <BookOpen className="h-8 w-8 text-red-400" />
        </div>
      </Card>
    );
  }

  const totalMaterias = materias.length;
  const materiasActivas = materias.filter(m => m.activo).length;
  
  // Contar carreras únicas
  const carrerasUnicas = new Set(materias.map(m => m.carrera_id)).size;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Materias</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalMaterias}</p>
          <p className="text-xs text-gray-500 mt-1">
            {carrerasUnicas > 0 
              ? `${carrerasUnicas} ${carrerasUnicas === 1 ? 'carrera' : 'carreras'}`
              : 'Sin carreras asignadas'
            }
          </p>
        </div>
        <BookOpen className="h-8 w-8 text-gray-400" />
      </div>
    </Card>
  );
}