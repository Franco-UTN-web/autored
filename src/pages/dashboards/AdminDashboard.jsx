export default function AdminDashboard() {
  return (
    <div className="py-10 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-black text-black mb-8 border-b border-gray-200 pb-4">Panel de Control Global (Admin)</h1>

        {/* KPIs Generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-bold mb-1">Usuarios Totales</p>
                <p className="text-3xl font-black text-black">12,458</p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-bold mb-1">Refaccionarias</p>
                <p className="text-3xl font-black text-black">342</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg text-black shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-red-500 shadow-md md:col-span-2 bg-gradient-to-r from-red-500 to-red-600 text-white">
            <p className="text-red-100 text-sm font-bold mb-1">Volumen de Transacciones (Mes)</p>
            <p className="text-3xl font-black">$1.2M <span className="text-lg font-medium text-red-200">MXN</span></p>
          </div>
        </div>

        {/* Gestión Rápida y Gráfica */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Aprobación de Negocios */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg text-black mb-4">Aprobación de Nuevos Negocios</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
                <div>
                  <p className="font-bold text-black">AutoPartes "El Güero"</p>
                  <p className="text-xs text-gray-500 font-medium">RFC: AUGE891023...</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-black hover:bg-gray-200 p-2 rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                  <button className="text-pink-600 hover:bg-pink-50 p-2 rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></button>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfica Simulada con Tailwind */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-black">Análisis Mensual</h3>
              <button className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-yellow-100 transition-colors">Generar Reporte Excel</button>
            </div>
            
            {/* Contenedor de las Barras */}
            <div className="flex-1 flex items-end justify-between gap-4 h-40 pt-4 border-b border-gray-200 pb-2">
              
              {/* Enero */}
              <div className="flex flex-col items-center justify-end h-full w-full group">
                <div className="w-full flex gap-1 items-end justify-center h-full relative">
                  <div className="w-1/2 bg-black rounded-t-sm h-[30%] group-hover:opacity-80 transition-opacity"></div>
                  <div className="w-1/2 bg-pink-500 rounded-t-sm h-[45%] group-hover:opacity-80 transition-opacity shadow-sm"></div>
                </div>
              </div>

              {/* Febrero */}
              <div className="flex flex-col items-center justify-end h-full w-full group">
                <div className="w-full flex gap-1 items-end justify-center h-full">
                  <div className="w-1/2 bg-black rounded-t-sm h-[40%] group-hover:opacity-80 transition-opacity"></div>
                  <div className="w-1/2 bg-pink-500 rounded-t-sm h-[60%] group-hover:opacity-80 transition-opacity shadow-sm"></div>
                </div>
              </div>

              {/* Marzo */}
              <div className="flex flex-col items-center justify-end h-full w-full group">
                <div className="w-full flex gap-1 items-end justify-center h-full">
                  <div className="w-1/2 bg-black rounded-t-sm h-[55%] group-hover:opacity-80 transition-opacity"></div>
                  <div className="w-1/2 bg-pink-500 rounded-t-sm h-[80%] group-hover:opacity-80 transition-opacity shadow-sm"></div>
                </div>
              </div>

              {/* Abril */}
              <div className="flex flex-col items-center justify-end h-full w-full group">
                <div className="w-full flex gap-1 items-end justify-center h-full">
                  <div className="w-1/2 bg-black rounded-t-sm h-[45%] group-hover:opacity-80 transition-opacity"></div>
                  <div className="w-1/2 bg-pink-500 rounded-t-sm h-[70%] group-hover:opacity-80 transition-opacity shadow-sm"></div>
                </div>
              </div>

              {/* Mayo */}
              <div className="flex flex-col items-center justify-end h-full w-full group">
                <div className="w-full flex gap-1 items-end justify-center h-full">
                  <div className="w-1/2 bg-black rounded-t-sm h-[70%] group-hover:opacity-80 transition-opacity"></div>
                  <div className="w-1/2 bg-pink-500 rounded-t-sm h-[100%] group-hover:opacity-80 transition-opacity shadow-sm"></div>
                </div>
              </div>
            </div>
            
            {/* Etiquetas del Eje X */}
            <div className="flex justify-between mt-2 text-xs text-gray-400 font-bold tracking-wider">
              <span className="w-full text-center">ENE</span>
              <span className="w-full text-center">FEB</span>
              <span className="w-full text-center">MAR</span>
              <span className="w-full text-center">ABR</span>
              <span className="w-full text-center">MAY</span>
            </div>
            
            {/* Leyenda */}
            <div className="flex justify-center gap-6 mt-6 text-xs font-bold text-gray-600">
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-pink-500 rounded-full shadow-sm"></span> Ventas Exitosas</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-black rounded-full"></span> Nuevos Registros</div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}