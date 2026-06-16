import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Catalog() {
  const navigate = useNavigate();

  // 1. LEER LA SESIÓN ACTUAL (Para saber si es comprador o tienda)
  const datosUsuario = JSON.parse(localStorage.getItem('user_data') || '{}');
  const rolUsuario = datosUsuario?.user_metadata?.role || 'comprador';
  const idTiendaUsuario = datosUsuario?.user_metadata?.establecimiento_id;

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('Cualquiera');
  const [filtroCategoria, setFiltroCategoria] = useState('Cualquiera');
  const [precioMax, setPrecioMax] = useState(5000);
  const [orden, setOrden] = useState('relevancia');

  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/inventario/todos');
        if (!response.ok) throw new Error('Error al cargar el catálogo');
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };
    fetchCatalogo();
  }, []);

  let productosFiltrados = productos.filter(item => {
    const pieza = item.pieza;
    if (!pieza) return false;

    const textoBusqueda = busqueda.toLowerCase();
    const pasaBusqueda = 
      pieza.nombre_comercial?.toLowerCase().includes(textoBusqueda) ||
      pieza.marca?.toLowerCase().includes(textoBusqueda) ||
      pieza.modelo?.toLowerCase().includes(textoBusqueda);

    const pasaMarca = filtroMarca === 'Cualquiera' || pieza.marca_vehiculo === filtroMarca;
    const pasaCategoria = filtroCategoria === 'Cualquiera' || pieza.categoria === filtroCategoria;
    const pasaPrecio = item.precio_oferta <= precioMax || precioMax >= 5000;

    return pasaBusqueda && pasaMarca && pasaCategoria && pasaPrecio;
  });

  if (orden === 'menor') {
    productosFiltrados.sort((a, b) => a.precio_oferta - b.precio_oferta);
  } else if (orden === 'mayor') {
    productosFiltrados.sort((a, b) => b.precio_oferta - a.precio_oferta);
  }

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroMarca('Cualquiera');
    setFiltroCategoria('Cualquiera');
    setPrecioMax(5000);
    setOrden('relevancia');
  };

  const contactarWhatsApp = (producto) => {
    const numeroTienda = "525555555555"; 
    const mensaje = `Hola, me interesa la pieza: *${producto.pieza.nombre_comercial}* (Marca: ${producto.pieza.marca}). ¿Aún tienen stock de ${producto.stock} piezas a $${producto.precio_oferta}?`;
    window.open(`https://wa.me/${numeroTienda}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Catálogo de Autopartes</h1>
          <p className="text-gray-500 font-medium mt-1">Explora el inventario global de todas nuestras sucursales.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* SIDEBAR */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Búsqueda rápida</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ej. Bosch, Golf..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg pl-3 pr-3 py-2.5 text-sm focus:border-autoblue focus:ring-1 focus:ring-autoblue focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm sticky top-28">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Filtros</h3>
              <div className="space-y-5">
                <div>
                  <label className="text-xs text-gray-500 font-bold block mb-2">MARCA DE VEHÍCULO</label>
                  <select 
                    value={filtroMarca}
                    onChange={(e) => setFiltroMarca(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm focus:border-autoblue focus:ring-1 focus:ring-autoblue focus:outline-none font-medium"
                  >
                    <option value="Cualquiera">Cualquiera</option>
                    <option value="Volkswagen">Volkswagen</option>
                    <option value="Nissan">Nissan</option>
                    <option value="Chevrolet">Chevrolet</option>
                    <option value="Ford">Ford</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 font-bold block mb-2">TIPO DE PIEZA</label>
                  <select 
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm focus:border-autoblue focus:ring-1 focus:ring-autoblue focus:outline-none font-medium"
                  >
                    <option value="Cualquiera">Cualquiera</option>
                    <option value="Frenos">Frenos</option>
                    <option value="Motor">Motor</option>
                    <option value="Suspensión">Suspensión</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-bold block mb-2">
                    PRECIO MÁXIMO: <span className="text-autoblue">${precioMax >= 5000 ? '5000+' : precioMax}</span>
                  </label>
                  <input 
                    type="range" 
                    min="100" 
                    max="5000" 
                    step="100"
                    value={precioMax}
                    onChange={(e) => setPrecioMax(Number(e.target.value))}
                    className="w-full accent-autoblue" 
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-bold">
                    <span>$100</span>
                    <span>$5000+</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={limpiarFiltros}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold border border-gray-200 mt-6 py-2.5 rounded-lg text-sm transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>

          {/* RESULTADOS */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-600 text-sm font-medium">
                Mostrando <span className="text-autoblue font-black">{productosFiltrados.length}</span> resultados
              </p>
              <select 
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-autoblue font-medium"
              >
                <option value="relevancia">Ordenar por: Relevancia</option>
                <option value="menor">Menor a mayor precio</option>
                <option value="mayor">Mayor a menor precio</option>
              </select>
            </div>

            {cargando && (
              <div className="flex justify-center items-center py-20">
                <span className="w-8 h-8 border-4 border-autoblue border-t-transparent rounded-full animate-spin"></span>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold text-sm border border-red-100">
                {error}
              </div>
            )}

            {!cargando && productosFiltrados.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
                <p className="text-gray-500 font-medium text-lg">No se encontraron piezas con estos filtros.</p>
                <button onClick={limpiarFiltros} className="mt-4 text-autoblue font-bold hover:underline">Restablecer búsqueda</button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {productosFiltrados.map(item => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col group">
                  
                  <div className="h-48 bg-gray-50 flex items-center justify-center p-4 relative border-b border-gray-100 overflow-hidden">
                    {item.pieza?.imagen_url ? (
                      <img src={item.pieza.imagen_url} alt={item.pieza.nombre_comercial} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-gray-400 text-sm font-medium">Sin imagen</span>
                    )}
                    {item.pieza?.nivel_calidad && (
                      <span className="absolute top-2 left-2 bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                        {item.pieza.nivel_calidad}
                      </span>
                    )}
                    {item.stock > 0 && item.stock <= 3 && (
                      <span className="absolute top-2 right-2 bg-autored text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-sm animate-pulse">
                        ¡Últimas {item.stock} {item.stock === 1 ? 'pieza' : 'piezas'}!
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.pieza?.marca}</span>
                      <span className="text-[10px] font-bold text-autoblue bg-blue-50 px-2 py-0.5 rounded">{item.pieza?.categoria}</span>
                    </div>
                    
                    <h4 className="text-base font-black text-gray-900 leading-tight mb-1">{item.pieza?.nombre_comercial || 'Pieza'}</h4>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-1">Para: {item.pieza?.marca_vehiculo} {item.pieza?.modelo}</p>
                    
                    <div className="mt-auto">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <p className="text-2xl font-black text-autored leading-none mt-1">${item.precio_oferta?.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-black px-2 py-1 rounded ${item.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                            {item.stock === 0 ? 'Agotado' : `${item.stock} ${item.stock === 1 ? 'pieza' : 'piezas'}`}
                          </p>
                        </div>
                      </div>

                      {/* LÓGICA DE BOTONES INTELIGENTES */}
                      {rolUsuario === 'tienda' ? (
                        item.establecimiento_id === idTiendaUsuario ? (
                          <button 
                            onClick={() => navigate('/store-dashboard')}
                            className="w-full bg-autoblue hover:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                          >
                            Editar en Mi Mostrador
                          </button>
                        ) : (
                          <button 
                            disabled
                            className="w-full bg-gray-100 text-gray-400 font-bold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                          >
                            Vendido por otra sucursal
                          </button>
                        )
                      ) : (
                        <button 
                          onClick={() => contactarWhatsApp(item)}
                          disabled={item.stock === 0}
                          className="w-full bg-[#25D366] hover:bg-[#1DA851] disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.88-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                          {item.stock > 0 ? 'Contactar' : 'Agotado'}
                        </button>
                      )}

                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}