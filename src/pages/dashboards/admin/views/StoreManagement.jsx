import React from 'react';

export default function StoreManagement({
  solicitudes, tiendasActivas, tiendasSuspendidas, metricas, cargando,
  confirmarAccion, ejecutarAccion, modalConfirm, setModalConfirm,
  procesandoId, tipoAccion, verDirectorio, setVerDirectorio
}) {
  
  // Unimos activas y suspendidas para mostrarlas en el directorio
  const directorioCompleto = [...tiendasActivas, ...tiendasSuspendidas];

  return (
    <div className="py-10 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Panel de Control Global</h1>
            <p className="text-gray-500 font-medium mt-1">Auditoría y supervisión de AutoRed</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            onClick={() => setVerDirectorio(true)}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center cursor-pointer hover:border-green-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-wider group-hover:text-green-600 transition-colors">Refaccionarias Operando</p>
                <p className="text-4xl font-black text-gray-900">{cargando ? '-' : metricas.tiendasAprobadas}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl text-green-600 shadow-sm group-hover:bg-green-600 group-hover:text-white transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
            </div>
            <p className="text-xs font-bold text-green-600 mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Ver directorio completo <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </p>
          </div>
          
          <div className="bg-autoblue p-6 rounded-xl border border-blue-900 text-white shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-full pointer-events-none"></div>
            <div className="relative z-10">
              <p className="text-blue-200 text-sm font-bold mb-1 uppercase tracking-wider">Solicitudes en Revisión</p>
              <p className="text-4xl font-black">{cargando ? '-' : metricas.tiendasPendientes}</p>
            </div>
            <div className="p-4 bg-blue-800 rounded-xl text-blue-100 shadow-sm relative z-10">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE AUDITORÍA */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
             Solicitudes de Registro Pendientes
          </h3>
          
          <div className="space-y-6 relative">
            {cargando ? (
              <p className="text-sm text-gray-400 text-center py-4">Buscando solicitudes...</p>
            ) : solicitudes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No hay solicitudes pendientes.</p>
            ) : (
              solicitudes.map(sol => (
                <div key={sol.id} className={`border border-gray-200 rounded-2xl p-6 transition-all duration-500 flex flex-col lg:flex-row justify-between gap-6 ${procesandoId === sol.id ? (tipoAccion === 'aprobar' ? 'bg-green-50 opacity-0 translate-x-full scale-95' : 'bg-red-50 opacity-0 -translate-x-full scale-95') : 'bg-gray-50 hover:bg-white hover:shadow-md opacity-100'}`}>
                  {/* Bloque Izquierdo */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h4 className="font-black text-gray-900 text-xl">{sol.nombre}</h4>
                      <span className="bg-blue-50 text-autoblue border border-blue-100 text-[10px] font-black uppercase px-2 py-0.5 rounded w-max">RFC: {sol.rfc}</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">📞 {sol.telefono || 'No registrado'} | 📍 {sol.calle && sol.numero ? `${sol.calle} #${sol.numero}, ${sol.estadoRep}` : 'Dirección no disponible'}</p>
                  </div>

                  {/* Bloque Central Documentos */}
                  <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-3 bg-white p-4 rounded-xl border border-gray-200 lg:w-64">
                    <a href={sol.doc_csf_url} target="_blank" rel="noopener noreferrer" className={`text-xs font-bold py-2 px-3 rounded-lg border text-center ${sol.doc_csf_url ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-400 pointer-events-none'}`}>
                      {sol.doc_csf_url ? 'Ver Constancia SAT' : 'Sin Constancia'}
                    </a>
                    <a href={sol.doc_ine_url} target="_blank" rel="noopener noreferrer" className={`text-xs font-bold py-2 px-3 rounded-lg border text-center ${sol.doc_ine_url ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-400 pointer-events-none'}`}>
                      {sol.doc_ine_url ? 'Ver INE Oficial' : 'Sin Identificación'}
                    </a>
                  </div>

                  {/* Bloque Derecho Acciones */}
                  <div className="flex lg:flex-col items-center justify-center gap-2 lg:pl-4 lg:border-l border-gray-200">
                    <button onClick={() => confirmarAccion(sol.id, sol.nombre, 'aprobar')} disabled={procesandoId === sol.id} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors disabled:opacity-50">
                      Aprobar
                    </button>
                    <button onClick={() => confirmarAccion(sol.id, sol.nombre, 'rechazar')} disabled={procesandoId === sol.id} className="w-full border border-gray-200 bg-white hover:bg-red-50 text-red-500 font-bold p-3 rounded-xl transition-colors disabled:opacity-50">
                      Rechazar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MODAL DEL DIRECTORIO DE TIENDAS */}
        {verDirectorio && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl animate-fade-in">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Directorio de Refaccionarias</h3>
                  <p className="text-sm text-gray-500 font-medium">Gestión y auditoría de tiendas registradas</p>
                </div>
                <button onClick={() => setVerDirectorio(false)} className="text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 p-2 rounded-full transition-colors">
                   X 
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 bg-gray-50 space-y-4 rounded-b-2xl">
                {directorioCompleto.length === 0 ? (
                  <div className="text-center py-10"><p className="text-gray-500 font-medium">No hay tiendas en el directorio.</p></div>
                ) : (
                  directorioCompleto.map(tienda => (
                    <div key={tienda.id} className={`p-5 rounded-xl border shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors ${tienda.estado === 'SUSPENDIDO' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 hover:border-autoblue'}`}>
                      <div className="flex-1 w-full">
                        <h4 className={`font-bold text-lg ${tienda.estado === 'SUSPENDIDO' ? 'text-red-900' : 'text-gray-900'}`}>{tienda.nombre}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          {tienda.estado === 'APROBADO' ? (
                            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-black uppercase border border-green-200">Operando</span>
                          ) : (
                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-black uppercase border border-red-300">Suspendida</span>
                          )}
                          <span className="text-xs text-gray-500 font-medium">RFC: {tienda.rfc}</span>
                        </div>
                      </div>
                      
                      {/* BOTONES DE SUSPENSIÓN / REACTIVACIÓN */}
                      <div className="w-full sm:w-auto">
                        {tienda.estado === 'APROBADO' ? (
                          <button 
                            onClick={() => confirmarAccion(tienda.id, tienda.nombre, 'suspender')}
                            className="w-full sm:w-auto bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors"
                          >
                            Suspender Tienda
                          </button>
                        ) : (
                          <button 
                            onClick={() => confirmarAccion(tienda.id, tienda.nombre, 'reactivar')}
                            className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700 font-bold py-2 px-4 rounded-lg text-xs transition-colors shadow-sm"
                          >
                            Reactivar Acceso
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE CONFIRMACIÓN */}
        {modalConfirm.visible && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
              <h3 className="text-xl font-black text-center text-gray-900 mb-2">
                {modalConfirm.accion === 'aprobar' ? '¿Aprobar negocio?' : 
                 modalConfirm.accion === 'rechazar' ? '¿Rechazar solicitud?' :
                 modalConfirm.accion === 'suspender' ? '¿Suspender tienda?' : '¿Reactivar tienda?'}
              </h3>
              <p className="text-center text-gray-500 text-sm mb-8 font-medium">
                Estás a punto de {modalConfirm.accion} a <span className="font-bold text-gray-800">{modalConfirm.nombreTienda}</span>.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setModalConfirm({ visible: false, id: null, accion: '', nombreTienda: '' })} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancelar</button>
                <button onClick={ejecutarAccion} className={`flex-1 px-4 py-3 text-white font-bold rounded-xl ${['aprobar', 'reactivar'].includes(modalConfirm.accion) ? 'bg-green-600' : 'bg-red-600'}`}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}