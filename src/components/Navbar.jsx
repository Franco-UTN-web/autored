import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Info, MapPin, Package, Store, LogOut, LayoutDashboard, User, LogIn, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 1. Leemos la sesión
  let rol = null;
  try {
    const datosUsuarioJson = localStorage.getItem('user_data');
    if (datosUsuarioJson && datosUsuarioJson !== "undefined") {
      const usuarioLogueado = JSON.parse(datosUsuarioJson);
      rol = usuarioLogueado?.user_metadata?.role;
    }
  } catch (error) {
    console.warn("Sesión corrupta detectada en el Navbar.");
  }

  // 2. Lógica Dinámica de Navegación
  const handleAccionPrincipal = () => {
    setIsMenuOpen(false); 
    if (rol === 'tienda') navigate('/dashboard/store');
    else if (rol === 'admin') navigate('/dashboard/admin');
    else if (rol === 'comprador') navigate('/dashboard/customer'); 
    else navigate('/login'); 
  };

  // 3. Textos e Íconos dinámicos para el botón principal
  const obtenerTextoBoton = () => {
    if (rol === 'tienda') return 'Mi Mostrador';
    if (rol === 'admin') return 'Panel de Control';
    if (rol === 'comprador') return 'Mi Cuenta';
    return 'Ingresar';
  };

  const IconoBoton = () => {
    if (rol === 'tienda') return <Store size={18} />;
    if (rol === 'admin') return <LayoutDashboard size={18} />;
    if (rol === 'comprador') return <User size={18} />;
    return <LogIn size={18} />;
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* LOGO */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center transition-transform hover:scale-105">
              <img 
                src="/logo1.png" 
                alt="AutoRed Logo" 
                className="h-20 sm:h-24 w-auto object-contain transform scale-[1.4] sm:scale-[1.6] origin-left drop-shadow-sm" 
              />
            </Link>
          </div>

          {/* MENÚ ESCRITORIO */}
          <div className="hidden lg:flex items-center space-x-2">
            
            <Link to="/inicio" className="flex items-center gap-2 text-gray-600 hover:text-autoblue hover:bg-blue-50 px-4 py-2.5 rounded-xl font-bold text-sm transition-all">
              <Home size={18} /> Inicio
            </Link>

            <Link to="/nosotros" className="flex items-center gap-2 text-gray-600 hover:text-autoblue hover:bg-blue-50 px-4 py-2.5 rounded-xl font-bold text-sm transition-all">
              <Info size={18} /> Nosotros
            </Link>
            
            <Link to="/directorio" className="flex items-center gap-2 text-gray-600 hover:text-autoblue hover:bg-blue-50 px-4 py-2.5 rounded-xl font-bold text-sm transition-all">
              <MapPin size={18} /> Sucursales
            </Link>
            
            <Link to="/catalogo" className="flex items-center gap-2 text-gray-600 hover:text-autoblue hover:bg-blue-50 px-4 py-2.5 rounded-xl font-bold text-sm transition-all">
              <Package size={18} /> Catálogo
            </Link>

            {/* DIVISOR VERTICAL */}
            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {/* BOTÓN PRINCIPAL DINÁMICO */}
            <button 
              onClick={handleAccionPrincipal}
              className="flex items-center gap-2 bg-gradient-to-r from-autoblue to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <IconoBoton /> {obtenerTextoBoton()}
            </button>

            {/* BOTÓN CERRAR SESIÓN */}
            {rol && (
               <button 
                 onClick={() => {
                   localStorage.clear();
                   window.location.href = '/login';
                 }}
                 title="Cerrar Sesión"
                 className="flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-all ml-1"
               >
                 <LogOut size={20} />
               </button>
            )}
          </div>

          {/* BOTÓN HAMBURGUESA (MÓVIL) */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-autoblue hover:bg-blue-50 focus:outline-none p-2.5 rounded-xl transition-colors"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl absolute w-full left-0 animate-fade-in">
          <div className="px-4 pt-4 pb-6 space-y-2 flex flex-col max-h-[80vh] overflow-y-auto">
            
            <Link to="/inicio" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-gray-700 hover:text-autoblue hover:bg-blue-50 px-4 py-3.5 rounded-xl font-bold transition-colors">
              <Home size={20} className="text-gray-400" /> Inicio
            </Link>

            <Link to="/nosotros" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-gray-700 hover:text-autoblue hover:bg-blue-50 px-4 py-3.5 rounded-xl font-bold transition-colors">
              <Info size={20} className="text-gray-400" /> Nosotros
            </Link>
            
            <Link to="/directorio" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-gray-700 hover:text-autoblue hover:bg-blue-50 px-4 py-3.5 rounded-xl font-bold transition-colors">
              <MapPin size={20} className="text-gray-400" /> Sucursales
            </Link>

            <Link to="/catalogo" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-gray-700 hover:text-autoblue hover:bg-blue-50 px-4 py-3.5 rounded-xl font-bold transition-colors">
              <Package size={20} className="text-gray-400" /> Catálogo
            </Link>

            {(rol !== 'tienda' && rol !== 'admin') && (
              <Link to="/registro-negocio" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-gray-700 hover:text-autoblue hover:bg-blue-50 px-4 py-3.5 rounded-xl font-bold transition-colors">
                <Store size={20} className="text-gray-400" /> Suma tu Negocio
              </Link>
            )}
            
            <div className="border-t border-gray-100 my-2 pt-2"></div>

            <button 
              onClick={handleAccionPrincipal}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-autoblue to-blue-800 text-white hover:opacity-90 px-4 py-3.5 rounded-xl font-bold shadow-md transition-opacity"
            >
              <IconoBoton /> {obtenerTextoBoton()}
            </button>

            {rol && (
               <button 
                 onClick={() => {
                   localStorage.clear();
                   window.location.href = '/login';
                 }}
                 className="flex items-center justify-center gap-2 w-full text-red-600 bg-red-50 hover:bg-red-100 px-4 py-3.5 rounded-xl font-bold transition-colors mt-2"
               >
                 <LogOut size={20} /> Cerrar Sesión
               </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}