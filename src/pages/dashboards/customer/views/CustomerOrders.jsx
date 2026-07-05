import React, { useState, useEffect } from 'react';

export default function CustomerOrders({ usuario }) {
  const [misPedidos, setMisPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);

  useEffect(() => {
    if (usuario?.id) {
      // Simulación de carga desde base de datos
      setTimeout(() => {
        setMisPedidos([
          { id: 'COT-8923', producto: 'Amortiguadores Traseros Gas KYB', estado: 'Aprobada', tienda: 'Mecánica Total Sur', precio: 2100 },
          { id: 'REQ-042', producto: 'Bomba de Agua GMB', estado: 'Pendiente', tienda: 'Autopartes Express', precio: null }
        ]);
        setCargandoPedidos(false);
      }, 1000);
    }
  }, [usuario]);

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mis Pedidos</h1>
        <p className="text-gray-500 font-medium mt-1">Historial de cotizaciones e interacciones con refaccionarias.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-5xl">
        <div className="space-y-4">
          {cargandoPedidos ? (
            <p className="text-sm text-gray-400 text-center py-8 font-bold animate-pulse">Buscando tu historial...</p>
          ) : misPedidos.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Aún no tienes pedidos o cotizaciones.</p>
          ) : (
            misPedidos.map(pedido => (
              <div key={pedido.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-autoblue transition-all group bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-bold text-gray-400 tracking-wider">Folio: {pedido.id}</span>
                    <h4 className="font-black text-gray-900 text-lg group-hover:text-autoblue transition-colors">{pedido.producto}</h4>
                  </div>
                  <span className={`border px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 uppercase ${pedido.estado === 'Aprobada' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${pedido.estado === 'Aprobada' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                    {pedido.estado}
                  </span>
                </div>
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 font-bold flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    {pedido.tienda}
                  </p>
                  <div className="text-right">
                    {pedido.precio ? (
                      <>
                        <p className="text-2xl font-black text-gray-900">${pedido.precio}</p>
                        <button className="text-autoblue text-xs font-bold mt-1 hover:underline">Ver detalles</button>
                      </>
                    ) : (
                      <div className="text-gray-400 text-sm font-bold bg-white px-3 py-1.5 rounded-lg border border-gray-200">Esperando precio...</div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}