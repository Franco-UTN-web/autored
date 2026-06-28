import { Link } from 'react-router-dom';

export default function SobreNosotros() {
  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* 1. HERO SECTION (Encabezado Impactante) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block bg-white text-autoblue text-xs font-black px-4 py-2 rounded-full shadow-sm border border-blue-100 mb-6 uppercase tracking-wider">
            La Red de Refaccionarias Inteligente
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Construyendo la infraestructura digital del <span className="text-transparent bg-clip-text bg-gradient-to-r from-autoblue to-autored">mercado automotriz</span>.
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            En AutoRed centralizamos el inventario de múltiples sucursales en tiempo real. Ayudamos a talleres, mecánicos y conductores a localizar la refacción exacta en segundos, sin intermediarios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalogo" className="bg-autoblue hover:bg-blue-900 text-white font-black px-8 py-4 rounded-xl text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Explorar Catálogo 
            </Link>
            <Link to="/directorio" className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-black px-8 py-4 rounded-xl text-base transition-all shadow-sm">
              Ver Sucursales
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MISIÓN Y VISIÓN (Grid asimétrico) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-50 to-red-50 rounded-3xl transform -rotate-2 z-0"></div>
            <img src="/logo2.jpeg" alt="AutoRed Corporativo" className="relative z-10 w-full h-auto object-cover rounded-2xl shadow-lg border border-white" />
          </div>
          
          <div className="order-1 lg:order-2 space-y-10">
            <div>
              <h2 className="text-sm font-black text-autored uppercase tracking-widest mb-2">Nuestra Misión</h2>
              <p className="text-2xl font-bold text-gray-900 leading-snug">
                "Eliminar la incertidumbre y la fricción en la búsqueda de refacciones, conectando la demanda con el inventario real de México."
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-blue-50 rounded-full flex items-center justify-center text-autoblue border border-blue-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Para el Comprador</h3>
                  <p className="text-gray-500 font-medium text-sm mt-1">Encuentra piezas garantizadas, compara opciones y contacta directamente a la tienda sin perder tiempo visitando mostradores.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-red-50 rounded-full flex items-center justify-center text-autored border border-red-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Para la Refaccionaria</h3>
                  <p className="text-gray-500 font-medium text-sm mt-1">Digitaliza tu mostrador, expande tu alcance más allá de tu código postal y recibe clientes con alta intención de compra directo en tu WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* 3. PROPUESTA DE VALOR (Tarjetas Técnicas) */}
      <section className="bg-gray-50 py-24 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tecnología al servicio del taller</h2>
            <p className="text-gray-500 font-medium mt-4 text-base">
              No somos un intermediario que encarece el producto. Somos la capa tecnológica que organiza el mercado para que todos ganen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-blue-50 text-autoblue rounded-xl flex items-center justify-center mb-6 group-hover:bg-autoblue group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight mb-3">Sincronización Total</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Cada pieza agregada al inventario se indexa de inmediato en nuestra base de datos distribuida, asegurando que el stock que ves en pantalla sea real.
              </p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-red-50 text-autored rounded-xl flex items-center justify-center mb-6 group-hover:bg-autored group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight mb-3">Motor de Búsqueda</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Segmentación precisa por número de parte (OEM), marca, modelo y categoría. Encuentra alternativas Premium u Originales en segundos.
              </p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight mb-3">Conexión Directa</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Integramos enlaces directos a WhatsApp para cada sucursal. El usuario pacta la entrega o recolección directo con el vendedor, sin comisiones ocultas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION (CTA Final) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-black text-gray-900 mb-6">¿Eres dueño de una refaccionaria?</h2>
        <p className="text-gray-500 font-medium mb-8 text-lg">
          Únete a la red de AutoRed y empieza a recibir pedidos hoy mismo. El registro es rápido y nuestro equipo te guiará en cada paso.
        </p>
        <Link to="/registro-negocio" className="inline-block bg-gray-900 hover:bg-black text-white font-black px-8 py-4 rounded-xl text-lg transition-all shadow-md">
          Registrar mi Negocio
        </Link>
      </section>

    </div>
  );
}