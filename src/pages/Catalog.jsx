import { mockProducts } from '../data/mockData';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-6">
            <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
              <h3 className="text-lg font-medium text-white mb-4">Filtros</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Marca de Vehículo</label>
                  <select className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none">
                    <option>Cualquiera</option>
                    <option>Volkswagen</option>
                    <option>Nissan</option>
                    <option>Chevrolet</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Tipo de Pieza</label>
                  <select className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none">
                    <option>Frenos</option>
                    <option>Motor</option>
                    <option>Suspensión</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">Rango de Precio</label>
                  <input type="range" className="w-full accent-emerald-500" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0</span>
                    <span>$5000+</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 mt-6 py-2 rounded-lg text-sm transition-colors">
                Limpiar Filtros
              </button>
            </div>
          </div>

          {/* Main Catalog Area */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6 bg-gray-900 p-4 rounded-xl border border-gray-800">
              <p className="text-gray-400 text-sm">Mostrando <span className="text-white font-medium">24</span> resultados</p>
              <select className="bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
                <option>Ordenar por: Relevancia</option>
                <option>Menor a mayor precio</option>
                <option>Mayor a menor precio</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
              {/* Duplicamos para rellenar visualmente el catálogo */}
              {mockProducts.map(product => (
                <ProductCard key={product.id + 'dup'} product={{...product, id: product.id + 10}} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}