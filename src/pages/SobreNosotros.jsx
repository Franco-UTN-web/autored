import { Link } from 'react-router-dom';

export default function SobreNosotros() {
  return (
    <div className="bg-white min-h-screen font-sans">
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12 border-b border-gray-100">
        <div className="flex-1 space-y-6">
          <span className="bg-blue-50 text-autoblue text-xs font-black px-3 py-1.5 rounded-md uppercase tracking-wider border border-blue-100">
            Red de Refaccionarias Inteligente
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            La infraestructura digital detrás del <span className="text-autored">mercado automotriz</span>.
          </h1>
          <p className="text-gray-500 text-base md:text-lg font-medium leading-relaxed max-w-xl">
            En AutoRed centralizamos el inventario de múltiples sucursales en tiempo real, permitiendo a talleres, mecánicos y compradores particulares localizar la refacción exacta con total transparencia y comunicación directa al mostrador.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/catalogo" className="bg-autoblue hover:bg-blue-900 text-white font-black px-8 py-3.5 rounded-xl text-sm transition-all shadow-md">
              Explorar Catálogo Global
            </Link>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-md md:max-w-none flex justify-center">
          <div className="relative bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
            <img src="/logo2.jpeg" alt="AutoRed Corporativo" className="w-full h-64 object-contain rounded-2xl opacity-90 filter drop-shadow-sm" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Nuestra Propuesta de Valor</h2>
          <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">
            Diseñamos un ecosistema donde las refaccionarias expanden su alcance y los clientes eliminan la incertidumbre de la búsqueda manual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm space-y-4 hover:border-gray-200 transition-all">
            <div className="w-12 h-12 bg-blue-50 text-autoblue rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Sincronización en Tiempo Real</h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Cada pieza agregada al inventario se indexa de inmediato en nuestra base de datos distribuida, asegurando stock real.
            </p>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm space-y-4 hover:border-gray-200 transition-all">
            <div className="w-12 h-12 bg-red-50 text-autored rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Filtros Avanzados y Cobertura</h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Segmentación precisa por marca, modelo y categoría, permitiendo encontrar alternativas Premium u Originales en segundos.
            </p>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm space-y-4 hover:border-gray-200 transition-all">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            </div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Contacto sin Intermediarios</h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Integramos enlaces directos a WhatsApp. El usuario pacta la entrega o recolección directo con la sucursal.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}