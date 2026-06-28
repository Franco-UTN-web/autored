import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [solicitudes, setSolicitudes] = useState([]);
  
  // NUEVO: Guardaremos la lista completa de las tiendas aprobadas
  const [tiendasActivas, setTiendasActivas] = useState([]); 
  
  const [metricas, setMetricas] = useState({ tiendasAprobadas: 0, tiendasPendientes: 0 });
  const [cargando, setCargando] = useState(true);
  
  const [procesandoId, setProcesandoId] = useState(null);
  const [tipoAccion, setTipoAccion] = useState(null);

  const [modalConfirm, setModalConfirm] = useState({ 
    visible: false, id: null, accion: '', nombreTienda: '' 
  });
  
  // NUEVO: Estado para controlar si vemos el listado de tiendas activas
  const [verDirectorio, setVerDirectorio] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/establecimientos/todos');
        if (response.ok) {
          const data = await response.json();
          
          const pendientes = data.filter(tienda => tienda.estado === 'PENDIENTE');
          const aprobadas = data.filter(tienda => tienda.estado === 'APROBADO');
          
          setSolicitudes(pendientes);
          setTiendasActivas(aprobadas); // Guardamos las aprobadas
          
          setMetricas({
            tiendasAprobadas: aprobadas.length,
            tiendasPendientes: pendientes.length
          });
        }
      } catch (error) {
        console.error("Error conectando con Spring Boot:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchAdminData();
  }, []);

  const confirmarAccion = (id, nombre, accion) => {
    setModalConfirm({ visible: true, id, accion, nombreTienda: nombre });
  };

  const ejecutarAccion = async () => {
    const { id, accion } = modalConfirm;
    setModalConfirm({ visible: false, id: null, accion: '', nombreTienda: '' });
    
    setProcesandoId(id);
    setTipoAccion(accion);

    try {
      const response = await fetch(`http://localhost:8080/api/establecimientos/${accion}/${id}`, { method: 'PUT' });
      if (response.ok) {
        setTimeout(() => {
          // Buscamos la tienda en la lista de pendientes antes de borrarla
          const tiendaProcesada = solicitudes.find(s => s.id === id);
          
          setSolicitudes(prev => prev.filter(sol => sol.id !== id));
          
          if (accion === 'aprobar') {
            // Si la aprobamos, la agregamos a nuestra lista de tiendas activas en tiempo real
            if (tiendaProcesada) {
              setTiendasActivas(prev => [...prev, { ...tiendaProcesada, estado: 'APROBADO' }]);
            }
            setMetricas(prev => ({ tiendasAprobadas: prev.tiendasAprobadas + 1, tiendasPendientes: prev.tiendasPendientes - 1 }));
          } else {
            setMetricas(prev => ({ ...prev, tiendasPendientes: prev.tiendasPendientes - 1 }));
          }
          
          setProcesandoId(null);
          setTipoAccion(null);
        }, 500);
      } else {
        setProcesandoId(null);
        alert(`Hubo un error en el servidor al ${accion} el negocio.`);
      }
    } catch (error) {
      setProcesandoId(null);
      console.error("Error en la petición:", error);
    }
  };

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

        {/* KPIs REALES Y DINÁMICOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* TARJETA CLICKABLE DE REFACCIONARIAS OPERANDO */}
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
              Ver listado completo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
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
            <svg className="w-5 h-5 text-autored" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Solicitudes de Registro Pendientes
          </h3>
          
          <div className="space-y-6 relative">
            {cargando ? (
              <p className="text-sm text-gray-400 text-center py-4">Buscando solicitudes...</p>
            ) : solicitudes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No hay solicitudes pendientes.</p>
            ) : (
              solicitudes.map(sol => (
                <div key={sol.id} className={`border border-gray-200 rounded-2xl p-6 transition-all duration-500 ease-in-out flex flex-col lg:flex-row justify-between gap-6 ${procesandoId === sol.id ? (tipoAccion === 'aprobar' ? 'bg-green-50 opacity-0 translate-x-full scale-95 border-green-300' : 'bg-red-50 opacity-0 -translate-x-full scale-95 border-red-300') : 'bg-gray-50 hover:bg-white hover:shadow-md opacity-100 translate-x-0 scale-100'}`}>
                  {/* Bloque Izquierdo */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h4 className="font-black text-gray-900 text-xl">{sol.nombre}</h4>
                      <span className="bg-blue-50 text-autoblue border border-blue-100 text-[10px] font-black uppercase px-2 py-0.5 rounded sm:self-center w-max">RFC: {sol.rfc}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 font-medium">
                      <p className="flex items-center gap-2"><svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg> {sol.telefono || 'No registrado'}</p>
                      <p className="flex items-center gap-2 sm:col-span-2"><svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> {sol.calle && sol.numero ? `${sol.calle} #${sol.numero}, Col. ${sol.colonia}, C.P. ${sol.codigoPostal}, ${sol.ciudad}, ${sol.estadoRep}` : 'Dirección no disponible'}</p>
                    </div>
                  </div>

                  {/* Bloque Central */}
                  <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-3 bg-white p-4 rounded-xl border border-gray-200 lg:w-64 transition-colors">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1 block w-full sm:col-span-2 lg:col-span-1">Documentos Oficiales:</p>
                    <a href={sol.doc_csf_url} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 text-xs font-bold py-2 px-3 rounded-lg border text-center transition-colors ${sol.doc_csf_url ? 'bg-blue-50 border-blue-200 text-autoblue hover:bg-blue-100' : 'bg-gray-100 text-gray-400 border-gray-200 pointer-events-none'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      {sol.doc_csf_url ? 'Ver Constancia SAT' : 'Sin Constancia'}
                    </a>
                    <a href={sol.doc_ine_url} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 text-xs font-bold py-2 px-3 rounded-lg border text-center transition-colors ${sol.doc_ine_url ? 'bg-blue-50 border-blue-200 text-autoblue hover:bg-blue-100' : 'bg-gray-100 text-gray-400 border-gray-200 pointer-events-none'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      {sol.doc_ine_url ? 'Ver INE Oficial' : 'Sin Identificación'}
                    </a>
                  </div>

                  {/* Bloque Derecho */}
                  <div className="flex lg:flex-col items-center justify-center gap-2 lg:pl-4 lg:border-l border-gray-200">
                    <button onClick={() => confirmarAccion(sol.id, sol.nombre, 'aprobar')} disabled={procesandoId === sol.id} className="flex-1 lg:w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Aprobar
                    </button>
                    <button onClick={() => confirmarAccion(sol.id, sol.nombre, 'rechazar')} disabled={procesandoId === sol.id} className="border border-gray-200 bg-white hover:bg-red-50 text-red-500 font-bold p-3 rounded-xl transition-colors shadow-sm disabled:opacity-50">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MODAL DEL DIRECTORIO DE TIENDAS ACTIVAS */}
        {verDirectorio && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-fade-in">
              
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Directorio de Refaccionarias Activas</h3>
                  <p className="text-sm text-gray-500 font-medium">Listado de negocios aprobados en la plataforma</p>
                </div>
                <button onClick={() => setVerDirectorio(false)} className="text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 p-2 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 bg-gray-50 space-y-4 rounded-b-2xl">
                {tiendasActivas.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500 font-medium">No hay tiendas operando actualmente.</p>
                  </div>
                ) : (
                  tiendasActivas.map(tienda => (
                    <div key={tienda.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between gap-4 hover:border-autoblue transition-colors">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{tienda.nombre}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-black uppercase border border-green-200">Operando</span>
                          <span className="text-xs text-gray-500 font-medium">RFC: {tienda.rfc}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                          {tienda.calle && tienda.numero ? `${tienda.calle} #${tienda.numero}, ${tienda.ciudad}, ${tienda.estadoRep}` : 'Dirección no registrada'}
                        </p>
                      </div>
                      <div className="sm:text-right flex flex-col justify-center">
                        <p className="text-sm font-bold text-gray-700 flex items-center sm:justify-end gap-2">
                          <svg className="w-4 h-4 text-autoblue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                          {tienda.telefono || 'Sin teléfono'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        )}

        {/* MODAL DE CONFIRMACIÓN DE ACCIONES */}
        {modalConfirm.visible && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all animate-fade-in">
              <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-6 ${modalConfirm.accion === 'aprobar' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {modalConfirm.accion === 'aprobar' ? (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                )}
              </div>
              <h3 className="text-xl font-black text-center text-gray-900 mb-2">{modalConfirm.accion === 'aprobar' ? '¿Aprobar negocio?' : '¿Rechazar solicitud?'}</h3>
              <p className="text-center text-gray-500 text-sm mb-8 font-medium">
                {modalConfirm.accion === 'aprobar' ? `Estás a punto de validar la documentación y darle acceso de vendedor a ` : `Estás a punto de rechazar permanentemente la solicitud de `}
                <span className="font-bold text-gray-800">{modalConfirm.nombreTienda}</span>.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setModalConfirm({ visible: false, id: null, accion: '', nombreTienda: '' })} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancelar</button>
                <button onClick={ejecutarAccion} className={`flex-1 px-4 py-3 text-white font-bold rounded-xl transition-colors ${modalConfirm.accion === 'aprobar' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>{modalConfirm.accion === 'aprobar' ? 'Sí, aprobar' : 'Sí, rechazar'}</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}