import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import api from '../../../api/base.api';

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

export default function UsersCountCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/usuarios/count-by-role');
        setData(response.data);
      } catch (err) {
        console.error("Error al obtener conteo de usuarios:", err);
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
            <div className="h-3 bg-gray-200 rounded w-48"></div>
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
          <Users className="h-8 w-8 text-red-400" />
        </div>
      </Card>
    );
  }

  if (!data) return null;

  const total = (data.student || 0) + (data.tutor || 0) + (data.coordinator || 0);
  
  const roleLabels = {
    student: 'alumno',
    tutor: 'tutor',
    coordinator: 'coordinador'
  };

  const roleLabelPlural = {
    student: 'alumnos',
    tutor: 'tutores',
    coordinator: 'coordinadores'
  };

  const roleCounts = Object.entries(data)
    .filter(([role, count]) => role !== 'admin' && count > 0)
    .map(([role, count]) => {
      const label = count === 1 ? roleLabels[role] : roleLabelPlural[role];
      return `${count} ${label}`;
    });

  const detailText = roleCounts.join(', ');

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{total}</p>
          <p className="text-xs text-gray-500 mt-1">{detailText}</p>
        </div>
        <Users className="h-8 w-8 text-gray-400" />
      </div>
    </Card>
  );
}