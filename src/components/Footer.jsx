import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto font-sans text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Columna 1: Marca */}
          <div className="space-y-4">
            {/* Si tienes un logo con letras blancas úsalo, sino este funciona bien con brillo adaptado */}
            <img src="/logo.jpeg" alt="AutoRed" className="h-10 object-contain rounded-sm" />
            <p className="text-gray-400 text-xs font-medium leading-relaxed max-w-xs">
              Distribuidora líder de autopartes al por mayor y menor. Conectando sucursales para ofrecer el mejor stock al instante.
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm font-bold">
              <li><Link to="/" className="hover:text-white transition-colors">Nosotros</Link></li>
              <li><Link to="/inicio" className="hover:text-white transition-colors">Inicio Tienda</Link></li>
              <li><Link to="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link to="/directorio" className="hover:text-white transition-colors">Directorio de Sucursales</Link></li>
            </ul>
          </div>

          

          {/* Columna 3: Soporte */}
          <div>
            <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-gray-400 font-medium">
              <li><span className="cursor-pointer hover:text-white transition-colors">Términos del Servicio</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Aviso de Privacidad</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Soporte Técnico</span></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider mb-4">Contacto Directo</h4>
            <p className="text-sm text-gray-200 font-bold mb-1">Oficinas Centrales</p>
            <p className="text-xs text-gray-400 font-medium">contacto@autored.com</p>
            <p className="text-xs text-gray-400 font-medium mt-1">+52 (55) 5555-5555</p>
          </div>

        </div>

        {/* Barra inferior de Copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-bold tracking-tight">
            &copy; {new Date().getFullYear()} AutoRed. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-xs font-black text-gray-500">
            <span className="hover:text-white cursor-pointer">Multi-sucursal v1.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
}