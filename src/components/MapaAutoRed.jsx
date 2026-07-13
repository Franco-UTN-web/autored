import { useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

// 🔥 Le agregamos un nuevo prop: onDireccionEncontrada 🔥
export default function MapaSelector({ onCoordenadasSeleccionadas, onDireccionEncontrada, coordenadasIniciales }) {
  const [posicion, setPosicion] = useState(coordenadasIniciales || [19.4326018, -99.1332049]);
  const [buscando, setBuscando] = useState(false);
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      async dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const nuevaPosicion = marker.getLatLng();
          setPosicion([nuevaPosicion.lat, nuevaPosicion.lng]);
          onCoordenadasSeleccionadas(nuevaPosicion.lat, nuevaPosicion.lng);

          // === MAGIA DE REVERSE GEOCODING ===
          setBuscando(true);
          try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${nuevaPosicion.lat}&lon=${nuevaPosicion.lng}`;
            const respuesta = await fetch(url);
            const datos = await respuesta.json();

            if (datos && datos.address) {
              // Extraemos los datos que Nominatim nos devuelve
              const direccionTraducida = {
                calle: datos.address.road || datos.address.pedestrian || '',
                numero: datos.address.house_number || '',
               colonia: datos.address.neighbourhood || datos.address.suburb || datos.address.residential || '',
                cp: datos.address.postcode || '',
                cp: datos.address.postcode || '',
                ciudad: datos.address.city || datos.address.town || datos.address.county || '',
                estado_rep: datos.address.state || ''
              };
              
              // Se los mandamos al formulario
              if (onDireccionEncontrada) {
                onDireccionEncontrada(direccionTraducida);
              }
            }
          } catch (error) {
            console.error("Error al traducir las coordenadas:", error);
          } finally {
            setBuscando(false);
          }
        }
      },
    }),
    [onCoordenadasSeleccionadas, onDireccionEncontrada]
  );

  return (
    <div className="w-full relative">
      <label className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
        Ubica tu local en el mapa 
        {buscando && <span className="text-autoblue animate-pulse">(Traduciendo dirección...)</span>}
      </label>
      <div className="w-full h-80 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm relative z-0">
        <MapContainer center={posicion} zoom={15} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker draggable={true} eventHandlers={eventHandlers} position={posicion} ref={markerRef}>
            <Popup>
              <span className="font-bold text-autoblue">¡Múeveme!</span><br />
              Se autocompletará tu dirección.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}