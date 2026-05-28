import { useState } from 'react';

export default function RolesPanel() {
  const [activeRole, setActiveRole] = useState('admin');

  const roles = [
    { id: 'admin', name: 'Administrador', icon: '⚙️' },
    { id: 'distributor', name: 'Distribuidora', icon: '🏢' },
    { id: 'shop', name: 'Refaccionaria', icon: '🏪' },
    { id: 'customer', name: 'Cliente/Mecánico', icon: '🔧' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Portal de Roles Visual</h1>
        <p className="text-gray-400 mb-8">Simulación de dashboards según el tipo de usuario autenticado.</p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-900 p-2 rounded-xl border border-gray-800">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-2
                ${activeRole === role.id 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <span>{role.icon}</span>
              {role.name}
            </button>
          ))}
        </div>

        {/* Contenido Simulado por Rol */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {activeRole === 'admin' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-6 text-emerald-400">Panel de Control Global</h2>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700"><p className="text-gray-400 text-sm">Usuarios Totales</p><p className="text-3xl font-bold mt-2">1,248</p></div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700"><p className="text-gray-400 text-sm">Refaccionarias</p><p className="text-3xl font-bold mt-2">312</p></div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700"><p className="text-gray-400 text-sm">Transacciones Hoy</p><p className="text-3xl font-bold mt-2 text-emerald-500">89</p></div>
              </div>
              <div className="h-48 bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-center text-gray-500">Gráfico de métricas globales (Simulado)</div>
            </div>
          )}

          {activeRole === 'distributor' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-6 text-blue-400">Gestión de Inventario Mayorista</h2>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700"><p className="text-gray-400 text-sm">Pedidos Pendientes de Envío</p><p className="text-3xl font-bold mt-2 text-orange-400">14</p></div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700"><p className="text-gray-400 text-sm">Stock Crítico</p><p className="text-3xl font-bold mt-2 text-red-400">5 SKUs</p></div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg">Cargar Lote de Productos CSV</button>
            </div>
          )}

          {activeRole === 'shop' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-6 text-purple-400">Mostrador Digital</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="font-medium text-gray-300 mb-4">Últimas Solicitudes Cercanas</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 flex justify-between">
                      <span>Bomba de agua Chevy 2005</span><span className="text-purple-400">Responder Cotización</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="font-medium text-gray-300 mb-2">Visibilidad</h3>
                  <p className="text-2xl font-bold text-green-400">Activo</p>
                  <p className="text-xs text-gray-500 mt-1">Tu inventario es visible en el buscador global.</p>
                </div>
              </div>
            </div>
          )}

          {activeRole === 'customer' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-6 text-white">Mi Taller Virtual</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="font-medium text-gray-300 mb-4">Mis Vehículos</h3>
                  <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-lg">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">🚗</div>
                    <div><p className="font-medium">Volkswagen Jetta</p><p className="text-sm text-gray-400">2018 • 2.5L</p></div>
                  </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="font-medium text-gray-300 mb-4">Historial de Búsquedas</h3>
                  <ul className="text-sm text-gray-400 space-y-2 list-disc pl-4">
                    <li>Balatas de cerámica (Ayer)</li>
                    <li>Filtro de aire de cabina (Hace 3 días)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}