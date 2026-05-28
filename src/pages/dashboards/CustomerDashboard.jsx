export default function CustomerDashboard() {
  return (
    <div className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-4">Mi Taller Virtual</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta de Vehículos */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-autoblue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              <h3 className="font-semibold text-lg text-gray-800">Mis Vehículos</h3>
            </div>
            
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-autoblue transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-autoblue shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Volkswagen Jetta</p>
                <p className="text-sm text-gray-500">2018 • 2.5L</p>
              </div>
            </div>
          </div>

          {/* Tarjeta de Búsquedas */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-autored" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <h3 className="font-semibold text-lg text-gray-800">Historial de Búsquedas</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-3">
              <li className="flex items-center gap-2 bg-gray-50 p-3 rounded border border-gray-200">
                <span className="w-2 h-2 bg-autored rounded-full"></span>
                Balatas de cerámica Brembo (Ayer)
              </li>
              <li className="flex items-center gap-2 bg-gray-50 p-3 rounded border border-gray-200">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Filtro de aire de cabina (Hace 3 días)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}