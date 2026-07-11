import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

// 1. Un pequeño "truco" de React-Leaflet para mover la cámara
// cuando cambian las coordenadas
function RecenterAutomatically({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export default function MapaAutoRed({ direccionText, nombreTienda }) {
  // Coordenadas por defecto (CDMX)
  const [coordenadas, setCoordenadas] = useState([19.4326018, -99.1332049]);
  const [cargando, setCargando] = useState(false);
  const [errorMapa, setErrorMapa] = useState('');

  useEffect(() => {
    // Si no hay dirección, no hacemos nada
    if (!direccionText) return;

    const buscarCoordenadas = async () => {
      setCargando(true);
      setErrorMapa('');
      try {
        // 2. Le pegamos a la API gratuita de OpenStreetMap (Nominatim)
        // Usamos encodeURIComponent para que los espacios y comas viajen bien en la URL
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionText)}`;
        
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos && datos.length > 0) {
          // Tomamos el primer resultado que nos devuelva
          const lat = parseFloat(datos[0].lat);
          const lng = parseFloat(datos[0].lon);
          setCoordenadas([lat, lng]);
        } else {
          setErrorMapa('No pudimos localizar esta dirección exacta en el mapa.');
        }
      } catch (error) {
        setErrorMapa('Error al intentar cargar la ubicación.');
      } finally {
        setCargando(false);
      }
    };

    buscarCoordenadas();
  }, [direccionText]);

  return (
    <div className="w-full relative">
      
      {/* Mensaje flotante si está cargando o hay error */}
      {cargando && <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-[400] bg-autoblue text-white px-4 py-1 rounded-full text-xs font-bold shadow-md">Buscando ubicación...</div>}
      {errorMapa && <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-[400] bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md">{errorMapa}</div>}

      <div className="w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm relative z-0">
        <MapContainer 
          center={coordenadas} 
          zoom={15} 
          scrollWheelZoom={false} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={coordenadas}>
            <Popup>
              <div className="text-center">
                <strong className="text-autoblue">{nombreTienda || 'Ubicación'}</strong><br />
                {direccionText || 'Ciudad de México'}
              </div>
            </Popup>
          </Marker>

          {/* Aquí inyectamos nuestro mini-componente para mover la cámara */}
          <RecenterAutomatically lat={coordenadas[0]} lng={coordenadas[1]} />
        </MapContainer>
      </div>
    </div>
  );
}