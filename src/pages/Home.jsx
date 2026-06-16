import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Home() {
  const [destacados, setDestacados] = useState([]);
  const navigate = useNavigate();

  // Traemos los datos reales de tu base de datos para las piezas destacadas
  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/inventario/todos');
        if (response.ok) {
          const data = await response.json();
          // Solo tomamos los primeros 3 productos para no saturar el inicio
          setDestacados(data.slice(0, 3)); 
        }
      } catch (error) {
        console.error("Error cargando destacados:", error);
      }
    };
    fetchDestacados();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* Hero Section */}
      <div className="relative bg-white border-b border-gray-200 py-20 shadow-sm overflow-hidden">
        {/* Fondo decorativo sutil */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-3xl h-full bg-blue-50 opacity-30 blur-3xl pointer-events-none rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-gray-900 leading-tight">
            La red automotriz más <span className="text-autored">inteligente</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 font-medium">
            Encuentra piezas, compara refaccionarias y optimiza el mantenimiento de tu vehículo en una sola plataforma.
          </p>
          
          {/* Buscador Principal */}
          <div className="max-w-3xl mx-auto bg-white p-2.5 rounded-2xl border border-gray-200 shadow-xl flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              placeholder="¿Qué pieza o marca buscas?" 
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-autoblue font-medium transition-all" 
            />
            <select className="bg-gray-50 text-gray-700 rounded-xl px-5 py-3.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-autoblue font-medium font-bold">
              <option>Todas las marcas</option>
              <option>Volkswagen</option>
              <option>Nissan</option>
            </select>
            <button 
              onClick={() => navigate('/catalogo')}
              className="bg-autoblue hover:bg-blue-900 text-white px-10 py-3.5 rounded-xl font-black transition-colors shadow-md text-sm tracking-wider uppercase"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Lado Izquierdo: Piezas Destacadas */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Piezas Destacadas</h2>
            <Link to="/catalogo" className="text-autoblue hover:text-blue-800 text-sm font-bold flex items-center gap-1">
              Ver catálogo completo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {destacados.length === 0 ? (
               <div className="text-center py-10 text-gray-400 font-medium border border-dashed border-gray-200 rounded-xl">Cargando inventario...</div>
            ) : (
              destacados.map(item => (
                // Diseño de Tarjeta Horizontal adaptado a tus datos
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-6 items-center hover:shadow-md transition-all group">
                  
                  <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-lg p-2 flex items-center justify-center border border-gray-100 shrink-0 relative overflow-hidden">
                    {item.pieza?.imagen_url ? (
                      <img src={item.pieza.imagen_url} className="max-h-full object-contain group-hover:scale-110 transition-transform" alt="pieza" />
                    ) : (
                      <span className="text-xs text-gray-400">Sin foto</span>
                    )}
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-[10px] text-autoblue font-black uppercase tracking-widest bg-blue-50 inline-block px-2 py-1 rounded mb-1">{item.pieza?.categoria}</p>
                    <h4 className="text-lg font-black text-gray-900 leading-tight mb-1">{item.pieza?.nombre_comercial}</h4>
                    <p className="text-xs text-gray-500 font-medium mb-1">Para: {item.pieza?.marca_vehiculo} {item.pieza?.modelo}</p>
                    <p className="text-xs text-gray-400 font-bold">Marca: <span className="text-gray-600">{item.pieza?.marca}</span></p>
                  </div>
                  
                  <div className="text-center sm:text-right shrink-0 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
                    <p className="text-3xl font-black text-autored">${item.precio_oferta?.toFixed(2)}</p>
                    <p className="text-[10px] font-bold text-green-600 mb-3 uppercase tracking-wider">{item.stock} disponibles</p>
                    <button 
                      onClick={() => navigate('/catalogo')} 
                      className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors"
                    >
                      Ver en Catálogo
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Lado Derecho: Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-4 border-b border-gray-100 pb-3">Top Refaccionarias</h3>
            <ul className="space-y-5">
              <li className="flex justify-between items-center text-sm group cursor-pointer">
                <span className="text-gray-700 font-bold group-hover:text-autoblue transition-colors">Autopartes Express</span>
                <span className="text-yellow-500 font-black text-xs bg-yellow-50 px-2 py-1 rounded">★ 4.9</span>
              </li>
              <li className="flex justify-between items-center text-sm group cursor-pointer">
                <span className="text-gray-700 font-bold group-hover:text-autoblue transition-colors">Mecánica Total Sur</span>
                <span className="text-yellow-500 font-black text-xs bg-yellow-50 px-2 py-1 rounded">★ 4.7</span>
              </li>
              <li className="flex justify-between items-center text-sm group cursor-pointer">
                <span className="text-gray-700 font-bold group-hover:text-autoblue transition-colors">Refaccionaria del Norte</span>
                <span className="text-yellow-500 font-black text-xs bg-yellow-50 px-2 py-1 rounded">★ 4.5</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-6 rounded-2xl text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full opacity-50"></div>
            <h3 className="text-autoblue font-black mb-2 text-lg relative z-10">¿Eres Distribuidor?</h3>
            <p className="text-gray-500 text-sm mb-5 font-medium leading-relaxed relative z-10">Únete a nuestra red y multiplica tus ventas de mostrador conectando tu inventario.</p>
            <Link to="/login" className="block w-full bg-white hover:bg-autoblue border-2 border-autoblue text-autoblue hover:text-white py-2.5 rounded-xl text-sm font-black transition-all shadow-sm relative z-10">
              Registrar Negocio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}