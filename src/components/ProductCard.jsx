import { Link, useNavigate } from 'react-router-dom';

export default function ProductCard({ item, miTiendaId, enComparacion, onToggleCompare }) {
  const navigate = useNavigate();
  const pieza = item.pieza;
  
  if (!pieza) return null;

  const esMiPieza = miTiendaId && item.establecimiento_id === miTiendaId;
  
  // NUEVA REGLA: Verificamos si el producto se quedó sin existencias
  const sinStock = item.stock <= 0; 

  const numeroTelefono = "525512345678"; 
  const numParteTexto = pieza.numero_parte ? ` (PN: ${pieza.numero_parte})` : '';
  const mensajeWa = `Hola, vengo de AutoRed. Me interesa la pieza: *${pieza.nombre_comercial}*${numParteTexto} Marca: ${pieza.marca}. ¿Aún tienen stock a $${item.precio_oferta}?`;
  const linkWhatsApp = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensajeWa)}`;

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col relative group 
      ${enComparacion ? 'border-autoblue ring-2 ring-autoblue shadow-md' : 'border-gray-200 hover:shadow-lg'} 
      ${sinStock ? 'opacity-80' : ''}`} // Si no hay stock, bajamos un poco la opacidad general
    >
      
      {/* Botón Flotante de Comparar (Se bloquea si no hay stock) */}
      <button 
        onClick={sinStock ? null : onToggleCompare}
        disabled={sinStock}
        className={`absolute top-3 right-3 z-20 p-2 rounded-full border transition-colors shadow-sm flex items-center justify-center
          ${sinStock ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' : 
            enComparacion ? 'bg-autoblue text-white border-autoblue' : 'bg-white text-gray-400 border-gray-200 hover:text-autoblue hover:border-autoblue'}`}
        title={sinStock ? "No se puede comparar un producto agotado" : "Añadir a comparar"}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
      </button>

      {esMiPieza && (
        <div className="absolute top-3 left-3 bg-autoblue text-white text-[10px] font-black uppercase px-2 py-1 rounded-md z-10 shadow-sm">
          Tu Publicación
        </div>
      )}

      {/* NUEVO: Etiqueta Gigante de AGOTADO sobre la imagen */}
      {sinStock && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-red-600 text-white font-black px-6 py-1.5 rounded-lg uppercase tracking-widest text-sm shadow-lg -rotate-12 border-2 border-white pointer-events-none">
          Agotado
        </div>
      )}

      {/* Imagen (Se pone en escala de grises si no hay stock) */}
      <div className={`h-48 bg-gray-50 relative border-b border-gray-100 flex items-center justify-center p-4 transition-all duration-300 ${sinStock ? 'grayscale opacity-60' : ''}`}>
        {pieza.imagen_url ? (
          <img src={pieza.imagen_url} alt={pieza.nombre_comercial} className={`w-full h-full object-contain mix-blend-multiply ${!sinStock && 'group-hover:scale-105'} transition-transform duration-300`} />
        ) : (
          <div className="text-gray-300 font-black text-6xl opacity-50 select-none">
            {pieza.nombre_comercial?.charAt(0)}
          </div>
        )}
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 pr-8">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{pieza.marca}</p>
          {pieza.condicion && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sinStock ? 'bg-gray-50 text-gray-400 border-gray-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
              {pieza.condicion}
            </span>
          )}
        </div>
        
        <h3 className={`font-black text-lg leading-tight mb-1 line-clamp-2 ${sinStock ? 'text-gray-400' : 'text-gray-900'}`}>
          {pieza.nombre_comercial}
        </h3>
        
        <p className={`text-sm mb-3 flex items-center gap-1 ${sinStock ? 'text-gray-400' : 'text-gray-500'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          {pieza.marca_vehiculo} {pieza.modelo} ({pieza.anio_vehiculo})
        </p>

        {pieza.numero_parte && (
          <div className="mb-4">
            <span className={`text-[11px] font-mono px-2 py-1 rounded border ${sinStock ? 'bg-gray-50 text-gray-400 border-gray-200' : 'bg-blue-50 text-autoblue border-blue-100'}`}>
              PN: {pieza.numero_parte}
            </span>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase font-black text-gray-400">Precio Promo</p>
            <p className={`text-2xl font-black ${sinStock ? 'text-gray-400 line-through decoration-red-500 decoration-2' : 'text-gray-900'}`}>
              ${item.precio_oferta}
            </p>
          </div>
        </div>

        {/* BOTONES INTELIGENTES */}
        <div className="mt-4 flex gap-2">
          {/* El botón de ver detalle siempre funciona por si quieren leer la ficha técnica */}
          <Link to={`/producto/${item.id}`} className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl text-sm border border-gray-200 transition-colors">
            Detalle
          </Link>

          {esMiPieza ? (
            <button onClick={() => navigate('/store')} className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-1">
              Editar
            </button>
          ) : sinStock ? (
            // NUEVO: Botón inactivo si no hay stock
            <button disabled className="flex-1 bg-gray-100 text-gray-400 font-bold py-2.5 rounded-xl text-sm border border-gray-200 cursor-not-allowed flex items-center justify-center gap-1 shadow-none">
              Sin Existencia
            </button>
          ) : (
            // Botón normal de WhatsApp
            <a href={linkWhatsApp} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-1 shadow-sm">
              Contactar
            </a>
          )}
        </div>
      </div>
    </div>
  );
}