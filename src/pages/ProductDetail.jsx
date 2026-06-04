import { useParams, Link } from 'react-router-dom';
import { mockProducts } from '../data/mockData';

export default function ProductDetail() {
  // Obtenemos el ID de la URL
  const { id } = useParams();
  
  // Buscamos el producto en nuestros datos simulados
  // (La segunda condición es un pequeño truco para que también funcionen los productos duplicados visuales de tu catálogo)
  const product = mockProducts.find(p => p.id === parseInt(id)) || mockProducts.find(p => p.id === parseInt(id) - 10);

  // Si el usuario entra a una URL de un producto que no existe
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Producto no encontrado</h2>
        <Link to="/catalogo" className="bg-autoblue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-900 transition-colors">Volver al Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navegación Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-autoblue">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to="/catalogo" className="hover:text-autoblue">Catálogo</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        {/* Tarjeta Principal de Detalles */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Columna Izquierda: Imagen en Grande */}
            <div className="h-96 md:h-auto overflow-hidden bg-gray-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Columna Derecha: Información del Producto */}
            <div className="p-8 lg:p-12 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-50 text-autoblue px-3 py-1 rounded-full border border-blue-100 font-bold text-sm">
                  {product.brand}
                </span>
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200 font-bold text-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {product.availability}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="mb-8">
                <span className="text-4xl font-black text-autored">${product.price} <span className="text-lg text-gray-500 font-medium">MXN</span></span>
              </div>

              {/* Ficha Técnica */}
              <div className="space-y-4 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100 flex-1">
                <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Ficha Técnica</h3>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="col-span-1 text-gray-500 font-medium">Compatibilidad:</span>
                  <span className="col-span-2 text-gray-900 font-semibold">{product.compatibility}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="col-span-1 text-gray-500 font-medium">Duración est.:</span>
                  <span className="col-span-2 text-gray-900 font-semibold">{product.duration}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="col-span-1 text-gray-500 font-medium">Sucursal Actual:</span>
                  <span className="col-span-2 text-gray-900 font-semibold">{product.location}</span>
                </div>
              </div>

              {/* Botones de Acción Simulados */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button className="flex-1 bg-autoblue hover:bg-blue-900 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-xl flex justify-center items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  Redirigir a la Tienda
                </button>
                <button className="sm:w-auto px-6 bg-white border-2 border-gray-200 hover:border-autored text-gray-700 hover:text-autored py-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}