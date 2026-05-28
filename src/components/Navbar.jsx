import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img src="/logo.jpeg" alt="AutoRed Logo" className="h-14 object-contain" />
            </Link>
          </div>

          {/* Menú de Escritorio (Oculto en móviles con "hidden md:block") */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="text-gray-700 hover:text-autored transition-colors px-3 py-2 rounded-md font-medium">Inicio</Link>
              <Link to="/catalogo" className="text-gray-700 hover:text-autored transition-colors px-3 py-2 rounded-md font-medium">Catálogo</Link>
              <Link to="/login" className="bg-autoblue hover:bg-blue-800 text-white px-6 py-2.5 rounded-md font-medium transition-colors shadow-md">
                Ingresar al Portal
              </Link>
            </div>
          </div>

          {/* Botón de Menú Hamburguesa (Visible solo en móviles con "md:hidden") */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-autoblue focus:outline-none p-2"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  // Ícono de "X" cuando está abierto
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  // Ícono de 3 líneas cuando está cerrado
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Panel del Menú Móvil (Se despliega hacia abajo) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)} 
              className="text-gray-700 hover:text-autored hover:bg-gray-50 block px-3 py-3 rounded-md text-base font-medium border-b border-gray-50"
            >
              Inicio
            </Link>
            <Link 
              to="/catalogo" 
              onClick={() => setIsMenuOpen(false)} 
              className="text-gray-700 hover:text-autored hover:bg-gray-50 block px-3 py-3 rounded-md text-base font-medium border-b border-gray-50"
            >
              Catálogo
            </Link>
            <Link 
              to="/login" 
              onClick={() => setIsMenuOpen(false)} 
              className="bg-autoblue text-white hover:bg-blue-800 block px-3 py-3 rounded-md text-base font-medium text-center mt-4 shadow-sm"
            >
              Ingresar al Portal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}