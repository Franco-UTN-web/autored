import React from 'react';
import { Package, TrendingUp, Users, AlertCircle } from 'lucide-react';

export default function StoreOverview({ datosTienda }) {
  // Estas métricas por ahora son de prueba, luego las podemos conectar a Java
  // para que cuente cuántas piezas reales tiene publicadas la tienda.
  const metricas = {
    piezasActivas: 24,
    vistasMes: 1450,
    clientesInteresados: 8,
    piezasAgotadas: 2
  };

  return (
    <div className="p-8 animate-fade-in">
      
      {/* ENCABEZADO */}
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          ¡Hola, {datosTienda?.user_metadata?.nombre || 'Socio'}!
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Aquí tienes un resumen del rendimiento de tu inventario hoy.
        </p>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-autoblue transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-autoblue group-hover:scale-110 transition-transform">
            <Package size={48} />
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 relative z-10">Piezas Activas</p>
          <p className="text-4xl font-black text-gray-900 relative z-10">{metricas.piezasActivas}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-green-500 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-green-500 group-hover:scale-110 transition-transform">
            <TrendingUp size={48} />
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 relative z-10">Vistas este Mes</p>
          <p className="text-4xl font-black text-gray-900 relative z-10">{metricas.vistasMes}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-purple-500 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-500 group-hover:scale-110 transition-transform">
            <Users size={48} />
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 relative z-10">Clientes Interesados</p>
          <p className="text-4xl font-black text-gray-900 relative z-10">{metricas.clientesInteresados}</p>
        </div>

        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-red-600 group-hover:scale-110 transition-transform">
            <AlertCircle size={48} />
          </div>
          <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 relative z-10">Stock Agotado</p>
          <p className="text-4xl font-black text-red-700 relative z-10">{metricas.piezasAgotadas}</p>
        </div>

      </div>

      {/* SECCIÓN DE AVISOS */}
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
        <div className="bg-white p-2 rounded-full shadow-sm text-autoblue mt-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div>
          <h3 className="text-autoblue font-black text-lg mb-1">Mejora tus publicaciones</h3>
          <p className="text-gray-600 font-medium text-sm">
            Recuerda que ahora puedes agregar una <strong>descripción detallada</strong> a tus refacciones. 
            Las piezas con descripción tienen un 40% más de probabilidad de ser contactadas por los compradores.
          </p>
        </div>
      </div>

    </div>
  );
}