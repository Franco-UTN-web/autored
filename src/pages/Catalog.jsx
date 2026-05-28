import { mockProducts } from '../data/mockData';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filtros */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Filtros</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 font-medium block mb-2">Marca de Vehículo</label>
                  <select className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm focus:border-autoblue focus:ring-1 focus:ring-autoblue focus:outline-none">
                    <option>Cualquiera</option>
                    <option>Volkswagen</option>
                    <option>Nissan</option>
                    <option>Chevrolet</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 font-medium block mb-2">Tipo de Pieza</label>
                  <select className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm focus:border-autoblue focus:ring-1 focus:ring-autoblue focus:outline-none">
                    <option>Frenos</option>
                    <option>Motor</option>
                    <option>Suspensión</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 font-medium block mb-2">Rango de Precio</label>
                  <input type="range" className="w-full accent-autoblue" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1 font-medium">
                    <span>$0</span>
                    <span>$5000+</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold border border-gray-200 mt-6 py-2 rounded-lg text-sm transition-colors">
                Limpiar Filtros
              </button>
            </div>
          </div>

          {/* Área Principal Catálogo */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-600 text-sm">Mostrando <span className="text-autoblue font-bold">24</span> resultados</p>
              <select className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-1.5 text-sm focus:outline-none font-medium">
                <option>Ordenar por: Relevancia</option>
                <option>Menor a mayor precio</option>
                <option>Mayor a menor precio</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-6">
  {mockProducts.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
  {/* Duplicados visuales */}
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