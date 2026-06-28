import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { supabase } from '../supabase';

// Definimos las categorías rápidas fuera del componente para mantener limpio el código
const CATEGORIAS_RAPIDAS = [
  { id: 'Cualquiera', label: 'Todas las piezas' },
  { id: 'Motor', label: 'Motor' },
  { id: 'Frenos', label: 'Frenos' },
  { id: 'Suspensión', label: 'Suspensión' },
  { id: 'Eléctrico', label: 'Eléctrico' },
  { id: 'Transmisión', label: 'Transmisión' },
  { id: 'Accesorios', label: 'Accesorios' }
];

export default function Catalog() {
  let usuarioLogueado = null;
  try {
    const datosUsuarioJson = localStorage.getItem('user_data');
    if (datosUsuarioJson && datosUsuarioJson !== "undefined") {
      usuarioLogueado = JSON.parse(datosUsuarioJson);
    }
  } catch (error) {
    console.warn("Datos de sesión no encontrados.");
  }

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [miTiendaId, setMiTiendaId] = useState(null); 

  // --- ESTADOS DEL GARAJE VIRTUAL ---
  const [misVehiculos, setMisVehiculos] = useState([]);
  const [filtroMiVehiculo, setFiltroMiVehiculo] = useState(''); 

  // --- ESTADOS DEL COMPARADOR ---
  const [listaComparacion, setListaComparacion] = useState([]);
  const [modalMatrizAbierto, setModalMatrizAbierto] = useState(false);
  const [alerta, setAlerta] = useState({ visible: false, mensaje: '' });

  const [busqueda, setBusqueda] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('Cualquiera');
  const [filtroCategoria, setFiltroCategoria] = useState('Cualquiera');
  const [precioMax, setPrecioMax] = useState(5000);
  const [orden, setOrden] = useState('relevancia');

  useEffect(() => {
    const inicializarCatalogo = async () => {
      try {
        const responseCat = await fetch('http://localhost:8080/api/inventario/todos');
        if (!responseCat.ok) throw new Error('Error al cargar el catálogo');
        const dataCat = await responseCat.json();
        setProductos(dataCat);

        if (usuarioLogueado) {
          const resEst = await fetch('http://localhost:8080/api/establecimientos/todos');
          if (resEst.ok) {
            const tiendas = await resEst.json();
            const miTienda = tiendas.find(t => t.propietario_id === usuarioLogueado.id);
            if (miTienda) setMiTiendaId(miTienda.id);
          }

          if (usuarioLogueado.user_metadata?.role === 'comprador') {
            const { data: vehiculos } = await supabase
              .from('vehiculos_cliente')
              .select('*')
              .eq('usuario_id', usuarioLogueado.id);
            
            if (vehiculos) setMisVehiculos(vehiculos);
          }
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };
    inicializarCatalogo();
  }, []);

  // --- LÓGICA DEL COMPARADOR ---
  const mostrarAlerta = (mensaje) => {
    setAlerta({ visible: true, mensaje });
    setTimeout(() => setAlerta({ visible: false, mensaje: '' }), 3000);
  };

  const toggleComparacion = (producto) => {
    const yaEsta = listaComparacion.find(p => p.id === producto.id);
    if (yaEsta) {
      setListaComparacion(prev => prev.filter(p => p.id !== producto.id));
    } else {
      if (listaComparacion.length >= 3) {
        mostrarAlerta("Solo puedes comparar hasta 3 piezas al mismo tiempo.");
        return;
      }
      if (listaComparacion.length > 0 && listaComparacion[0].pieza.categoria !== producto.pieza.categoria) {
        mostrarAlerta(`Solo puedes comparar piezas de la misma categoría (${listaComparacion[0].pieza.categoria}).`);
        return;
      }
      setListaComparacion(prev => [...prev, producto]);
    }
  };

  // --- FILTROS INTELIGENTES ---
  const productosFiltrados = useMemo(() => {
    let filtrados = productos.filter(item => {
      const pieza = item.pieza;
      if (!pieza) return false;

      const vehiculoActivo = misVehiculos.find(v => v.id === filtroMiVehiculo);
      const pasaMiVehiculo = !vehiculoActivo || 
        (pieza.marca_vehiculo?.toLowerCase() === vehiculoActivo.marca?.toLowerCase() && 
         pieza.modelo?.toLowerCase() === vehiculoActivo.modelo?.toLowerCase());

      const textoBusqueda = busqueda.toLowerCase();
      const pasaBusqueda = 
        pieza.nombre_comercial?.toLowerCase().includes(textoBusqueda) ||
        pieza.marca?.toLowerCase().includes(textoBusqueda) ||
        pieza.modelo?.toLowerCase().includes(textoBusqueda) ||
        pieza.numero_parte?.toLowerCase().includes(textoBusqueda);

      const pasaMarca = filtroMarca === 'Cualquiera' || pieza.marca_vehiculo === filtroMarca;
      const pasaCategoria = filtroCategoria === 'Cualquiera' || pieza.categoria === filtroCategoria;
      const pasaPrecio = item.precio_oferta <= precioMax || precioMax >= 5000;

      return pasaMiVehiculo && pasaBusqueda && pasaMarca && pasaCategoria && pasaPrecio;
    });

    if (orden === 'menor') filtrados.sort((a, b) => a.precio_oferta - b.precio_oferta);
    else if (orden === 'mayor') filtrados.sort((a, b) => b.precio_oferta - a.precio_oferta);

    return filtrados;
  }, [productos, busqueda, filtroMarca, filtroCategoria, precioMax, orden, filtroMiVehiculo, misVehiculos]);

  if (orden === 'menor') productosFiltrados.sort((a, b) => a.precio_oferta - b.precio_oferta);
  else if (orden === 'mayor') productosFiltrados.sort((a, b) => b.precio_oferta - a.precio_oferta);

  const limpiarFiltros = () => {
    setBusqueda(''); setFiltroMarca('Cualquiera'); setFiltroCategoria('Cualquiera'); setPrecioMax(5000); setOrden('relevancia'); setFiltroMiVehiculo('');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8 font-sans pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Catálogo de Autopartes</h1>
          <p className="text-gray-500 font-medium mt-1">Encuentra tu refacción y resérvala directo con el vendedor.</p>
        </div>

        {/* ======================================================== */}
        {/* NUEVO: CARRUSEL DE CATEGORÍAS RÁPIDAS (Estilo Puma) */}
        {/* ======================================================== */}
        <div className="mb-8 overflow-x-auto hide-scrollbar pb-2">
          <div className="flex gap-3 whitespace-nowrap min-w-max">
            {CATEGORIAS_RAPIDAS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFiltroCategoria(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 ${
                  filtroCategoria === cat.id 
                    ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ALERTA FLOTANTE (Errores del comparador) */}
        <div className={`fixed top-24 left-1/2 z-[100] transform -translate-x-1/2 transition-all duration-300 ${alerta.visible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
          <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {alerta.mensaje}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* SIDEBAR DE FILTROS */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Búsqueda rápida</h3>
              <input type="text" placeholder="Ej. Bosch, Balatas..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg pl-3 pr-3 py-2.5 text-sm focus:border-autoblue focus:ring-1 focus:outline-none transition-all" />
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm sticky top-28">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Filtros</h3>
              <div className="space-y-5">
                
                {/* FILTRO DEL GARAJE (Solo aparece si el usuario tiene autos guardados) */}
                {misVehiculos.length > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg animate-fade-in">
                    <label className="text-[10px] text-autoblue font-black block mb-2 uppercase flex items-center gap-1 tracking-wider">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      Filtro Inteligente
                    </label>
                    <select 
                      value={filtroMiVehiculo}
                      onChange={(e) => setFiltroMiVehiculo(e.target.value)}
                      className="w-full bg-white border border-blue-200 text-autoblue font-bold rounded-md px-2 py-2 text-xs focus:outline-none shadow-sm cursor-pointer"
                    >
                      <option value="">Ver todo el catálogo</option>
                      {misVehiculos.map(v => (
                        <option key={v.id} value={v.id}>Piezas para mi {v.marca} {v.modelo}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-500 font-bold block mb-2">MARCA DE VEHÍCULO</label>
                  <select value={filtroMarca} onChange={(e) => setFiltroMarca(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm focus:border-autoblue focus:outline-none font-medium">
                    <option value="Cualquiera">Cualquiera</option>
                    <option value="Volkswagen">Volkswagen</option><option value="Nissan">Nissan</option><option value="Chevrolet">Chevrolet</option><option value="Ford">Ford</option>
                  </select>
                </div>
                
                {/* Este select ahora se sincroniza automáticamente con los botones de arriba */}
                <div>
                  <label className="text-xs text-gray-500 font-bold block mb-2">TIPO DE PIEZA</label>
                  <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm focus:border-autoblue focus:outline-none font-medium">
                    {CATEGORIAS_RAPIDAS.map(cat => (
                      <option key={`select-${cat.id}`} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-bold block mb-2">PRECIO MÁXIMO: <span className="text-autoblue">${precioMax >= 5000 ? '5000+' : precioMax}</span></label>
                  <input type="range" min="100" max="5000" step="100" value={precioMax} onChange={(e) => setPrecioMax(Number(e.target.value))} className="w-full accent-autoblue" />
                </div>
              </div>
              <button onClick={limpiarFiltros} className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold border border-gray-200 mt-6 py-2.5 rounded-lg text-sm transition-colors">Limpiar Filtros</button>
            </div>
          </div>

          {/* RESULTADOS */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-600 text-sm font-medium">Mostrando <span className="text-autoblue font-black">{productosFiltrados.length}</span> resultados</p>
              <select value={orden} onChange={(e) => setOrden(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-1.5 text-sm focus:outline-none font-medium">
                <option value="relevancia">Ordenar por: Relevancia</option>
                <option value="menor">Menor a mayor precio</option>
                <option value="mayor">Mayor a menor precio</option>
              </select>
            </div>

            {cargando && <div className="flex justify-center items-center py-20"><span className="w-8 h-8 border-4 border-autoblue border-t-transparent rounded-full animate-spin"></span></div>}
            
            {!cargando && productosFiltrados.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
                <p className="text-gray-500 font-medium text-lg">No se encontraron piezas con estos filtros.</p>
                <button onClick={limpiarFiltros} className="mt-4 text-autoblue font-bold hover:underline">Restablecer búsqueda</button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {productosFiltrados.map((item) => (
                <ProductCard 
                  key={item.id} 
                  item={item} 
                  miTiendaId={miTiendaId} 
                  enComparacion={listaComparacion.some(p => p.id === item.id)}
                  onToggleCompare={() => toggleComparacion(item)}
                />
              ))}
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* BARRA FLOTANTE DE COMPARACIÓN */}
        {/* ======================================================== */}
        {listaComparacion.length > 0 && (
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-40 animate-slide-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 text-autoblue w-10 h-10 rounded-full flex items-center justify-center font-black text-lg border border-blue-100">
                  {listaComparacion.length}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Piezas listas para comparar</p>
                  <p className="text-xs text-gray-500 font-medium">Categoría: {listaComparacion[0].pieza.categoria}</p>
                </div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => setListaComparacion([])}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors text-sm"
                >
                  Limpiar
                </button>
                <button 
                  onClick={() => setModalMatrizAbierto(true)}
                  disabled={listaComparacion.length < 2}
                  className="flex-1 sm:flex-none bg-autoblue hover:bg-blue-900 disabled:bg-gray-300 text-white font-bold px-8 py-2.5 rounded-xl text-sm transition-colors shadow-md"
                >
                  {listaComparacion.length < 2 ? 'Selecciona 1 más...' : 'Comparar Ahora'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
      {modalMatrizAbierto && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-80 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl">
              
              {/* Header del Modal */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Comparativa de Piezas</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">Analiza características y precios lado a lado</p>
                </div>
                <button 
                  onClick={() => setModalMatrizAbierto(false)} 
                  className="text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 p-2 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body del Modal - Tarjetas lado a lado */}
              <div className="p-6 overflow-y-auto flex-1 bg-gray-50 rounded-b-2xl">
                <div className="flex flex-col lg:flex-row gap-6">
                  {listaComparacion.map((item) => (
                    <div key={`comp-${item.id}`} className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                      
                      {/* Foto */}
                      <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center mb-6 border border-gray-100 p-4 relative overflow-hidden">
                        {item.pieza?.imagen_url ? (
                          <img src={item.pieza.imagen_url} className="max-h-full object-contain" alt="pieza" />
                        ) : (
                          <span className="text-gray-300 font-black text-6xl">{item.pieza?.nombre_comercial?.charAt(0)}</span>
                        )}
                      </div>
                      
                      {/* Título y Precio */}
                      <div className="text-center mb-6">
                        <h4 className="font-black text-gray-900 text-lg mb-2 h-14 line-clamp-2 leading-tight">{item.pieza?.nombre_comercial}</h4>
                        <p className="text-4xl font-black text-autored">${item.precio_oferta}</p>
                      </div>

                      {/* Tabla de Especificaciones */}
                      <div className="space-y-3 flex-1 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">Marca Fab.</span>
                          <span className="font-black text-gray-900">{item.pieza?.marca}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">Compatibilidad</span>
                          <span className="font-medium text-gray-900 text-right">{item.pieza?.marca_vehiculo} {item.pieza?.modelo}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">No. Parte (OEM)</span>
                          <span className="font-mono font-bold text-autoblue bg-blue-50 px-1 rounded">{item.pieza?.numero_parte || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">Condición</span>
                          <span className="font-medium text-gray-900">{item.pieza?.condicion || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between pb-1">
                          <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">Garantía</span>
                          <span className="font-medium text-gray-900">{item.pieza?.garantia || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Botón de Compra */}
                      <div className="mt-6">
                        <Link 
                          to={`/producto/${item.id}`} 
                          className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                          Ver Detalles
                        </Link>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
    </div>
  );
}