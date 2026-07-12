import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function StoreProfile() {
  const { id } = useParams(); // Atrapamos el ID de la tienda desde la URL
  const navigate = useNavigate();
  
  const [inventarioTienda, setInventarioTienda] = useState([]);
  const [nombreTienda, setNombreTienda] = useState('Cargando tienda...'); // Nuevo estado para el nombre
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // --- ESTADOS DE SESIÓN ---
  const [rolUsuario, setRolUsuario] = useState('invitado');
  const [miTiendaId, setMiTiendaId] = useState(null);

  // --- ESTADOS DEL COMPARADOR ---
  const [listaComparacion, setListaComparacion] = useState([]);
  const [modalMatrizAbierto, setModalMatrizAbierto] = useState(false);
  const [alerta, setAlerta] = useState({ visible: false, mensaje: '' });

  useEffect(() => {
    // 1. Cargamos los datos del usuario logueado para pasarlos al ProductCard
    try {
      const datosUsuarioJson = localStorage.getItem('user_data');
      if (datosUsuarioJson && datosUsuarioJson !== "undefined") {
        const usuarioLogueado = JSON.parse(datosUsuarioJson);
        setRolUsuario(usuarioLogueado.user_metadata?.role || 'comprador');
        if (usuarioLogueado.user_metadata?.role === 'tienda') {
           setMiTiendaId(usuarioLogueado.id); 
        }
      }
    } catch (e) {
      console.warn("No hay sesión activa");
    }

    const fetchDatosTienda = async () => {
      try {
        // Hacemos DOS peticiones al mismo tiempo: Inventario y Establecimientos
        const [resInventario, resEstablecimientos] = await Promise.all([
          fetch('http://localhost:8080/api/inventario/todos'),
          fetch('http://localhost:8080/api/establecimientos/todos')
        ]);

        if (!resInventario.ok) throw new Error('Error al conectar con la base de datos');
        
        // 2. Procesamos el inventario
        const dataInventario = await resInventario.json();
        
        // 🔥 FILTRO DE BAJA LÓGICA APLICADO AQUÍ 🔥
        const productosFiltrados = dataInventario.filter(item => 
          item.establecimiento_id === id && 
          item.pieza && 
          item.pieza.activo !== false // Ocultamos si el Admin la desactivó
        );
        
        setInventarioTienda(productosFiltrados);

        // 3. Buscamos el nombre oficial de la tienda
        if (resEstablecimientos.ok) {
          const dataEstablecimientos = await resEstablecimientos.json();
          const tiendaEncontrada = dataEstablecimientos.find(tienda => tienda.id === id);
          
          if (tiendaEncontrada && tiendaEncontrada.nombre) {
            setNombreTienda(tiendaEncontrada.nombre);
          } else {
            // Si por algo no tiene nombre, usamos un genérico
            setNombreTienda(`Sucursal ${id.split('-')[0].toUpperCase()}`);
          }
        }
        
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    fetchDatosTienda();
  }, [id]);

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

  // Usamos la primera letra del nombre real para el logo redondo
  const inicialLogo = nombreTienda !== 'Cargando tienda...' ? nombreTienda.charAt(0).toUpperCase() : '';

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-32">
      
      {/* ALERTA FLOTANTE (Errores del comparador) */}
      <div className={`fixed top-24 left-1/2 z-[100] transform -translate-x-1/2 transition-all duration-300 ${alerta.visible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {alerta.mensaje}
        </div>
      </div>

      {/* --- BANNER DE LA TIENDA --- */}
      <div className="bg-autoblue pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar / Logo de la Tienda */}
          <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center text-autoblue font-black text-4xl border-4 border-white uppercase">
            {inicialLogo}
          </div>
          <div className="text-center md:text-left text-white">
            {/* Aquí ya mostramos el nombre real en grande */}
            <h1 className="text-3xl md:text-4xl font-black mb-2">{nombreTienda}</h1>
            <p className="text-blue-100 font-medium flex items-center justify-center md:justify-start gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              Vendedor Verificado AutoRed
            </p>
          </div>
        </div>
      </div>

      {/* --- INVENTARIO DE LA TIENDA --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 flex justify-between items-center">
          <h2 className="text-lg font-black text-gray-900">Catálogo del Vendedor</h2>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-bold">
            {inventarioTienda.length} piezas publicadas
          </span>
        </div>

        {cargando ? (
          <div className="flex justify-center py-20">
            <span className="w-10 h-10 border-4 border-autoblue border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center font-bold border border-red-100">
            {error}
          </div>
        ) : inventarioTienda.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <h3 className="text-xl font-black text-gray-900 mb-2">Esta tienda aún no tiene inventario visible</h3>
            <p className="text-gray-500">Regresa más tarde para ver sus refacciones publicadas.</p>
            <button onClick={() => navigate('/catalogo')} className="mt-6 text-autoblue font-bold hover:underline">Volver al catálogo general</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {inventarioTienda.map((item) => (
              <ProductCard 
                key={item.id} 
                item={item} 
                miTiendaId={miTiendaId}
                rolUsuario={rolUsuario}
                enComparacion={listaComparacion.some(p => p.id === item.id)}
                onToggleCompare={() => toggleComparacion(item)}
              />
            ))}
          </div>
        )}
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

      {/* MODAL DE MATRIZ DE COMPARACIÓN */}
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