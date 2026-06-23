import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 1. Leemos la sesión directamente de la "magia" guardada en localStorage
  let rol = null;
  try {
    const datosUsuarioJson = localStorage.getItem('user_data');
    if (datosUsuarioJson && datosUsuarioJson !== "undefined") {
      const usuarioLogueado = JSON.parse(datosUsuarioJson);
      // Aquí está leyendo el rol modificado por Login.jsx
      rol = usuarioLogueado?.user_metadata?.role;
    }
  } catch (error) {
    console.warn("Sesión corrupta detectada en el Navbar.");
  }

  // 2. Lógica Dinámica de Navegación
  const handleAccionPrincipal = () => {
    setIsMenuOpen(false); 
    
    if (rol === 'tienda') {
      navigate('/store-dashboard');
    } else if (rol === 'admin') {
      navigate('/dashboard/admin');
    } else if (rol === 'comprador') {
      navigate('/dashboard/cliente'); 
    } else {
      navigate('/login'); 
    }
  };

  // 3. Lógica Dinámica de Texto del Botón
  const obtenerTextoBoton = () => {
    if (rol === 'tienda') return 'Ir a Mi Mostrador';
    if (rol === 'admin') return 'Panel de Control';
    if (rol === 'comprador') return 'Mi Cuenta';
    return 'Ingresar al Portal';
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          
         <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo1.png" 
                alt="AutoRed Logo" 
                className="h-24 w-auto object-contain transform scale-[1.6] origin-left drop-shadow-sm" 
              />
            </Link>
          </div>

          {/* MENÚ ESCRITORIO */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/inicio" className="text-gray-700 hover:text-autored transition-colors px-3 py-2 rounded-md font-medium">
                Inicio
              </Link>

              <Link to="/nosotros" className="text-gray-700 hover:text-autored transition-colors px-3 py-2 rounded-md font-medium">
                Nosotros
              </Link>
              
              <Link to="/directorio" className="text-gray-700 hover:text-autored transition-colors px-3 py-2 rounded-md font-medium">
                Sucursales
              </Link>
              
              <Link to="/catalogo" className="text-gray-700 hover:text-autored transition-colors px-3 py-2 rounded-md font-medium">
                Catálogo
              </Link>
              
              {/* Oculto para tiendas y administradores */}
              {(rol !== 'tienda' && rol !== 'admin') && (
                <Link to="/registro-negocio" className="text-gray-700 hover:text-autored transition-colors px-3 py-2 rounded-md font-medium">
                  Suma tu Negocio
                </Link>
              )}

              <button 
                onClick={handleAccionPrincipal}
                className="bg-autoblue hover:bg-blue-800 text-white px-6 py-2.5 rounded-md font-medium transition-colors shadow-md ml-2"
              >
                {obtenerTextoBoton()}
              </button>

              {rol && (
                 <button 
                   onClick={() => {
                     localStorage.clear();
                     window.location.href = '/login';
                   }}
                   className="text-gray-400 hover:text-red-500 font-bold text-sm ml-4 transition-colors"
                 >
                   Cerrar Sesión
                 </button>
              )}
            </div>
          </div>

          {/* BOTÓN MÓVIL */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-autoblue focus:outline-none p-2"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <Link to="/inicio" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-autored hover:bg-gray-50 block px-3 py-3 rounded-md text-base font-medium border-b border-gray-50">
              Inicio
            </Link>

            <Link to="/nosotros" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-autored hover:bg-gray-50 block px-3 py-3 rounded-md text-base font-medium border-b border-gray-50">
              Nosotros
            </Link>
            
            <Link to="/directorio" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-autored hover:bg-gray-50 block px-3 py-3 rounded-md text-base font-medium border-b border-gray-50">
              Sucursales
            </Link>

            <Link to="/catalogo" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-autored hover:bg-gray-50 block px-3 py-3 rounded-md text-base font-medium border-b border-gray-50">
              Catálogo
            </Link>

            {(rol !== 'tienda' && rol !== 'admin') && (
              <Link to="/registro-negocio" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-autored hover:bg-gray-50 block px-3 py-3 rounded-md text-base font-medium border-b border-gray-50">
                Suma tu Negocio
              </Link>
            )}
            
            <button 
              onClick={handleAccionPrincipal}
              className="w-full text-left bg-autoblue text-white hover:bg-blue-800 block px-3 py-3 rounded-md text-base font-medium text-center mt-4 shadow-sm"
            >
              {obtenerTextoBoton()}
            </button>

            {rol && (
               <button 
                 onClick={() => {
                   localStorage.clear();
                   window.location.href = '/login';
                 }}
                 className="w-full text-center text-red-500 hover:bg-red-50 block px-3 py-3 rounded-md text-base font-bold mt-2 border border-red-100"
               >
                 Cerrar Sesión
               </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}