import { mockProducts } from '../data/mockData';
import ProductCard from '../components/ProductCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            La red automotriz más <span className="text-emerald-500">inteligente</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Encuentra piezas, compara refaccionarias y optimiza el mantenimiento de tu vehículo en una sola plataforma.
          </p>
          
          {/* Buscador Principal */}
          <div className="max-w-3xl mx-auto bg-gray-800 p-2 rounded-xl border border-gray-700 shadow-2xl flex flex-col md:flex-row gap-2">
            <input type="text" placeholder="¿Qué pieza o marca buscas?" className="flex-1 bg-gray-900 border-none text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <select className="bg-gray-900 text-gray-300 rounded-lg px-4 py-3 border-none focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Todas las marcas</option>
              <option>Volkswagen</option>
              <option>Nissan</option>
            </select>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-3">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-white">Piezas Destacadas</h2>
            <a href="/catalogo" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">Ver catálogo completo →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Sidebar Destacados */}
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Top Refaccionarias</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Autopartes Express</span>
                <span className="text-emerald-500">★ 4.9</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Mecánica Total Sur</span>
                <span className="text-emerald-500">★ 4.7</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-900/40 to-gray-900 border border-emerald-800/50 p-6 rounded-xl text-center">
            <h3 className="text-emerald-400 font-bold mb-2">¿Eres Distribuidor?</h3>
            <p className="text-gray-400 text-sm mb-4">Únete a nuestra red y multiplica tus ventas de mostrador.</p>
            <button className="w-full bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500 text-emerald-400 py-2 rounded-lg text-sm transition-colors">
              Registrar Negocio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}