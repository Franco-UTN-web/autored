import React, { useState, useEffect } from 'react';

export default function InventoryAudit() {
  const [piezas, setPiezas] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // ESTADOS PARA EL MODAL CUSTOM
  const [modalVisible, setModalVisible] = useState(false);
  const [piezaAEliminar, setPiezaAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/piezas/todas');
      if (response.ok) {
        const data = await response.json();
        setPiezas(data);
      }
    } catch (error) {
      console.error("Error al cargar el catálogo:", error);
    } finally {
      setCargando(false);
    }
  };

  // 1. Abre el modal en lugar de la alerta del navegador
  const confirmarEliminacion = (pieza) => {
    setPiezaAEliminar(pieza);
    setModalVisible(true);
  };

  // 2. Ejecuta la petición al backend cuando le dan "Sí, eliminar"
  const ejecutarEliminacion = async () => {
    if (!piezaAEliminar) return;
    
    setEliminando(true);
    
    try {
      const response = await fetch(`http://localhost:8080/api/piezas/admin/eliminar/${piezaAEliminar.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Quitamos la pieza de la tabla
        setPiezas(prev => prev.filter(p => p.id !== piezaAEliminar.id));
        setModalVisible(false); // Cerramos modal
      } else {
        alert("Hubo un error al intentar eliminar la pieza.");
      }
    } catch (error) {
      console.error("Error al eliminar la pieza:", error);
    } finally {
      setEliminando(false);
      setPiezaAEliminar(null);
    }
  };

  if (cargando) return <div className="p-10 text-center text-gray-500 font-medium">Cargando catálogo global...</div>;

  return (
    <div className="py-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO */}
        <div className="mb-8 border-b border-gray-200 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Auditoría de Inventario</h1>
            <p className="text-gray-500 font-medium mt-1">Moderación global del catálogo de productos de AutoRed.</p>
          </div>
          <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
            Total Publicado: {piezas.length}
          </div>
        </div>

     {/* TABLA DE MODERACIÓN */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <th className="py-4 px-6">No. Parte / ID</th>
                  <th className="py-4 px-6">Nombre Comercial y Detalle</th>
                  <th className="py-4 px-6">Vehículo Compatible</th>
                  <th className="py-4 px-6 text-right">Moderación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {piezas.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-400 font-medium">
                      El catálogo global está vacío o limpio.
                    </td>
                  </tr>
                ) : (
                  piezas.map((pieza) => (
                    <tr key={pieza.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                          {pieza.numero_parte || pieza.id?.toString().substring(0, 8)}
                        </span>
                      </td>
                      <td className="py-4 px-6 flex items-center gap-3">
                        {/* Si tienes imágenes de las piezas, esto las mostrará redonditas */}
                        {pieza.imagen_url ? (
                           <img src={pieza.imagen_url} alt="Pieza" className="w-10 h-10 rounded-md object-cover border border-gray-200" />
                        ) : (
                           <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                           </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 text-base">{pieza.nombre_comercial || 'Sin nombre comercial'}</p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]" title={pieza.descripcion}>
                            {pieza.descripcion || 'Sin descripción'}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-black text-autoblue">
                            {pieza.marca_vehiculo || 'Marca N/A'} {pieza.modelo || ''}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            Año: {pieza.anio_vehiculo || 'N/A'} | {pieza.categoria || 'Sin categoría'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => confirmarEliminacion(pieza)}
                          className="inline-flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white px-3 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL CUSTOM DE ELIMINACIÓN */}
        {modalVisible && piezaAEliminar && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-fade-in">
              
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              
              <h3 className="text-xl font-black text-center text-gray-900 mb-2">
                ¿Eliminar pieza?
              </h3>
              
              <p className="text-center text-gray-500 text-sm mb-8 font-medium">
                Estás a punto de borrar permanentemente la pieza <span className="font-bold text-gray-800">{piezaAEliminar.nombre || piezaAEliminar.id.substring(0,8)}</span> del catálogo global. Esta acción no se puede deshacer.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setModalVisible(false)} 
                  disabled={eliminando}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={ejecutarEliminacion} 
                  disabled={eliminando}
                  className="flex-1 px-4 py-3 text-white bg-red-600 hover:bg-red-700 font-bold rounded-xl disabled:opacity-50 flex justify-center items-center transition-colors"
                >
                  {eliminando ? 'Borrando...' : 'Sí, eliminar'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}