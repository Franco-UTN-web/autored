import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  let usuarioLogueado = null;
  let nombreMostrado = "Cliente Automotriz";
  let userId = null;

  try {
    const datosUsuarioJson = localStorage.getItem('user_data');
    if (datosUsuarioJson && datosUsuarioJson !== "undefined") {
      usuarioLogueado = JSON.parse(datosUsuarioJson);
      userId = usuarioLogueado.id;
      nombreMostrado = usuarioLogueado?.user_metadata?.nombre || usuarioLogueado?.user_metadata?.full_name || "Cliente Automotriz";
    }
  } catch (error) {
    console.warn("No se pudo leer la sesión.");
  }

  const [misPedidos, setMisPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);

  useEffect(() => {
    const fetchDatosCliente = async () => {
      if(!userId) return;
      try {
        // Aquí llamaremos a tu Java para traer los pedidos reales de este cliente
        // const res = await fetch(`http://localhost:8080/api/pedidos/usuario/${userId}`);
        
        // Simulación temporal para que no se vea vacío mientras construyes el backend
        setTimeout(() => {
          setMisPedidos([
            { id: 'COT-8923', producto: 'Amortiguadores Traseros Gas KYB', estado: 'Aprobada', tienda: 'Mecánica Total Sur', precio: 2100 },
            { id: 'REQ-042', producto: 'Bomba de Agua GMB', estado: 'Pendiente', tienda: 'Autopartes Express', precio: null }
          ]);
          setCargandoPedidos(false);
        }, 1000);

      } catch (error) {
        console.error("Error cargando datos del cliente", error);
        setCargandoPedidos(false);
      }
    };
    fetchDatosCliente();
  }, [userId]);

  return (
    <div className="py-10 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mi Taller Virtual</h1>
            <p className="text-gray-500 font-medium mt-1">
              Bienvenido de vuelta, <span className="text-autoblue font-bold">{nombreMostrado}</span>
            </p>
          </div>
          <Link to="/catalogo" className="bg-autoblue hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            Buscar Nueva Pieza
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            {/* Mis Vehículos (Mantenemos la estructura visual) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-autoblue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                  Mis Vehículos
                </h3>
                <button className="text-autoblue hover:text-blue-900 text-sm font-bold bg-blue-50 px-3 py-1 rounded-lg">Añadir +</button>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Volkswagen Jetta</p>
                  <p className="text-sm text-gray-500 font-medium">2018 • 2.5L</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
              <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                <svg className="w-5 h-5 text-autoblue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                Mis Solicitudes y Cotizaciones
              </h3>
              
              <div className="space-y-4 flex-1">
                {cargandoPedidos ? (
                  <p className="text-sm text-gray-400 text-center py-4">Buscando tus pedidos...</p>
                ) : misPedidos.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Aún no tienes pedidos o cotizaciones.</p>
                ) : (
                  misPedidos.map(pedido => (
                    <div key={pedido.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-autoblue transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-bold text-gray-400 tracking-wider">ID: {pedido.id}</span>
                          <h4 className="font-bold text-gray-900 text-lg group-hover:text-autoblue transition-colors">{pedido.producto}</h4>
                        </div>
                        <span className={`border px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${pedido.estado === 'Aprobada' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={pedido.estado === 'Aprobada' ? "M5 13l4 4L19 7" : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"}></path></svg>
                          {pedido.estado}
                        </span>
                      </div>
                      <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-50">
                        <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                          {pedido.tienda}
                        </p>
                        <div className="text-right">
                          {pedido.precio ? (
                            <>
                              <p className="text-xl font-black text-autored">${pedido.precio}</p>
                              <button className="text-autoblue text-xs font-bold mt-1 hover:underline">Ver ticket de compra</button>
                            </>
                          ) : (
                            <div className="text-gray-400 text-sm font-medium">Por definir...</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}