import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function StoreProfile() {
  const { id } = useParams(); // Atrapamos el ID de la tienda desde la URL
  const navigate = useNavigate();
  
  const [inventarioTienda, setInventarioTienda] = useState([]);
  const [nombreTienda, setNombreTienda] = useState('Cargando tienda...'); // Nuevo estado para el nombre
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDatosTienda = async () => {
      try {
        // Hacemos DOS peticiones al mismo tiempo: Inventario y Establecimientos
        const [resInventario, resEstablecimientos] = await Promise.all([
          fetch('http://localhost:8080/api/inventario/todos'),
          fetch('http://localhost:8080/api/establecimientos/todos')
        ]);

        if (!resInventario.ok) throw new Error('Error al conectar con la base de datos');
        
        // 1. Procesamos el inventario
        const dataInventario = await resInventario.json();
        const productosFiltrados = dataInventario.filter(item => item.establecimiento_id === id);
        setInventarioTienda(productosFiltrados);

        // 2. Buscamos el nombre oficial de la tienda
        if (resEstablecimientos.ok) {
          const dataEstablecimientos = await resEstablecimientos.json();
          const tiendaEncontrada = dataEstablecimientos.find(tienda => tienda.id === id);
          
          if (tiendaEncontrada && tiendaEncontrada.nombre) {
            setNombreTienda(tiendaEncontrada.nombre);
          } else {
            // Si por algo no tiene nombre, usamos un genérico
            setNombreTienda(`Sucursal ${id.split('-')[0].toUpperCase()}`);
          }
        }
        
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    fetchDatosTienda();
  }, [id]);

  // Usamos la primera letra del nombre real para el logo redondo
  const inicialLogo = nombreTienda !== 'Cargando tienda...' ? nombreTienda.charAt(0).toUpperCase() : '';

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      
      {/* --- BANNER DE LA TIENDA --- */}
      <div className="bg-autoblue pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar / Logo de la Tienda */}
          <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center text-autoblue font-black text-4xl border-4 border-white uppercase">
            {inicialLogo}
          </div>
          <div className="text-center md:text-left text-white">
            {/* Aquí ya mostramos el nombre real en grande */}
            <h1 className="text-3xl md:text-4xl font-black mb-2">{nombreTienda}</h1>
            <p className="text-blue-100 font-medium flex items-center justify-center md:justify-start gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              Vendedor Verificado AutoRed
            </p>
          </div>
        </div>
      </div>

      {/* --- INVENTARIO DE LA TIENDA --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 flex justify-between items-center">
          <h2 className="text-lg font-black text-gray-900">Catálogo del Vendedor</h2>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-bold">
            {inventarioTienda.length} piezas publicadas
          </span>
        </div>

        {cargando ? (
          <div className="flex justify-center py-20">
            <span className="w-10 h-10 border-4 border-autoblue border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center font-bold border border-red-100">
            {error}
          </div>
        ) : inventarioTienda.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <h3 className="text-xl font-black text-gray-900 mb-2">Esta tienda aún no tiene inventario</h3>
            <p className="text-gray-500">Regresa más tarde para ver sus refacciones publicadas.</p>
            <button onClick={() => navigate('/catalogo')} className="mt-6 text-autoblue font-bold hover:underline">Volver al catálogo general</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {inventarioTienda.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}