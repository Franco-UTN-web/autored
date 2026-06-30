import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, Store } from 'lucide-react';
import StoreOverview from './views/StoreOverview';
import StoreInventory from './views/StoreInventory';

export default function StoreDashboard() {
  const [vistaActiva, setVistaActiva] = useState('inventario');
  const [miEstablecimiento, setMiEstablecimiento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const inicializarTienda = async () => {
      const sessionData = localStorage.getItem('user_data');
      if (!sessionData || sessionData === "undefined") {
        navigate('/login');
        return;
      }
      
      const usuario = JSON.parse(sessionData);
      if (usuario.user_metadata?.role !== 'tienda') {
        navigate('/inicio');
        return;
      }

      try {
        // Buscamos la tienda real del usuario
        const res = await fetch('http://localhost:8080/api/establecimientos/todos');
        if (res.ok) {
          const tiendas = await res.json();
          const miTienda = tiendas.find(t => t.propietario_id === usuario.id);
          setMiEstablecimiento(miTienda);
        }
      } catch (error) {
        console.error("Error al cargar datos de la tienda:", error);
      } finally {
        setCargando(false);
      }
    };

    inicializarTienda();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user_data');
    localStorage.removeItem('session_token');
    navigate('/login');
  };

  if (cargando) return <div className="flex h-screen items-center justify-center font-medium text-gray-500">Conectando con tu sucursal...</div>;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* SIDEBAR IDÉNTICO AL ADMIN */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-4">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2 py-3 border-b border-gray-100">
            <span className="font-extrabold text-xl tracking-tight text-red-600">Auto<span className="text-gray-900">Red</span></span>
            <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 px-1.5 py-0.5 rounded font-bold">SOCIOS</span>
          </div>

          <div className="px-2 mb-4">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Mi Sucursal</p>
            <p className="font-black text-gray-900 truncate text-sm">{miEstablecimiento?.nombre || 'Tienda sin nombre'}</p>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setVistaActiva('resumen')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                vistaActiva === 'resumen' ? 'bg-red-50/60 text-red-700' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard size={18} /> Resumen
            </button>
            <button
              onClick={() => setVistaActiva('inventario')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                vistaActiva === 'inventario' ? 'bg-red-50/60 text-red-700' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Package size={18} /> Mi Inventario
            </button>
          </nav>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 overflow-y-auto">
        {vistaActiva === 'resumen' && <StoreOverview miEstablecimiento={miEstablecimiento} />}
        {vistaActiva === 'inventario' && <StoreInventory miEstablecimiento={miEstablecimiento} />}
      </main>
    </div>
  );
}