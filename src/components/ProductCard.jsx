import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-autoblue hover:bg-gray-50 group flex flex-col">
      
      <div className="overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110" />
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{product.name}</h3>
          <span className="bg-blue-50 text-autoblue text-xs px-2 py-1 rounded border border-blue-100 font-semibold">
            {product.brand}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">Compatibilidad: {product.compatibility}</p>
        
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Duración:</span>
            <span className="text-gray-800 font-medium">{product.duration}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Sucursal:</span>
            <span className="text-gray-800 font-medium truncate ml-2">{product.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <span className="text-2xl font-black text-autored">${product.price}</span>
          {/* Cambiamos el <button> por un <Link> */}
          <Link 
            to={`/producto/${product.id}`}
            className="bg-gray-100 group-hover:bg-autoblue text-gray-700 group-hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
}