import { mockProducts } from '../data/mockData';
import ProductCard from '../components/ProductCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <div className="relative bg-white border-b border-gray-200 py-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 text-gray-900">
            La red automotriz más <span className="text-autored">inteligente</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Encuentra piezas, compara refaccionarias y optimiza el mantenimiento de tu vehículo en una sola plataforma.
          </p>
          
          {/* Buscador Principal */}
          <div className="max-w-3xl mx-auto bg-white p-2 rounded-xl border border-gray-200 shadow-lg flex flex-col md:flex-row gap-2">
            <input type="text" placeholder="¿Qué pieza o marca buscas?" className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-autoblue" />
            <select className="bg-gray-50 text-gray-700 rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-autoblue">
              <option>Todas las marcas</option>
              <option>Volkswagen</option>
              <option>Nissan</option>
            </select>
            <button className="bg-autoblue hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-md">
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-3">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-black text-gray-900">Piezas Destacadas</h2>
            <a href="/catalogo" className="text-autoblue hover:text-blue-800 text-sm font-bold">Ver catálogo completo →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Sidebar Destacados */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Top Refaccionarias</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center text-sm">
                <span className="text-gray-700 font-medium">Autopartes Express</span>
                <span className="text-autoblue font-bold">★ 4.9</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-gray-700 font-medium">Mecánica Total Sur</span>
                <span className="text-autoblue font-bold">★ 4.7</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-center shadow-sm">
            <h3 className="text-autoblue font-black mb-2 text-lg">¿Eres Distribuidor?</h3>
            <p className="text-gray-600 text-sm mb-4">Únete a nuestra red y multiplica tus ventas de mostrador.</p>
            <button className="w-full bg-white hover:bg-autoblue border-2 border-autoblue text-autoblue hover:text-white py-2 rounded-lg text-sm font-bold transition-all">
              Registrar Negocio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}