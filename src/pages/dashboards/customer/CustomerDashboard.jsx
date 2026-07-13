import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Car, ShoppingBag, LogOut, Settings, Wrench } from 'lucide-react';
import CustomerGarage from './views/CustomerGarage';
import CustomerOrders from './views/CustomerOrders';
import MiPerfil from './views/MiPerfil';

export default function CustomerDashboard() {
  const [vistaActiva, setVistaActiva] = useState('garaje');
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionData = localStorage.getItem('user_data');
    if (!sessionData || sessionData === "undefined") {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(sessionData);
    setUsuario(userData);
    setCargando(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user_data');
    localStorage.removeItem('session_token');
    navigate('/login');
  };

  const nombreMostrado = usuario?.user_metadata?.nombre || usuario?.user_metadata?.full_name || "Cliente Automotriz";

  if (cargando) return <div className="flex h-screen items-center justify-center font-medium text-gray-500">Cargando tu perfil...</div>;

  return (
    // 1. Cambiamos a flex-col en móvil y flex-row en escritorio (md)
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
      
      {/* SIDEBAR DEL CLIENTE (Convertido a Topbar en móvil) */}
      <aside className="w-full md:w-64 bg-white border-b md:border-r border-gray-200 flex flex-col flex-shrink-0 z-10">
        <div className="p-4 md:p-6">
          
          {/* Fila superior en móvil: Logo + Usuario */}
          <div className="flex justify-between items-center md:block mb-4 md:mb-8">
            <Link to="/inicio" className="flex items-center gap-2">
              <span className="font-extrabold text-xl md:text-2xl tracking-tight text-autoblue">
                Auto<span className="text-gray-900">Red</span>
              </span>
            </Link>
            
            <div className="md:mt-8 p-2 md:p-4 bg-blue-50 rounded-xl border border-blue-100 max-w-[160px] md:max-w-full">
              <p className="hidden md:block text-xs text-autoblue font-bold uppercase mb-1">Mi Cuenta</p>
              <p className="font-black text-gray-900 truncate text-sm md:text-base">{nombreMostrado}</p>
            </div>
          </div>

          {/* 2. Menú de navegación: Scroll horizontal en móvil, vertical en escritorio */}
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button
              onClick={() => setVistaActiva('garaje')}
              className={`flex-shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl text-sm font-bold transition-all ${
                vistaActiva === 'garaje' ? 'bg-autoblue text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Car size={18} /> Mi Garaje
            </button>
            
            <button
              onClick={() => setVistaActiva('pedidos')}
              className={`flex-shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl text-sm font-bold transition-all ${
                vistaActiva === 'pedidos' ? 'bg-autoblue text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ShoppingBag size={18} /> Mis Pedidos
            </button>
            
            <button
              onClick={() => setVistaActiva('perfil')}
              className={`flex-shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl text-sm font-bold transition-all ${
                vistaActiva === 'perfil' ? 'bg-autoblue text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Settings size={18} /> Mi Perfil
            </button>
            
            <Link
              to="/catalogo"
              className="flex-shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl text-sm font-bold text-autoblue hover:bg-blue-50 transition-all md:mt-4 border border-blue-100"
            >
              <Wrench size={18} /> Ir al Catálogo
            </Link>

            {/* Botón de cerrar sesión incrustado en el menú deslizante para móviles */}
            <button
              onClick={handleLogout}
              className="md:hidden flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={18} /> Salir
            </button>
          </nav>
        </div>

        {/* Botón de cerrar sesión fijo al fondo (solo en escritorio) */}
        <div className="hidden md:block p-6 border-t border-gray-100 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 overflow-y-auto bg-gray-50 relative p-4 md:p-8">
        {vistaActiva === 'garaje' && <CustomerGarage usuario={usuario} />}
        {vistaActiva === 'pedidos' && <CustomerOrders usuario={usuario} />}
        {vistaActiva === 'perfil' && <MiPerfil />}
      </main>
    </div>
  );
}