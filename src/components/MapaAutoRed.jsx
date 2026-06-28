import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🔧 PARCHE VITE: Arreglo para que el ícono del marcador cargue correctamente
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

export default function MapaAutoRed() {
  // Coordenadas por defecto (Ejemplo: Ciudad de México)
  // [Latitud, Longitud]
  const posicionCentral = [19.4326018, -99.1332049]; 

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
      {/* MapContainer necesita un alto definido, por eso lo envolvemos en un div con h-96 */}
      <MapContainer 
        center={posicionCentral} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
      >
        {/* TileLayer es el "dibujo" del mapa. Usamos OpenStreetMap que es 100% gratis */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Un marcador de ejemplo en el mapa */}
        <Marker position={posicionCentral}>
          <Popup>
            <div className="text-center">
              <strong className="text-autoblue">AutoRed Central</strong><br />
              Estamos ubicados aquí.
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}