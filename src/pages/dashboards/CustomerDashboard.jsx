import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  return (
    <div className="py-10 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado Principal */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mi Taller Virtual</h1>
            <p className="text-gray-500 font-medium mt-1">Bienvenido de vuelta, <span className="text-autoblue font-bold">Jesús Alarcón</span></p>
          </div>
          <Link to="/catalogo" className="bg-autoblue hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            Buscar Nueva Pieza
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Vehículos y Búsquedas */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Mis Vehículos */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-autoblue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                  Mis Vehículos
                </h3>
                <button className="text-autoblue hover:text-blue-900 text-sm font-bold bg-blue-50 px-3 py-1 rounded-lg transition-colors">Añadir +</button>
              </div>
              
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-autoblue transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 group-hover:text-autoblue transition-colors shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-autoblue transition-colors">Volkswagen Jetta</p>
                  <p className="text-sm text-gray-500 font-medium">2018 • 2.5L</p>
                </div>
              </div>
            </div>

            {/* Búsquedas Recientes */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                <svg className="w-5 h-5 text-autored" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Visto Recientemente
              </h3>
              <ul className="text-sm text-gray-600 space-y-3">
                <li className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200 font-medium hover:border-autored transition-colors cursor-pointer">
                  <span className="w-2 h-2 bg-autored rounded-full"></span>
                  Balatas de cerámica Brembo
                </li>
                <li className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200 font-medium hover:border-autored transition-colors cursor-pointer">
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  Bomba de Agua GMB
                </li>
              </ul>
            </div>
          </div>

          {/* Columna Derecha: Cotizaciones/Pedidos */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
              <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                <svg className="w-5 h-5 text-autoblue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                Mis Solicitudes y Cotizaciones
              </h3>
              
              <div className="space-y-4 flex-1">
                
                {/* Item de Cotización 1 */}
                <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-autoblue transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold text-gray-400 tracking-wider">ID: COT-8923</span>
                      <h4 className="font-bold text-gray-900 text-lg group-hover:text-autoblue transition-colors">Amortiguadores Traseros Gas KYB</h4>
                    </div>
                    <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Aprobada
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-50">
                    <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                      Mecánica Total Sur
                    </p>
                    <div className="text-right">
                      <p className="text-xl font-black text-autored">$2,100</p>
                      <button className="text-autoblue text-xs font-bold mt-1 hover:underline">Ver ticket de compra</button>
                    </div>
                  </div>
                </div>

                {/* Item de Cotización 2 */}
                <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-autoblue transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold text-gray-400 tracking-wider">ID: REQ-042</span>
                      <h4 className="font-bold text-gray-900 text-lg group-hover:text-autoblue transition-colors">Bomba de Agua GMB</h4>
                    </div>
                    <span className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Esperando Respuesta
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-50">
                    <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                      Autopartes Express
                    </p>
                    <div className="text-right text-gray-400 text-sm font-medium">
                      Por definir...
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}