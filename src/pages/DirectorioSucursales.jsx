import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

// Configuración del tamaño del mapa
const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem'
};

// Centro por defecto (Ciudad de México)
const centroPorDefecto = { lat: 19.4326, lng: -99.1332 };

export default function DirectorioSucursales() {
  const [sucursales, setSucursales] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados para el Mapa
  const [mapCenter, setMapCenter] = useState(centroPorDefecto);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(null);
  const [coordenadasMarcador, setCoordenadasMarcador] = useState(null);

  // ⚠️ AQUÍ IRÁ TU API KEY DE GOOGLE CLOUD EN EL FUTURO
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "TU_API_KEY_DE_GOOGLE_AQUI" // <--- Reemplazar luego
  });

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/establecimientos/todos');
        if (response.ok) {
          const data = await response.json();
          // Solo mostramos las tiendas que ya fueron APROBADAS por el Admin
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

  // FUNCIÓN MAGICA: Convierte la dirección de texto a Coordenadas en el mapa
  const ubicarEnMapa = (tienda) => {
    setTiendaSeleccionada(tienda);
    
    if (!window.google) return; // Si el mapa no ha cargado, salimos

    const geocoder = new window.google.maps.Geocoder();
    const direccionCompleta = `${tienda.calle} ${tienda.numero}, ${tienda.colonia}, ${tienda.municipio}, ${tienda.estadoRep}, México`;

    geocoder.geocode({ address: direccionCompleta }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        const nuevasCoordenadas = { lat, lng };
        
        setMapCenter(nuevasCoordenadas);
        setCoordenadasMarcador(nuevasCoordenadas);
      } else {
        alert("No pudimos encontrar la ubicación exacta de esta sucursal en el mapa.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Directorio de Refaccionarias</h1>
          <p className="text-gray-500 font-medium mt-1">Encuentra la sucursal de AutoRed más cercana a tu taller.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-[75vh]">
          
          {/* COLUMNA IZQUIERDA: LISTA DE TIENDAS */}
          <div className="w-full lg:w-1/3 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
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

          {/* COLUMNA DERECHA: GOOGLE MAPS */}
          <div className="w-full lg:w-2/3 bg-gray-200 border border-gray-200 rounded-2xl shadow-sm relative flex items-center justify-center overflow-hidden">
            {!isLoaded ? (
              <div className="text-gray-500 font-bold animate-pulse">Cargando motor de mapas...</div>
            ) : (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={tiendaSeleccionada ? 16 : 5}
                options={{
                  disableDefaultUI: false,
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: false,
                }}
              >
                {/* Dibujamos el Pin si hay coordenadas */}
                {coordenadasMarcador && tiendaSeleccionada && (
                  <Marker position={coordenadasMarcador}>
                    <InfoWindow position={coordenadasMarcador}>
                      <div className="p-1 max-w-[200px]">
                        <h4 className="font-black text-gray-900 text-sm">{tiendaSeleccionada.nombre}</h4>
                        <p className="text-xs text-gray-600 mt-1">{tiendaSeleccionada.calle} #{tiendaSeleccionada.numero}</p>
                        <a href={`https://wa.me/${tiendaSeleccionada.telefono}`} target="_blank" rel="noopener noreferrer" className="mt-2 text-xs bg-green-500 text-white font-bold px-2 py-1 rounded block text-center">
                          Contactar WhatsApp
                        </a>
                      </div>
                    </InfoWindow>
                  </Marker>
                )}
              </GoogleMap>
            )}

            {/* Aviso de API KEY (Solo para que sepas por qué sale gris al inicio) */}
            {isLoaded && <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-[10px] font-bold text-gray-500 pointer-events-none">Motor: Google Maps API</div>}
          </div>

        </div>
      </div>
    </div>
  );
}