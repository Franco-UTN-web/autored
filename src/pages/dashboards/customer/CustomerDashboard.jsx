import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Car, ShoppingBag, LogOut, Settings, Wrench } from 'lucide-react';
import CustomerGarage from './views/CustomerGarage';
import CustomerOrders from './views/CustomerOrders';

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
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* SIDEBAR DEL CLIENTE */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div className="p-6">
          <Link to="/inicio" className="flex items-center gap-2 mb-8">
            <span className="font-extrabold text-2xl tracking-tight text-autoblue">Auto<span className="text-gray-900">Red</span></span>
          </Link>
          
          <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-autoblue font-bold uppercase mb-1">Mi Cuenta</p>
            <p className="font-black text-gray-900 truncate">{nombreMostrado}</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setVistaActiva('garaje')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                vistaActiva === 'garaje' ? 'bg-autoblue text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Car size={18} /> Mi Garaje
            </button>
            <button
              onClick={() => setVistaActiva('pedidos')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                vistaActiva === 'pedidos' ? 'bg-autoblue text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ShoppingBag size={18} /> Mis Pedidos
            </button>
            <Link
              to="/catalogo"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-autoblue hover:bg-blue-50 transition-all mt-4 border border-blue-100"
            >
              <Wrench size={18} /> Ir al Catálogo
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 overflow-y-auto bg-gray-50 relative">
        {/* Aquí renderizamos las vistas separadas */}
       {vistaActiva === 'garaje' && <CustomerGarage usuario={usuario} />}
        {vistaActiva === 'pedidos' && <CustomerOrders usuario={usuario} />}
      </main>
    </div>
  );
}