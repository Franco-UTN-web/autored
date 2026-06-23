import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

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

  // --- NUEVOS ESTADOS DEL COMPARADOR ---
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
      // Si ya está, lo quitamos
      setListaComparacion(prev => prev.filter(p => p.id !== producto.id));
    } else {
      // Reglas para agregar uno nuevo
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

  // --- FILTROS ---
  let productosFiltrados = productos.filter(item => {
    const pieza = item.pieza;
    if (!pieza) return false;

    const textoBusqueda = busqueda.toLowerCase();
    const pasaBusqueda = 
      pieza.nombre_comercial?.toLowerCase().includes(textoBusqueda) ||
      pieza.marca?.toLowerCase().includes(textoBusqueda) ||
      pieza.modelo?.toLowerCase().includes(textoBusqueda) ||
      pieza.numero_parte?.toLowerCase().includes(textoBusqueda);

    const pasaMarca = filtroMarca === 'Cualquiera' || pieza.marca_vehiculo === filtroMarca;
    const pasaCategoria = filtroCategoria === 'Cualquiera' || pieza.categoria === filtroCategoria;
    const pasaPrecio = item.precio_oferta <= precioMax || precioMax >= 5000;

    return pasaBusqueda && pasaMarca && pasaCategoria && pasaPrecio;
  });

  if (orden === 'menor') productosFiltrados.sort((a, b) => a.precio_oferta - b.precio_oferta);
  else if (orden === 'mayor') productosFiltrados.sort((a, b) => b.precio_oferta - a.precio_oferta);

  const limpiarFiltros = () => {
    setBusqueda(''); setFiltroMarca('Cualquiera'); setFiltroCategoria('Cualquiera'); setPrecioMax(5000); setOrden('relevancia');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8 font-sans pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Catálogo de Autopartes</h1>
          <p className="text-gray-500 font-medium mt-1">Encuentra tu refacción y resérvala directo con el vendedor.</p>
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
                <div>
                  <label className="text-xs text-gray-500 font-bold block mb-2">MARCA DE VEHÍCULO</label>
                  <select value={filtroMarca} onChange={(e) => setFiltroMarca(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm focus:border-autoblue focus:outline-none font-medium">
                    <option value="Cualquiera">Cualquiera</option>
                    <option value="Volkswagen">Volkswagen</option><option value="Nissan">Nissan</option><option value="Chevrolet">Chevrolet</option><option value="Ford">Ford</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold block mb-2">TIPO DE PIEZA</label>
                  <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm focus:border-autoblue focus:outline-none font-medium">
                    <option value="Cualquiera">Cualquiera</option>
                    <option value="Frenos">Frenos</option><option value="Motor">Motor</option><option value="Suspensión">Suspensión</option>
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
                <p className="text-gray-500 font-medium text-lg">No se encontraron piezas.</p>
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

        {/* ======================================================== */}
        {/* MODAL MATRIZ DE COMPARACIÓN */}
        {/* ======================================================== */}
        {modalMatrizAbierto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-in overflow-hidden">
              
              {/* Header Modal */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                <div>
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <svg className="w-6 h-6 text-autoblue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    Comparador Técnico
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">Contraste de especificaciones y precios</p>
                </div>
                <button onClick={() => setModalMatrizAbierto(false)} className="text-gray-400 hover:text-red-500 bg-white border border-gray-200 hover:bg-red-50 p-2 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              {/* Tabla Comparativa (Scrollable) */}
              <div className="flex-1 overflow-auto p-6 bg-white">
                <table className="w-full text-left border-collapse min-w-max">
                  <thead>
                    <tr>
                      <th className="w-48 p-4 bg-gray-50 border-b-2 border-gray-200 font-black text-gray-500 uppercase tracking-wider text-xs">Especificación</th>
                      {listaComparacion.map((item, index) => (
                        <th key={item.id} className="p-4 border-b-2 border-gray-200 text-center w-64 align-top">
                          {/* Botón quitar */}
                          <div className="flex justify-end mb-2">
                             <button onClick={() => {
                                toggleComparacion(item);
                                if(listaComparacion.length === 2) setModalMatrizAbierto(false);
                             }} className="text-gray-400 hover:text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>
                          </div>
                          <div className="h-24 bg-gray-50 rounded-lg flex items-center justify-center p-2 mb-3 border border-gray-100">
                            {item.pieza.imagen_url ? <img src={item.pieza.imagen_url} className="max-h-full mix-blend-multiply"/> : <span className="text-gray-300 font-black text-3xl opacity-50">{item.pieza.nombre_comercial?.charAt(0)}</span>}
                          </div>
                          <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{item.pieza.nombre_comercial}</p>
                          <p className="text-xs text-gray-500 mt-1">{item.pieza.marca}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-700 text-sm">Precio</td>
                      {listaComparacion.map(item => (
                        <td key={item.id} className="p-4 text-center font-black text-autored text-xl bg-red-50/30">${item.precio_oferta}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-700 text-sm">Condición</td>
                      {listaComparacion.map(item => (
                        <td key={item.id} className="p-4 text-center">
                          <span className="bg-gray-100 border border-gray-200 text-gray-600 font-bold text-xs px-2 py-1 rounded">{item.pieza.condicion || 'No especificada'}</span>
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-700 text-sm">Calidad</td>
                      {listaComparacion.map(item => (
                        <td key={item.id} className="p-4 text-center text-sm font-medium text-gray-800">{item.pieza.nivel_calidad || '-'}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-700 text-sm">Garantía</td>
                      {listaComparacion.map(item => (
                        <td key={item.id} className="p-4 text-center text-sm font-medium text-gray-600">{item.pieza.garantia || 'Sin garantía'}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-700 text-sm">Número de Parte (OEM)</td>
                      {listaComparacion.map(item => (
                        <td key={item.id} className="p-4 text-center">
                           <span className="font-mono text-xs bg-blue-50 text-autoblue px-2 py-1 rounded border border-blue-100">{item.pieza.numero_parte || 'N/A'}</span>
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-700 text-sm">Compatibilidad Base</td>
                      {listaComparacion.map(item => (
                        <td key={item.id} className="p-4 text-center text-sm text-gray-600">
                          {item.pieza.marca_vehiculo} {item.pieza.modelo} ({item.pieza.anio_vehiculo})
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-700 text-sm">Disponibilidad (Stock)</td>
                      {listaComparacion.map(item => (
                        <td key={item.id} className="p-4 text-center">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${item.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {item.stock > 0 ? `${item.stock} piezas` : 'Agotado'}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}