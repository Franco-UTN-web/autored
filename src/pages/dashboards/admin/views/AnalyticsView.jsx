import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsView() {
  const [metricas, setMetricas] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('https://backautored-production.up.railway.app/api/admin/metricas')
      .then(res => res.json())
      .then(data => {
        setMetricas(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error cargando métricas:", err);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <div className="p-10 text-center text-gray-500 font-medium">Generando reportes analíticos...</div>;
  }

  // Preparamos los datos exactos que necesita la gráfica de dona (Recharts)
  const datosDona = [
    { name: 'Aprobadas', value: metricas.tiendasAprobadas, color: '#16a34a' }, // Verde
    { name: 'Pendientes', value: metricas.tiendasPendientes, color: '#2563eb' }, // Azul
    { name: 'Suspendidas', value: metricas.tiendasSuspendidas, color: '#dc2626' } // Rojo
  ];

  // Datos simulados para una gráfica de barras (crecimiento semanal). 
  // ¡Luego los podemos conectar a Spring Boot también!
  const datosBarras = [
    { nombre: 'Lun', registros: 2 },
    { nombre: 'Mar', registros: 5 },
    { nombre: 'Mié', registros: 3 },
    { nombre: 'Jue', registros: 8 },
    { nombre: 'Vie', registros: 4 },
  ];

  return (
    <div className="py-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Business Intelligence</h1>
          <p className="text-gray-500 font-medium mt-1">Métricas y rendimiento global de la plataforma</p>
        </div>

        {/* Tarjetas de Resumen Rápido */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-sm font-bold text-gray-500 uppercase">Total Tiendas</p>
            <p className="text-3xl font-black text-gray-900">{metricas.totalTiendas}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
            <p className="text-sm font-bold text-green-700 uppercase">Operando</p>
            <p className="text-3xl font-black text-green-700">{metricas.tiendasAprobadas}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
            <p className="text-sm font-bold text-blue-700 uppercase">En Revisión</p>
            <p className="text-3xl font-black text-blue-700">{metricas.tiendasPendientes}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
            <p className="text-sm font-bold text-red-700 uppercase">Suspendidas</p>
            <p className="text-3xl font-black text-red-700">{metricas.tiendasSuspendidas}</p>
          </div>
        </div>

        {/* Contenedor de las Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Gráfica de Dona: Proporción de Estados */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Distribución de Estatus</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosDona}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {datosDona.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfica de Barras: Crecimiento */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Nuevos Registros (Esta Semana)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosBarras}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="nombre" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f3f4f6'}} />
                  <Bar dataKey="registros" fill="#003366" radius={[4, 4, 0, 0]} name="Tiendas Registradas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}