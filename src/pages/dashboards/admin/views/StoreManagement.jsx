import React, { useState } from 'react';

export default function StoreManagement({ tiendas, onActualizarEstatus }) {
  const [filtro, setFiltro] = useState('TODOS');

  const tiendasFiltradas = tiendas.filter(tienda => {
    if (filtro === 'TODOS') return true;
    return tienda.estatus === filtro;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Directorio de Refaccionarias</h2>
          <p className="text-sm text-gray-500">Control de acceso y estatus de los establecimientos.</p>
        </div>
        
        {/* Filtros de Estatus */}
        <div className="flex gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200 self-start sm:self-center">
          {['TODOS', 'PENDIENTE', 'APROBADO', 'SUSPENDIDO'].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltro(estado)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filtro === estado
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {estado}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Establecimientos */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider bg-gray-50/50">
              <th className="py-3 px-4">Establecimiento</th>
              <th className="py-3 px-4">RFC</th>
              <th className="py-3 px-4">Contacto</th>
              <th className="py-3 px-4">Estatus</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {tiendasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-400">
                  No se encontraron establecimientos con este estatus.
                </td>
              </tr>
            ) : (
              tiendasFiltradas.map((tienda) => (
                <tr key={tienda.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-900">{tienda.nombre}</td>
                  <td className="py-4 px-4 text-gray-600 font-mono text-xs">{tienda.rfc}</td>
                  <td className="py-4 px-4 text-gray-500">
                    <div className="text-xs">{tienda.telefono}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      tienda.estatus === 'APROBADO' ? 'bg-green-50 text-green-700 border border-green-100' :
                      tienda.estatus === 'SUSPENDIDO' ? 'bg-red-50 text-red-700 border border-red-100' :
                      'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {tienda.estatus}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    {tienda.estatus === 'PENDIENTE' && (
                      <button
                        onClick={() => onActualizarEstatus(tienda.id, 'APROBADO')}
                        className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium transition-colors shadow-sm"
                      >
                        Aprobar
                      </button>
                    )}
                    {tienda.estatus === 'APROBADO' && (
                      <button
                        onClick={() => onActualizarEstatus(tienda.id, 'SUSPENDIDO')}
                        className="text-xs bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md font-medium transition-colors"
                      >
                        Suspender
                      </button>
                    )}
                    {tienda.estatus === 'SUSPENDIDO' && (
                      <button
                        onClick={() => onActualizarEstatus(tienda.id, 'APROBADO')}
                        className="text-xs bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md font-medium transition-colors"
                      >
                        Reactivar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}