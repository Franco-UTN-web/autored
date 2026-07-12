import React, { useState, useEffect } from 'react';

export default function InventoryAudit() {
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Filtros y Pestañas
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('activos'); // 'activos' | 'inactivos'
  
  // Modal de Confirmación
  const [modal, setModal] = useState({
    visible: false,
    inventarioId: null,
    piezaId: null,
    nombrePieza: '',
    accion: '' // 'eliminar' | 'suspender' | 'reactivar'
  });

  const cargarInventario = async () => {
    setCargando(true);
    try {
      // Obtenemos TODO el inventario, sin importar el estado
      const res = await fetch('https://backautored-production.up.railway.app/api/inventario/todos');
      if (res.ok) {
        const data = await res.json();
        setInventario(data);
      }
    } catch (error) {
      console.error("Error al cargar auditoría:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  // Lógica para ejecutar las acciones en el Backend
  const ejecutarAccion = async () => {
    const { inventarioId, piezaId, accion } = modal;
    
    try {
      if (accion === 'eliminar') {
        // HARD DELETE: Borrado definitivo de base de datos
        await fetch(`https://backautored-production.up.railway.app/api/inventario/eliminar/${inventarioId}`, {
          method: 'DELETE'
        });
      } else if (accion === 'suspender') {
        // BAJA LÓGICA: Desactiva la pieza (OJO: Ajusta esta URL según tu backend de Piezas)
        await fetch(`https://backautored-production.up.railway.app/api/piezas/${piezaId}/suspender`, {
          method: 'PUT'
        });
      } else if (accion === 'reactivar') {
        // ALTA LÓGICA: Reactiva la pieza
        await fetch(`https://backautored-production.up.railway.app/api/piezas/${piezaId}/reactivar`, {
          method: 'PUT'
        });
      }
      
      // Cerramos modal y recargamos los datos para ver los cambios
      setModal({ visible: false, inventarioId: null, piezaId: null, nombrePieza: '', accion: '' });
      cargarInventario();
      
    } catch (error) {
      console.error("Error ejecutando acción:", error);
      alert("Hubo un problema al ejecutar la acción.");
    }
  };

  // Filtrado doble (por pestaña activa/inactiva y por barra de búsqueda)
  const inventarioFiltrado = inventario.filter(item => {
    // Asumimos que si no tiene el campo 'activo', es true por defecto
    const esActivo = item.pieza?.activo !== false; 
    
    // Filtro de Pestaña
    if (filtroEstado === 'activos' && !esActivo) return false;
    if (filtroEstado === 'inactivos' && esActivo) return false;

    // Filtro de Búsqueda
    const term = busqueda.toLowerCase();
    return (
      item.pieza?.nombre_comercial?.toLowerCase().includes(term) ||
      item.pieza?.numero_parte?.toLowerCase().includes(term) ||
      item.pieza?.marca?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO Y BÚSQUEDA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Auditoría de Inventario</h1>
            <p className="text-gray-500 font-medium mt-1">Moderación global del catálogo de productos de AutoRed.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <input 
                type="text" 
                placeholder="Buscar número, nombre, marca..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-autoblue shadow-sm"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <div className="bg-gray-900 text-white font-bold text-sm px-4 py-2 rounded-lg shrink-0 shadow-sm">
              Mostrando: {inventarioFiltrado.length}
            </div>
          </div>
        </div>

        {/* PESTAÑAS (TABS) */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button 
            onClick={() => setFiltroEstado('activos')}
            className={`pb-3 text-sm font-black transition-colors ${filtroEstado === 'activos' ? 'border-b-2 border-autoblue text-autoblue' : 'text-gray-400 hover:text-gray-700'}`}
          >
            Piezas Activas
          </button>
          <button 
            onClick={() => setFiltroEstado('inactivos')}
            className={`pb-3 text-sm font-black transition-colors ${filtroEstado === 'inactivos' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-400 hover:text-gray-700'}`}
          >
            Piezas Suspendidas
          </button>
        </div>

        {/* TABLA DE AUDITORÍA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-black text-gray-500 uppercase tracking-wider">
                  <th className="p-4">No. Parte / ID</th>
                  <th className="p-4">Nombre Comercial y Detalle</th>
                  <th className="p-4">Vehículo Compatible</th>
                  <th className="p-4 text-center">Moderación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cargando ? (
                  <tr><td colSpan="4" className="text-center py-10 text-gray-400 font-bold">Cargando inventario...</td></tr>
                ) : inventarioFiltrado.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-10 text-gray-400 font-medium">No hay productos en esta categoría.</td></tr>
                ) : (
                  inventarioFiltrado.map(item => (
                    <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${item.pieza?.activo === false ? 'opacity-75 bg-red-50/30' : ''}`}>
                      
                      <td className="p-4 align-top">
                        <span className="bg-gray-100 text-gray-600 font-mono text-xs px-2 py-1 rounded border border-gray-200">
                          {item.pieza?.numero_parte || 'S/N'}
                        </span>
                      </td>
                      
                      <td className="p-4 align-top">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded border border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                            {item.pieza?.imagen_url ? (
                              <img src={item.pieza.imagen_url} alt="pieza" className="object-contain w-full h-full" />
                            ) : (
                              <span className="text-gray-300 font-bold">{item.pieza?.nombre_comercial?.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-sm">{item.pieza?.nombre_comercial}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-xs">{item.pieza?.descripcion || 'Sin descripción adicional.'}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4 align-top">
                        <p className="font-black text-autoblue text-sm">{item.pieza?.marca_vehiculo} {item.pieza?.modelo}</p>
                        <p className="text-xs text-gray-500 mt-1">Año: {item.pieza?.anio_vehiculo} | {item.pieza?.categoria}</p>
                      </td>
                      
                      <td className="p-4 align-top">
                        <div className="flex flex-col items-center gap-2">
                          
                          {/* BOTÓN DE SUSPENDER / REACTIVAR (Baja Lógica) */}
                          {item.pieza?.activo === false ? (
                            <button 
                              onClick={() => setModal({ visible: true, inventarioId: item.id, piezaId: item.pieza.id, nombrePieza: item.pieza.nombre_comercial, accion: 'reactivar' })}
                              className="w-full bg-green-50 text-green-600 border border-green-200 hover:bg-green-600 hover:text-white text-xs font-bold py-1.5 px-3 rounded transition-colors"
                            >
                              Reactivar Pieza
                            </button>
                          ) : (
                            <button 
                              onClick={() => setModal({ visible: true, inventarioId: item.id, piezaId: item.pieza.id, nombrePieza: item.pieza.nombre_comercial, accion: 'suspender' })}
                              className="w-full bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-500 hover:text-white text-xs font-bold py-1.5 px-3 rounded transition-colors"
                            >
                              Suspender Pieza
                            </button>
                          )}

                          {/* BOTÓN DE ELIMINAR (Hard Delete) */}
                          <button 
                            onClick={() => setModal({ visible: true, inventarioId: item.id, piezaId: item.pieza?.id, nombrePieza: item.pieza?.nombre_comercial, accion: 'eliminar' })}
                            className="w-full bg-white text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 text-xs font-bold py-1.5 px-3 rounded flex items-center justify-center gap-1 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            Eliminar
                          </button>

                        </div>
                      </td>
                      
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {modal.visible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-fade-in text-center">
            
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${modal.accion === 'eliminar' ? 'bg-red-100 text-red-600' : modal.accion === 'suspender' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2">
              {modal.accion === 'eliminar' ? '¿Borrar definitivamente?' : modal.accion === 'suspender' ? '¿Suspender pieza?' : '¿Reactivar pieza?'}
            </h3>
            
            <p className="text-gray-500 text-sm mb-6 font-medium">
              Estás a punto de <strong className="uppercase">{modal.accion}</strong> el producto <span className="text-gray-800 font-bold">"{modal.nombrePieza}"</span>.
              {modal.accion === 'eliminar' && " Esta acción no se puede deshacer y borrará la pieza de la base de datos."}
              {modal.accion === 'suspender' && " La pieza desaparecerá del catálogo público hasta que la reactives."}
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setModal({ visible: false, inventarioId: null, piezaId: null, nombrePieza: '', accion: '' })}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={ejecutarAccion}
                className={`flex-1 py-3 text-white font-bold rounded-xl transition-colors shadow-sm text-sm ${modal.accion === 'eliminar' ? 'bg-red-600 hover:bg-red-700' : modal.accion === 'suspender' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'}`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}