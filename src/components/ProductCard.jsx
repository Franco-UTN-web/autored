import { Link } from 'react-router-dom';

export default function ProductCard({ item }) {
  const { pieza, precio_oferta, stock } = item;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-autoblue flex flex-col group">
      
      {/* Sección Superior: Imagen */}
      <div className="w-full h-48 bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100 overflow-hidden relative">
        {pieza?.imagen_url ? (
          <img 
            src={pieza.imagen_url} 
            alt={pieza.nombre_comercial} 
            className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <span className="text-gray-400 text-sm font-medium">Sin imagen</span>
        )}
        
        {/* Etiqueta de Stock Dinámica */}
        <div className={`absolute top-3 left-3 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded font-black shadow-sm ${stock > 0 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
          {stock > 0 ? 'En Stock' : 'Agotado'}
        </div>
      </div>
      
      {/* Sección Inferior: Detalles */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        
        <div>
          <div className="flex justify-between items-start mb-2">
            <span className="bg-blue-50 text-autoblue text-[10px] px-2 py-1 rounded border border-blue-100 font-black truncate uppercase tracking-widest">
              {pieza?.marca}
            </span>
            <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap ml-2">
              ID: {item.id.split('-')[0].toUpperCase()}
            </span>
          </div>
          
          <Link to={`/producto/${item.id}`} className="hover:text-autoblue transition-colors block mb-1">
            {/* line-clamp-2 recorta el texto a 2 líneas si el título es muy largo */}
            <h3 className="text-lg font-black text-gray-900 leading-tight line-clamp-2">{pieza?.nombre_comercial || 'Pieza'}</h3>
          </Link>
          
          <p className="text-gray-500 text-xs mb-4 line-clamp-1 font-medium">
            <span className="font-bold text-gray-700">Para:</span> {pieza?.marca_vehiculo} {pieza?.modelo} ({pieza?.anio_vehiculo})
          </p>
          
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 font-bold mb-4 uppercase tracking-wider">
            {pieza?.categoria && (
              <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100">
                {pieza.categoria}
              </span>
            )}
            {pieza?.nivel_calidad && (
              <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100">
                {pieza.nivel_calidad}
              </span>
            )}
          </div>
        </div>

        {/* Footer de la tarjeta con precio y botón */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <span className="text-2xl font-black text-autored leading-none">${precio_oferta?.toFixed(2)}</span>
          
          <Link 
            to={`/producto/${item.id}`}
            className="bg-autoblue hover:bg-blue-900 text-white px-4 py-2.5 rounded-lg text-sm font-black transition-colors shadow-sm flex items-center gap-2"
          >
            <span>Ver</span>
            <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}