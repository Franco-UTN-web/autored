import React, { useState, useEffect } from 'react';
import ProductForm from '../components/ProductForm';

export default function StoreInventory({ miEstablecimiento }) {
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [itemAEditar, setItemAEditar] = useState(null);
  
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'exito' });
  const [modalEliminar, setModalEliminar] = useState({ visible: false, idProducto: null });

  useEffect(() => {
    if (miEstablecimiento) cargarMiInventario();
  }, [miEstablecimiento]);

  const cargarMiInventario = async () => {
    setCargando(true);
    try {
      const response = await fetch(`http://localhost:8080/api/inventario/tienda/${miEstablecimiento.id}`);
      if (response.ok) {
        const data = await response.json();
        setInventario(data.filter(item => item.pieza && item.pieza.activo !== false));
      }
    } catch (error) {
      console.error("Error al cargar inventario local:", error);
    } finally {
      setCargando(false);
    }
  };

  const mostrarNotificacion = (mensaje, tipo = 'exito') => {
    setNotificacion({ visible: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ visible: false, mensaje: '', tipo: 'exito' }), 3500);
  };

  const confirmarEliminacion = (id) => {
    setModalEliminar({ visible: true, idProducto: id });
  };

  const ejecutarEliminacion = async () => {
    const id = modalEliminar.idProducto;
    setModalEliminar({ visible: false, idProducto: null });
    try {
      const response = await fetch(`http://localhost:8080/api/inventario/eliminar/${id}`, { method: 'DELETE' });
      if (response.ok) {
        mostrarNotificacion("Producto eliminado del inventario.");
        cargarMiInventario();
      } else {
        mostrarNotificacion("Error al intentar eliminar el producto.", "error");
      }
    } catch (error) {
      mostrarNotificacion("Error de conexión: " + error.message, "error");
    }
  };

  const abrirEdicion = (item) => {
    setItemAEditar(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-8 animate-fade-in relative">
      
      {/* NOTIFICACIÓN FLOTANTE */}
      <div className={`fixed top-24 left-1/2 z-[100] transform -translate-x-1/2 transition-all duration-500 ${notificacion.visible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white font-bold ${notificacion.tipo === 'exito' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notificacion.mensaje}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <div>
            <h3 className="font-bold text-2xl text-gray-900">Gestión de Stock Real</h3>
            <p className="text-gray-500 font-medium mt-1">Administra tus refacciones publicadas</p>
          </div>
          <button 
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) setItemAEditar(null);
            }} 
            className={`border-2 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors ${showForm ? 'border-gray-300 text-gray-500' : 'border-autoblue text-autoblue hover:bg-blue-50'}`}
          >
            {showForm ? 'Cancelar' : '+ Agregar Nueva Pieza'}
          </button>
        </div>

        {/* EL FORMULARIO INTEGRADO (Solo se muestra si showForm es true) */}
        {showForm && (
          <ProductForm 
            miEstablecimiento={miEstablecimiento}
            itemAEditar={itemAEditar}
            mostrarNotificacion={mostrarNotificacion}
            onClose={() => { setShowForm(false); setItemAEditar(null); }}
            onSuccess={() => { setShowForm(false); setItemAEditar(null); cargarMiInventario(); }}
          />
        )}

        {/* TUS TARJETAS ORIGINALES (CARDS) */}
        {cargando ? (
          <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Cargando tu inventario...</div>
        ) : inventario.length === 0 ? (
          <div className="p-8 text-center text-gray-500 border-2 border-dashed rounded-xl">Tu mostrador está vacío. Agrega tu primer producto.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventario.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:border-autoblue transition-colors group bg-gray-100 shadow-sm">
                <div className="flex gap-4">
                  {item.pieza?.imagen_url ? (
                    <img src={item.pieza.imagen_url} alt={item.pieza.nombre_comercial} className="w-16 h-16 object-cover rounded-lg border border-gray-100 bg-gray-50" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center text-gray-400 font-black text-xl border border-gray-200">
                      {item.pieza?.nombre_comercial?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-autoblue transition-colors">{item.pieza?.nombre_comercial}</p>
                    <p className="text-gray-500 text-xs mt-1 font-medium">{item.pieza?.marca} • {item.pieza?.modelo}</p>
                    
                    {item.pieza?.numero_parte && (
                      <p className="text-[10px] text-autoblue font-mono bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded mt-1 w-max">
                        PN: {item.pieza.numero_parte}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-2">
                      <p className={`font-bold text-xs px-2 py-0.5 rounded inline-block ${item.stock === 0 ? 'bg-red-100 text-red-600' : item.stock <= 5 ? 'bg-orange-100 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                        Stock: {item.stock}
                      </p>
                      {item.pieza?.condicion && (
                        <span className="text-[10px] font-bold text-gray-600 bg-white border border-gray-200 px-1.5 py-0.5 rounded">
                          {item.pieza.condicion}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase font-black text-gray-500">Precio Oferta</p>
                    <p className="font-black text-red-600 text-lg">${item.precio_oferta}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => abrirEdicion(item)} className="text-blue-600 bg-white border border-gray-200 hover:bg-blue-50 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1">
                      Editar
                    </button>
                    <button onClick={() => confirmarEliminacion(item.id)} className="text-red-600 bg-white border border-gray-200 hover:bg-red-50 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE ELIMINACIÓN */}
      {modalEliminar.visible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all">
            <h3 className="text-xl font-black text-center text-gray-900 mb-2">¿Eliminar refacción?</h3>
            <p className="text-center text-gray-500 text-sm mb-8 font-medium">Esta acción es permanente y la quitará de tu mostrador.</p>
            <div className="flex gap-3">
              <button onClick={() => setModalEliminar({ visible: false, idProducto: null })} className="flex-1 px-4 py-3 bg-gray-100 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancelar</button>
              <button onClick={ejecutarEliminacion} className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}