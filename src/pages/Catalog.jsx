import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

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
              {productosFiltrados.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}