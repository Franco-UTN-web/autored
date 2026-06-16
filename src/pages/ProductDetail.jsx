import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showStores, setShowStores] = useState(false);
  
  const [productoPrincipal, setProductoPrincipal] = useState(null);
  const [sucursalesDisponibles, setSucursalesDisponibles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/inventario/todos');
        if (!response.ok) throw new Error('Error al conectar con la base de datos');
        
        const data = await response.json();
        
        // 1. Encontrar el inventario exacto que el usuario clickeó
        const itemEncontrado = data.find(item => item.id === id);
        
        if (!itemEncontrado) {
          throw new Error('La pieza que buscas no existe o fue eliminada.');
        }
        
        setProductoPrincipal(itemEncontrado);

        // 2. MAGIA: Buscar qué otras sucursales venden esta misma pieza exacta (por el ID de la pieza)
        const tiendasConEstaPieza = data.filter(item => item.pieza.id === itemEncontrado.pieza.id);
        setSucursalesDisponibles(tiendasConEstaPieza);

      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    fetchProducto();
  }, [id]);

  const contactarWhatsApp = (stock, precio, nombrePieza, marca) => {
    const numeroTienda = "525555555555"; // En el futuro se leerá del establecimiento
    const mensaje = `Hola, me interesa la pieza: *${nombrePieza}* (Marca: ${marca}). ¿Aún tienen stock de ${stock} piezas a $${precio}?`;
    window.open(`https://wa.me/${numeroTienda}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  if (cargando) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-autoblue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !productoPrincipal) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Producto no encontrado</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link to="/catalogo" className="bg-autoblue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-900 transition-colors">Volver al Catálogo</Link>
      </div>
    );
  }

  const { pieza, precio_oferta, stock } = productoPrincipal;

  return (
    <div className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navegación Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-autoblue font-bold">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to="/catalogo" className="hover:text-autoblue font-bold">Catálogo</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-bold truncate">{pieza.nombre_comercial}</span>
        </div>

        {/* Tarjeta Principal de Detalles */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Imagen */}
            <div className="h-96 md:h-auto overflow-hidden bg-white flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100">
              {pieza.imagen_url ? (
                <img 
                  src={pieza.imagen_url} 
                  alt={pieza.nombre_comercial} 
                  className="w-full max-h-96 object-contain transform transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <span className="text-gray-300 font-medium">Sin imagen disponible</span>
              )}
            </div>

            {/* Información del Producto */}
            <div className="p-8 lg:p-12 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-50 text-autoblue px-3 py-1 rounded-full border border-blue-100 font-bold text-xs tracking-wider uppercase">
                  {pieza.marca}
                </span>
                <span className={`px-3 py-1 rounded-full border font-bold text-xs flex items-center gap-1.5 ${stock > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  <span className={`w-2 h-2 rounded-full ${stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {stock > 0 ? 'En Stock' : 'Agotado'}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">
                {pieza.nombre_comercial}
              </h1>
              
              <div className="mb-8">
                <span className="text-4xl font-black text-autored">${precio_oferta?.toFixed(2)} <span className="text-lg text-gray-500 font-medium">MXN</span></span>
              </div>

              {/* Ficha Técnica */}
              <div className="space-y-4 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100 flex-1">
                <h3 className="font-black text-gray-900 mb-4 border-b border-gray-200 pb-2 uppercase tracking-wider text-sm">Ficha Técnica</h3>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="col-span-1 text-gray-500 font-bold">Compatibilidad:</span>
                  <span className="col-span-2 text-gray-900 font-medium">{pieza.marca_vehiculo} {pieza.modelo}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="col-span-1 text-gray-500 font-bold">Año:</span>
                  <span className="col-span-2 text-gray-900 font-medium">{pieza.anio_vehiculo}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="col-span-1 text-gray-500 font-bold">Categoría:</span>
                  <span className="col-span-2 text-gray-900 font-medium">{pieza.categoria}</span>
                </div>
                {pieza.nivel_calidad && (
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="col-span-1 text-gray-500 font-bold">Calidad:</span>
                    <span className="col-span-2 text-gray-900 font-medium">{pieza.nivel_calidad}</span>
                  </div>
                )}
              </div>

              {/* Botón de Acción Dinámico */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button 
                  onClick={() => setShowStores(!showStores)}
                  className="flex-1 bg-autoblue hover:bg-blue-900 text-white py-4 rounded-xl font-black text-lg transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {showStores ? 'Ocultar Disponibilidad' : `Ver en ${sucursalesDisponibles.length} Sucursales`}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Sección Oculta: Lista de Refaccionarias Reales */}
        {showStores && (
          <div className="mt-12 animate-fade-in">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-autored" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              Disponible en {sucursalesDisponibles.length} {sucursalesDisponibles.length === 1 ? 'sucursal' : 'sucursales'}
            </h2>
            
            <div className="space-y-4">
              {sucursalesDisponibles.map(sucursal => (
                <div key={sucursal.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 hover:border-autoblue transition-colors">
                  
                  {/* Info de la Tienda */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-gray-900">Sucursal Registrada</h3>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1 font-medium text-gray-700">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        ID: {sucursal.establecimiento_id.split('-')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Precio y Stock */}
                  <div className="text-center sm:text-right">
                    <p className="text-2xl font-black text-autored">${sucursal.precio_oferta?.toFixed(2)}</p>
                    <p className={`text-xs font-bold px-2 py-1 rounded inline-block mt-1 ${sucursal.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {sucursal.stock === 0 ? 'Agotado' : `${sucursal.stock} piezas`}
                    </p>
                  </div>

                  {/* Botones de Acción final */}
                  <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                    <button 
                      onClick={() => contactarWhatsApp(sucursal.stock, sucursal.precio_oferta, pieza.nombre_comercial, pieza.marca)}
                      disabled={sucursal.stock === 0}
                      className="flex-1 sm:flex-none bg-[#25D366] hover:bg-[#1DA851] disabled:bg-gray-200 disabled:text-gray-400 text-white px-6 py-3 rounded-lg font-black transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.88-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                      Contactar
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}