import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProducts } from '../data/mockData';

export default function ProductDetail() {
  const { id } = useParams();
  const [showStores, setShowStores] = useState(false); // Estado para mostrar las sucursales
  
  const product = mockProducts.find(p => p.id === parseInt(id)) || mockProducts.find(p => p.id === parseInt(id) - 10);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Producto no encontrado</h2>
        <Link to="/catalogo" className="bg-autoblue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-900 transition-colors">Volver al Catálogo</Link>
      </div>
    );
  }

  // Datos simulados de refaccionarias para la previsualización
  const mockStores = [
    { id: 1, name: "Autopartes Express", distance: "1.2 km", stock: "En Stock (5)", price: product.price, rating: 4.9 },
    { id: 2, name: "Mecánica Total Sur", distance: "3.5 km", stock: "Últimas 2 piezas", price: product.price + 50, rating: 4.7 },
    { id: 3, name: "Refaccionaria El Pistón", distance: "5.0 km", stock: "Bajo Pedido (24h)", price: product.price - 80, rating: 4.5 },
  ];

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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Imagen */}
            <div className="h-96 md:h-auto overflow-hidden bg-gray-100 flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Información del Producto */}
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
              </div>

              {/* Botón de Acción Dinámico */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button 
                  onClick={() => setShowStores(!showStores)}
                  className="flex-1 bg-autoblue hover:bg-blue-900 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {showStores ? 'Ocultar Disponibilidad' : 'Ver Dónde Comprar'}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Sección Oculta: Lista de Refaccionarias */}
        {showStores && (
          <div className="mt-12 animate-fade-in">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-autored" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              Disponible en 3 sucursales cercanas
            </h2>
            
            <div className="space-y-4">
              {mockStores.map(store => (
                <div key={store.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 hover:border-autoblue transition-colors">
                  
                  {/* Info de la Tienda */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1 font-medium text-gray-700">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        {store.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        A {store.distance} de ti
                      </span>
                    </div>
                  </div>

                  {/* Precio y Stock */}
                  <div className="text-center sm:text-right">
                    <p className="text-2xl font-black text-autored">${store.price}</p>
                    <p className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded inline-block mt-1">{store.stock}</p>
                  </div>

                  {/* Botones de Acción final */}
                  <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                    <button className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-sm flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                      Contactar
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}