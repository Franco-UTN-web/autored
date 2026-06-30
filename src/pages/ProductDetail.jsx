import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🔧 PARCHE VITE: Arreglo para los íconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const centroPorDefecto = [19.4326, -99.1332];

// Componente para recentrar el mapa mágicamente
function RecenterMap({ coordenadas, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coordenadas, zoom);
  }, [coordenadas, zoom, map]);
  return null;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showStores, setShowStores] = useState(false);
  
  const [productoPrincipal, setProductoPrincipal] = useState(null);
  const [sucursalesDisponibles, setSucursalesDisponibles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el Mapa
  const [mapCenter, setMapCenter] = useState(centroPorDefecto);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(null);
  const [coordenadasMarcador, setCoordenadasMarcador] = useState(null);
  const [alertaMapa, setAlertaMapa] = useState('');

  useEffect(() => {
    const fetchDatosCompletos = async () => {
      try {
        // 🔥 MAGIA: Pedimos el inventario Y las tiendas al mismo tiempo
        const [resInventario, resTiendas] = await Promise.all([
          fetch('http://localhost:8080/api/inventario/todos'),
          fetch('http://localhost:8080/api/establecimientos/todos')
        ]);

        if (!resInventario.ok || !resTiendas.ok) throw new Error('Error al conectar con la base de datos');
        
        const dataInventario = await resInventario.json();
        const dataTiendas = await resTiendas.json();
        
        // 1. Encontrar el inventario exacto que el usuario clickeó
        const itemEncontrado = dataInventario.find(item => item.id === id);
        if (!itemEncontrado) throw new Error('La pieza que buscas no existe o fue eliminada.');
        
        setProductoPrincipal(itemEncontrado);

        // 2. Buscar qué sucursales venden la pieza Y cruzar sus datos con la info de la tienda
        const tiendasConEstaPieza = dataInventario
          .filter(item => item.pieza.id === itemEncontrado.pieza.id)
          .map(itemInventario => {
            // Buscamos los datos reales de la tienda usando el establecimiento_id
            const datosTienda = dataTiendas.find(t => t.id === itemInventario.establecimiento_id);
            return { ...itemInventario, tiendaInfo: datosTienda };
          })
          .filter(item => item.tiendaInfo && item.tiendaInfo.estado === 'APROBADO'); // Solo tiendas aprobadas
          
        setSucursalesDisponibles(tiendasConEstaPieza);

      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    fetchDatosCompletos();
  }, [id]);

  // ACTULIZADO: Ahora usa el teléfono real de la tienda
  const contactarWhatsApp = (stock, precio, nombrePieza, marca, numeroParte, telefonoTienda) => {
    const numeroDestino = telefonoTienda || "525555555555"; 
    const numParteTexto = numeroParte ? ` (PN: ${numeroParte})` : '';
    const mensaje = `Hola, vengo de AutoRed. Me interesa la pieza: *${nombrePieza}*${numParteTexto} Marca: ${marca}. ¿Aún tienen stock de ${stock} piezas a $${precio}?`;
    window.open(`https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  // Función para ubicar la tienda en el mapa
  const ubicarEnMapa = async (tiendaUnida) => {
    const tienda = tiendaUnida.tiendaInfo;
    setTiendaSeleccionada(tienda);
    setAlertaMapa(''); 
    
    // Si la tienda no tiene dirección completa (para evitar errores)
    if (!tienda.calle) {
       setAlertaMapa("📍 Esta sucursal aún no registra su dirección completa.");
       return;
    }

    const direccionCompleta = `${tienda.calle} ${tienda.numero}, ${tienda.colonia}, ${tienda.ciudad || tienda.municipio || ''}, ${tienda.estadoRep}, México`;

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionCompleta)}`);
      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const nuevasCoordenadas = [lat, lng];
        
        setMapCenter(nuevasCoordenadas);
        setCoordenadasMarcador(nuevasCoordenadas);
        
        // Hacemos un poco de scroll hacia el mapa en móviles
        window.scrollBy({ top: 300, behavior: 'smooth' });
      } else {
        setAlertaMapa("📍 OpenStreetMap no pudo ubicar la dirección exacta. Mostrando el mapa general.");
      }
    } catch (error) {
      setAlertaMapa("Hubo un problema al contactar al servidor de mapas. 🔧");
    }
  };

  if (cargando) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-autoblue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !productoPrincipal) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Producto no encontrado</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link to="/catalogo" className="bg-autoblue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-900 transition-colors">Volver al Catálogo</Link>
      </div>
    );
  }

  const { pieza, precio_oferta, stock } = productoPrincipal;

  return (
    <div className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navegación Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-autoblue font-bold">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to="/catalogo" className="hover:text-autoblue font-bold">Catálogo</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-bold truncate">{pieza.nombre_comercial}</span>
        </div>

        {/* Tarjeta Principal de Detalles */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Imagen */}
            <div className="h-96 md:h-auto overflow-hidden bg-white flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100">
              {pieza.imagen_url ? (
                <img 
                  src={pieza.imagen_url} 
                  alt={pieza.nombre_comercial} 
                  className="w-full max-h-96 object-contain transform transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <span className="text-gray-300 font-medium font-black text-4xl opacity-50">{pieza.nombre_comercial?.charAt(0)}</span>
              )}
            </div>

            {/* Información del Producto */}
            <div className="p-8 lg:p-12 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-blue-50 text-autoblue px-3 py-1 rounded-full border border-blue-100 font-bold text-xs tracking-wider uppercase">
                    {pieza.marca}
                  </span>
                  
                  {/* Etiqueta de Condición */}
                  {pieza.condicion && (
                    <span className={`px-3 py-1 rounded-full border font-black text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-sm
                      ${pieza.condicion === 'Nueva' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        pieza.condicion === 'Usada' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                        'bg-purple-50 text-purple-700 border-purple-200'}`}
                    >
                      {pieza.condicion === 'Nueva' && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>}
                      {pieza.condicion === 'Usada' && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                      {pieza.condicion === 'Reconstruida' && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>}
                      {pieza.condicion}
                    </span>
                  )}
                </div>

                <span className={`px-3 py-1 rounded-full border font-bold text-xs flex items-center gap-1.5 ${stock > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  <span className={`w-2 h-2 rounded-full ${stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {stock > 0 ? 'En Stock' : 'Agotado'}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2 leading-tight">
                {pieza.nombre_comercial}
              </h1>

              {/* Número de Parte destacado */}
              {pieza.numero_parte && (
                <div className="mb-4">
                  <p className="text-sm font-mono text-gray-500">
                    No. Parte / OEM: <span className="font-bold text-autoblue bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{pieza.numero_parte}</span>
                  </p>
                </div>
              )}
              
              <div className="mb-8">
                <span className="text-4xl font-black text-autored">${precio_oferta?.toFixed(2)} <span className="text-lg text-gray-500 font-medium">MXN</span></span>
              </div>

              {/* DESCRIPCIÓN DEL VENDEDOR */}
              {pieza.descripcion && (
                <div className="mb-8 bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                  <h3 className="font-black text-autoblue mb-3 flex items-center gap-2 uppercase tracking-wider text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Notas del Vendedor
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {pieza.descripcion}
                  </p>
                </div>
              )}

              {/* Ficha Técnica */}
              <div className="space-y-4 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100 flex-1">
                <h3 className="font-black text-gray-900 mb-4 border-b border-gray-200 pb-2 uppercase tracking-wider text-sm">Ficha Técnica</h3>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="col-span-1 text-gray-500 font-bold">Compatibilidad:</span>
                  <span className="col-span-2 text-gray-900 font-medium">{pieza.marca_vehiculo} {pieza.modelo}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="col-span-1 text-gray-500 font-bold">Año:</span>
                  <span className="col-span-2 text-gray-900 font-medium">{pieza.anio_vehiculo}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="col-span-1 text-gray-500 font-bold">Categoría:</span>
                  <span className="col-span-2 text-gray-900 font-medium">{pieza.categoria}</span>
                </div>
                {pieza.nivel_calidad && (
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="col-span-1 text-gray-500 font-bold">Calidad:</span>
                    <span className="col-span-2 text-gray-900 font-medium">{pieza.nivel_calidad}</span>
                  </div>
                )}
                {pieza.garantia && (
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="col-span-1 text-gray-500 font-bold">Garantía:</span>
                    <span className="col-span-2 text-gray-900 font-medium">{pieza.garantia}</span>
                  </div>
                )}
              </div>

              {/* Botón de Acción Dinámico */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button 
                  onClick={() => setShowStores(!showStores)}
                  className="flex-1 bg-autoblue hover:bg-blue-900 text-white py-4 rounded-xl font-black text-lg transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {showStores ? 'Ocultar Disponibilidad' : `Ver en ${sucursalesDisponibles.length} Sucursales`}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* 🔥 SECCIÓN DE MAPA Y SUCURSALES 🔥 */}
        {showStores && (
          <div className="mt-12 animate-fade-in">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-autored" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              Disponible en {sucursalesDisponibles.length} {sucursalesDisponibles.length === 1 ? 'sucursal' : 'sucursales'}
            </h2>
            
            <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[60vh]">
              
              {/* LISTA DE TIENDAS */}
              <div className="w-full lg:w-1/2 space-y-4 overflow-y-auto pr-2">
                {sucursalesDisponibles.map(sucursalUnida => {
                  const { tiendaInfo } = sucursalUnida;
                  return (
                    <div 
                      key={sucursalUnida.id} 
                      onClick={() => ubicarEnMapa(sucursalUnida)}
                      className={`bg-white p-5 rounded-xl border transition-all cursor-pointer shadow-sm
                        ${tiendaSeleccionada?.id === tiendaInfo.id ? 'border-autoblue ring-1 ring-autoblue bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-black text-gray-900">{tiendaInfo.nombre || 'Sucursal Registrada'}</h3>
                          <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                            {tiendaInfo.ciudad || tiendaInfo.estadoRep || 'Ver ubicación en mapa'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-autored">${sucursalUnida.precio_oferta?.toFixed(2)}</p>
                          <p className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-wider ${sucursalUnida.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {sucursalUnida.stock === 0 ? 'Agotado' : `${sucursalUnida.stock} pzas`}
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que se abra el mapa al darle a contactar
                          contactarWhatsApp(sucursalUnida.stock, sucursalUnida.precio_oferta, pieza.nombre_comercial, pieza.marca, pieza.numero_parte, tiendaInfo.telefono);
                        }}
                        disabled={sucursalUnida.stock === 0}
                        className="w-full mt-3 bg-[#25D366] hover:bg-[#1DA851] disabled:bg-gray-200 disabled:text-gray-400 text-white py-2 rounded-lg font-black text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.88-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                        Contactar
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* MAPA LEAFLET */}
              <div className="w-full lg:w-1/2 min-h-[300px] bg-gray-200 border border-gray-200 rounded-2xl shadow-sm relative overflow-hidden z-0">
                
                {/* Alerta Personalizada */}
                {alertaMapa && (
                  <div className="absolute top-4 left-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-xl z-[1000] flex items-center justify-between animate-fade-in text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                      <span>{alertaMapa}</span>
                    </div>
                    <button onClick={() => setAlertaMapa('')} className="text-red-400 hover:text-red-700 p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                )}

                <MapContainer center={mapCenter} zoom={5} style={{ width: '100%', height: '100%' }}>
                  <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  
                  <RecenterMap coordenadas={mapCenter} zoom={tiendaSeleccionada ? 16 : 5} />

                  {coordenadasMarcador && tiendaSeleccionada && (
                    <Marker position={coordenadasMarcador}>
                      <Popup>
                        <div className="p-1 max-w-[200px] text-center">
                          <h4 className="font-black text-gray-900 text-sm">{tiendaSeleccionada.nombre}</h4>
                          <p className="text-xs text-gray-600 mt-1">{tiendaSeleccionada.calle} #{tiendaSeleccionada.numero}</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
                
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-[10px] font-bold text-gray-500 pointer-events-none z-[999]">
                  Motor: OpenStreetMap
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}