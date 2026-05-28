import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-autoblue flex flex-col sm:flex-row group">
      
      {/* Sección Izquierda: Imagen más ajustada */}
      <div className="w-full sm:w-48 md:w-56 flex-shrink-0 bg-gray-50 flex items-center justify-center p-4 border-b sm:border-b-0 sm:border-r border-gray-100 overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 sm:h-full object-cover rounded-lg transform transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute top-2 left-2 bg-green-100 text-green-700 text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold border border-green-200">
          {product.availability}
        </div>
      </div>
      
      {/* Sección Derecha: min-w-0 es clave para que los textos no desborden */}
      <div className="p-5 flex-1 flex flex-col justify-between min-w-0">
        
        <div>
          <div className="flex justify-between items-start mb-2">
            <span className="bg-blue-50 text-autoblue text-xs px-2 py-1 rounded border border-blue-100 font-bold truncate">
              {product.brand}
            </span>
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-2">
              ID: REF-{product.id}09
            </span>
          </div>
          
          <Link to={`/producto/${product.id}`} className="hover:text-autoblue transition-colors block mb-2">
            {/* truncate añade "..." si el título es muy largo */}
            <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight truncate">{product.name}</h3>
          </Link>
          
          <p className="text-gray-600 text-sm mb-3 truncate">
            <span className="font-semibold text-gray-700">Comp:</span> {product.compatibility}
          </p>
          
          {/* Detalles con flex-wrap por si la pantalla es pequeña */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {product.duration}
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {product.location}
            </span>
          </div>
        </div>

        {/* Footer de la tarjeta con alineación correcta */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-xl md:text-2xl font-black text-autored">${product.price}</span>
            <span className="text-xs text-gray-400 line-through hidden sm:inline-block">${product.price + 350}</span>
          </div>
          
          <Link 
            to={`/producto/${product.id}`}
            className="bg-autoblue hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
          >
            <span>Detalles</span>
            <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}