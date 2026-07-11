import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Home() {
  const [destacados, setDestacados] = useState([]);
  const [topTiendas, setTopTiendas] = useState([]); 
  const [rolUsuario, setRolUsuario] = useState('invitado');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const datosUsuarioJson = localStorage.getItem('user_data');
      if (datosUsuarioJson && datosUsuarioJson !== "undefined") {
        const usuarioLogueado = JSON.parse(datosUsuarioJson);
        setRolUsuario(usuarioLogueado.user_metadata?.role || 'comprador');
      }
    } catch (e) {
      console.warn("No hay sesión activa");
    }
    const fetchDatos = async () => {
      try {
        const [resInventario, resEstablecimientos] = await Promise.all([
          fetch('http://localhost:8080/api/inventario/todos'),
          fetch('http://localhost:8080/api/establecimientos/todos') 
        ]);

        if (resInventario.ok) {
          const dataInventario = await resInventario.json();
          // Tomamos 3 elementos para mantener el diseño balanceado en la cuadrícula
          setDestacados(dataInventario.slice(0, 3)); 

          let diccionarioTiendas = {};
          if (resEstablecimientos.ok) {
            const dataEstablecimientos = await resEstablecimientos.json();
            dataEstablecimientos.forEach(tienda => {
              diccionarioTiendas[tienda.id] = tienda.nombre; 
            });
          }

          const tiendasUnicas = [];
          const idsVistos = new Set();

          dataInventario.forEach(item => {
            if (item.establecimiento_id && !idsVistos.has(item.establecimiento_id)) {
              idsVistos.add(item.establecimiento_id);
              
              const nombreReal = diccionarioTiendas[item.establecimiento_id] || `Sucursal ${item.establecimiento_id.split('-')[0].toUpperCase()}`;

              tiendasUnicas.push({
                id: item.establecimiento_id,
                nombre: nombreReal,
                calificacion: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1)
              });
            }
          });

          setTopTiendas(tiendasUnicas.slice(0, 4)); // Subimos a 4 para llenar mejor el sidebar
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    
    fetchDatos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* 1. HERO SECTION RENOVADO */}
      <div className="relative bg-white border-b border-gray-200 py-24 shadow-sm overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ef4444 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-blue-50/50 to-transparent blur-3xl pointer-events-none rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block bg-red-50 text-autored text-xs font-black px-4 py-2 rounded-full shadow-sm border border-red-100 mb-6 uppercase tracking-wider">
            Tú escribes, nosotros Buscamos
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-gray-900 leading-tight">
            La red automotriz <br className="hidden md:block" /> más <span className="text-transparent bg-clip-text bg-gradient-to-r from-autored to-red-500">inteligente</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 font-medium">
            Encuentra piezas, compara refaccionarias y optimiza el mantenimiento de tu vehículo en una sola plataforma. Sin intermediarios.
          </p>
          
          {/* Buscador Principal Mejorado */}
          <div className="max-w-4xl mx-auto bg-white p-3 rounded-2xl border border-gray-200 shadow-xl flex flex-col md:flex-row gap-3 transition-transform hover:-translate-y-1 duration-300">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-autoblue animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              </div>
              <input 
                type="text" 
                placeholder="Ej. Balatas delanteras, Filtro de aceite..." 
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-autoblue font-medium transition-all" 
              />
            </div>
            
            <div className="relative md:w-64 shrink-0">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <select className="w-full bg-gray-50 text-gray-700 rounded-xl pl-11 pr-4 py-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-autoblue font-bold appearance-none cursor-pointer">
                <option>Todas las marcas</option>
                <option>Volkswagen</option>
                <option>Nissan</option>
                <option>Chevrolet</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            <button 
              onClick={() => navigate('/catalogo')}
              className="bg-autoblue hover:bg-blue-900 text-white px-10 py-4 rounded-xl font-black transition-colors shadow-md text-sm tracking-wider uppercase flex items-center justify-center gap-2 shrink-0"
            >
              Buscar Pieza
            </button>
          </div>

{/* Carrusel de Marcas (Trust Badges) */}
          <div className="mt-12 pt-8 border-t border-gray-100/50">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
              Encuentra las mejores marcas del mercado
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Puedes reemplazar los src con logos reales en PNG que descargues */}
              <span className="text-xl font-black text-gray-800 flex items-center gap-1"><div className="w-4 h-4 rounded-full bg-blue-600"></div> BOSCH</span>
              <span className="text-xl font-black text-gray-800 flex items-center gap-1"><div className="w-4 h-4 bg-yellow-400"></div> LUK</span>
              <span className="text-xl font-black text-gray-800 flex items-center gap-1"><div className="w-4 h-4 bg-red-600 rounded-sm"></div> ACDelco</span>
              <span className="text-xl font-black text-gray-800 italic">Valeo</span>
              <span className="text-xl font-black text-gray-800 tracking-tighter">HELLA</span>
            </div>
          </div>
          
        </div>
      </div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Lado Izquierdo: Piezas Destacadas (Ahora en Grid) */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Recién Llegados</h2>
              <p className="text-sm text-gray-500 font-medium mt-1">Descubre las refacciones más recientes en la red.</p>
            </div>
            <Link to="/catalogo" className="text-autoblue hover:text-blue-900 text-sm font-black flex items-center gap-1 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
              Ver todo el catálogo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destacados.length === 0 ? (
               <div className="col-span-3 text-center py-20 text-gray-400 font-medium border-2 border-dashed border-gray-200 rounded-2xl bg-white">
                 <div className="w-8 h-8 border-4 border-autoblue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                 Sincronizando inventario...
               </div>
            ) : (
              destacados.map(item => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-2xl flex flex-col hover:shadow-xl hover:border-gray-300 transition-all duration-300 group overflow-hidden">
                  
                  {/* Imagen de la Tarjeta */}
                  <div className="w-full h-48 bg-gray-50 p-6 flex items-center justify-center border-b border-gray-100 relative overflow-hidden">
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-900 text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-wider z-10 border border-gray-200">
                      {item.pieza?.categoria}
                    </span>
                    {item.pieza?.imagen_url ? (
                      <img src={item.pieza.imagen_url} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" alt={item.pieza?.nombre_comercial} />
                    ) : (
                      <span className="text-4xl font-black text-gray-200 opacity-50">{item.pieza?.nombre_comercial?.charAt(0)}</span>
                    )}
                  </div>
                  
                  {/* Info de la Tarjeta */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-auto">
                      <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">{item.pieza?.marca}</p>
                      <h4 className="text-lg font-black text-gray-900 leading-tight mb-2 line-clamp-2">{item.pieza?.nombre_comercial}</h4>
                      <p className="text-xs text-gray-500 font-medium bg-gray-50 inline-block px-2 py-1 rounded border border-gray-100">
                        Aplica para: <span className="font-bold text-gray-700">{item.pieza?.marca_vehiculo}</span>
                      </p>
                    </div>
                    
                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Precio Especial</p>
                        <p className="text-2xl font-black text-autored">${item.precio_oferta?.toFixed(2)}</p>
                      </div>
                      <Link 
                        to={`/producto/${item.id}`} 
                        className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
                      >
                        Detalles
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Lado Derecho: Sidebar */}
       <div className="sticky top-24 space-y-6">
          
          {/* TOP REFACCIONARIAS DINÁMICO */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
    <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Top Sucursales</h3>
            </div>
            
            <div className="space-y-2">
              {topTiendas.length === 0 ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-10 bg-gray-100 rounded-lg"></div>
                  <div className="h-10 bg-gray-100 rounded-lg"></div>
                  <div className="h-10 bg-gray-100 rounded-lg"></div>
                </div>
              ) : (
                topTiendas.map((tienda, index) => (
                  <Link 
                    key={tienda.id} 
                    to={`/tienda/${tienda.id}`} 
                    className="flex justify-between items-center hover:bg-gray-50 p-3 rounded-xl transition-all border border-transparent hover:border-gray-200 group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="text-xs font-black text-gray-300 group-hover:text-autoblue transition-colors w-4">{index + 1}</span>
                      <span className="font-bold text-gray-800 text-sm truncate">{tienda.nombre}</span>
                    </div>
                    <span className="bg-yellow-50 text-yellow-700 text-xs font-black px-2 py-1 rounded shrink-0 flex items-center gap-1 border border-yellow-100">
                      ★ {tienda.calificacion}
                    </span>
                  </Link>
                ))
              )}
            </div>
            
            <Link to="/directorio" className="block text-center text-xs font-bold text-autoblue hover:text-blue-900 mt-6 pt-4 border-t border-gray-100 uppercase tracking-wider">
              Ver directorio completo
            </Link>
          </div>
          
          {/* Tarjeta de Registro de Negocio */}
          {(rolUsuario === 'invitado' || rolUsuario === 'comprador') && (
            <div className="bg-gray-900 p-6 rounded-2xl shadow-sm text-white text-center overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-autored/20 rounded-tr-full pointer-events-none"></div>
              
              <h3 className="text-white font-black mb-3 text-xl relative z-10 leading-tight">¿Eres Distribuidor?</h3>
              <p className="text-gray-300 text-sm mb-6 font-medium leading-relaxed relative z-10">Únete a nuestra red y multiplica tus ventas de mostrador hoy mismo.</p>
              <Link to="/registro-negocio" className="block w-full bg-autored hover:bg-red-700 text-white py-3.5 rounded-xl text-sm font-black transition-all shadow-md relative z-10">
                Registrar mi Tienda
              </Link>
            </div>
          )}

          {(rolUsuario === 'admin' || rolUsuario === 'tienda') && (
            <div className="bg-autoblue p-6 rounded-2xl shadow-sm text-white text-center overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none"></div>
              
              <h3 className="text-white font-black mb-2 text-lg relative z-10">¡Hola de nuevo!</h3>
              <p className="text-blue-100 text-sm mb-6 font-medium relative z-10">Tienes acceso a herramientas de gestión avanzadas.</p>
              <Link to={rolUsuario === 'admin' ? '/dashboard/admin' : '/dashboard/store'} className="block w-full bg-white text-autoblue hover:bg-blue-50 py-3.5 rounded-xl text-sm font-black transition-all shadow-md relative z-10">
                Ir a mi Panel de Control
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}