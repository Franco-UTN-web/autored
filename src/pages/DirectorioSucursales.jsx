import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DirectorioSucursales() {
  const [sucursales, setSucursales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroTexto, setFiltroTexto] = useState('');

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/establecimientos/todos');
        if (response.ok) {
          const data = await response.json();
          // Filtramos para mostrar ÚNICAMENTE las que el Admin ya aprobó
          const tiendasAprobadas = data.filter(tienda => tienda.estado === 'APROBADO');
          setSucursales(tiendasAprobadas);
        }
      } catch (error) {
        console.error("Error al cargar las sucursales:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchSucursales();
  }, []);

  // Búsqueda minimalista local
  const sucursalesFiltradas = sucursales.filter(tienda => 
    tienda.nombre?.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado limpio */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Red de Distribuidores</h1>
            <p className="text-gray-500 font-medium mt-2">Encuentra refaccionarias oficiales y visita sus mostradores digitales.</p>
          </div>
          
          {/* Buscador sutil, sin barras gigantes */}
          <div className="w-full md:w-72">
            <input 
              type="text" 
              placeholder="Buscar sucursal..." 
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-autoblue focus:border-transparent text-sm font-medium transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Cuadrícula de Sucursales */}
        {cargando ? (
          <div className="flex justify-center py-20">
            <span className="w-10 h-10 border-4 border-autoblue border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : sucursalesFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            <h3 className="text-lg font-black text-gray-900 mb-1">No encontramos sucursales</h3>
            <p className="text-sm text-gray-500">Prueba con otro término de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sucursalesFiltradas.map(tienda => (
              <div key={tienda.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-autoblue transition-all flex flex-col items-center text-center group">
                
                {/* Logo circular generado con la inicial */}
                <div className="w-20 h-20 bg-blue-50 text-autoblue rounded-full flex items-center justify-center text-3xl font-black mb-4 border-4 border-white shadow-sm group-hover:scale-110 transition-transform">
                  {tienda.nombre?.charAt(0).toUpperCase() || 'S'}
                </div>
                
                <h3 className="font-black text-gray-900 text-lg mb-1 line-clamp-1">{tienda.nombre}</h3>
                <p className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded mb-6 uppercase tracking-wider">
                  Socio Verificado
                </p>
                
                <Link 
                  to={`/tienda/${tienda.id}`} 
                  className="w-full bg-gray-50 hover:bg-autoblue text-gray-700 hover:text-white border border-gray-200 hover:border-autoblue font-bold py-2.5 rounded-xl text-sm transition-colors mt-auto"
                >
                  Ver Mostrador
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}