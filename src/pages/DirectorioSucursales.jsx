import { useState, useEffect } from 'react';
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
// ---------------------------------------------------------

const centroPorDefecto = [19.4326, -99.1332];

function RecenterMap({ coordenadas, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coordenadas, zoom);
  }, [coordenadas, zoom, map]);
  return null;
}

export default function DirectorioSucursales() {
  const [sucursales, setSucursales] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados para el Mapa
  const [mapCenter, setMapCenter] = useState(centroPorDefecto);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(null);
  const [coordenadasMarcador, setCoordenadasMarcador] = useState(null);

  // 🔥 NUEVO ESTADO: Para controlar el texto de la alerta flotante
  const [alertaMapa, setAlertaMapa] = useState('');

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/establecimientos/todos');
        if (response.ok) {
          const data = await response.json();
          const activas = data.filter(tienda => tienda.estado === 'APROBADO');
          setSucursales(activas);
        }
      } catch (error) {
        console.error("Error al cargar sucursales:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchSucursales();
  }, []);

  const ubicarEnMapa = async (tienda) => {
    setTiendaSeleccionada(tienda);
    setAlertaMapa(''); // Limpiamos cualquier alerta previa
    
    // 🔥 1. LA MAGIA: Si ya tenemos las coordenadas exactas de la BD, las usamos instantáneamente
    if (tienda.latitud && tienda.longitud) {
      const coordsExactas = [parseFloat(tienda.latitud), parseFloat(tienda.longitud)];
      setMapCenter(coordsExactas);
      setCoordenadasMarcador(coordsExactas);
      return; // Detenemos la función aquí, ya no necesitamos internet ni APIs
    }

    // 2. FALLBACK (Plan B): Solo si es una tienda vieja que no tiene coordenadas guardadas
    const direccionCompleta = `${tienda.calle} ${tienda.numero}, ${tienda.colonia}, ${tienda.ciudad || tienda.municipio}, ${tienda.estadoRep}, México`;

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionCompleta)}`);
      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const nuevasCoordenadas = [lat, lng];
        
        setMapCenter(nuevasCoordenadas);
        setCoordenadasMarcador(nuevasCoordenadas);
      } else {
        setAlertaMapa("📍 Tienda antigua sin pin exacto. Mostrando el mapa general.");
      }
    } catch (error) {
      console.error("Error buscando coordenadas:", error);
      setAlertaMapa("Hubo un problema al contactar al servidor de mapas. 🔧");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Directorio de Refaccionarias</h1>
          <p className="text-gray-500 font-medium mt-1">Encuentra la sucursal de AutoRed más cercana a tu taller.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:h-[75vh]">
          
        {/* COLUMNA IZQUIERDA (LISTA): Le damos una altura fija de 400px en móvil, y altura completa en PC */}
          <div className="w-full lg:w-1/3 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden h-[400px] lg:h-full">
            <div className="p-4 border-b border-gray-100 bg-gray-50 shrink-0">
              <h3 className="font-black text-gray-900">Sucursales Activas ({sucursales.length})</h3>
            </div>
            
            <div className="overflow-y-auto flex-1 p-4 space-y-4">
              {cargando ? (
                <div className="text-center py-10 text-gray-400 font-bold animate-pulse">Cargando directorio...</div>
              ) : sucursales.length === 0 ? (
                <div className="text-center py-10 text-gray-500 font-medium">No hay sucursales operando en este momento.</div>
              ) : (
                sucursales.map(tienda => (
                  <div 
                    key={tienda.id} 
                    onClick={() => ubicarEnMapa(tienda)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${tiendaSeleccionada?.id === tienda.id ? 'border-autoblue bg-blue-50 ring-1 ring-autoblue shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}
                  >
                    <h4 className="font-black text-gray-900">{tienda.nombre}</h4>
                    <p className="text-xs text-gray-500 mt-1 font-medium line-clamp-2">
                      {tienda.calle} #{tienda.numero}, Col. {tienda.colonia}, {tienda.municipio}, {tienda.estadoRep}. CP: {tienda.codigoPostal}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <span className="flex items-center gap-1 text-autoblue font-bold">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Ver en mapa
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA (MAPA) */}
          <div className="w-full lg:w-2/3 bg-gray-200 border border-gray-200 rounded-2xl shadow-sm relative overflow-hidden z-0 min-h-[400px] lg:min-h-[400px] lg:h-full">
            
            {/* 🔥 ALERTA PERSONALIZADA FLOTANTE 🔥 */}
            {alertaMapa && (
              <div className="absolute top-4 left-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-xl z-[1000] flex items-center justify-between animate-fade-in text-xs font-bold">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <span>{alertaMapa}</span>
                </div>
                <button 
                  onClick={() => setAlertaMapa('')} 
                  className="text-red-400 hover:text-red-700 transition-colors p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            )}

            <MapContainer 
              center={mapCenter} 
              zoom={5} 
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <RecenterMap coordenadas={mapCenter} zoom={tiendaSeleccionada ? 16 : 5} />

              {coordenadasMarcador && tiendaSeleccionada && (
                <Marker position={coordenadasMarcador}>
                  <Popup>
                    <div className="p-1 max-w-[200px] text-center">
                      <h4 className="font-black text-gray-900 text-sm">{tiendaSeleccionada.nombre}</h4>
                      <p className="text-xs text-gray-600 mt-1">{tiendaSeleccionada.calle} #{tiendaSeleccionada.numero}</p>
                      <a 
                        href={`https://wa.me/${tiendaSeleccionada.telefono}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="mt-2 text-xs bg-green-500 hover:bg-green-600 text-white font-bold px-2 py-1 rounded block transition-colors"
                      >
                        Contactar WhatsApp
                      </a>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>

            {/* Aviso de Motor */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-[10px] font-bold text-gray-500 pointer-events-none z-[999]">
              Motor: OpenStreetMap (Gratis)
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}