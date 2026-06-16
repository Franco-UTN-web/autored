import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [kpis, setKpis] = useState({ usuarios: 0, refaccionarias: 0, volumen: 0 });
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Simulamos la carga de datos desde tu Spring Boot
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Aquí pediremos los KPIs reales a Java
        // const resKpis = await fetch('http://localhost:8080/api/admin/kpis');
        setKpis({ usuarios: 124, refaccionarias: 15, volumen: 45000 });

        // Aquí pediremos SOLO las tiendas que están en estado "PENDIENTE"
        // const resSolicitudes = await fetch('http://localhost:8080/api/establecimientos/pendientes');
        // Por ahora lo simulamos:
        setSolicitudes([
          { id: '1', nombre: 'AutoPartes El Güero', rfc: 'AUGE891023XXX' },
          { id: '2', nombre: 'Mecánica Total Sur', rfc: 'METS920512YYY' }
        ]);
      } catch (error) {
        console.error("Error cargando panel de admin", error);
      } finally {
        setCargando(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleAprobar = async (id) => {
    // Aquí llamaremos a tu Java: fetch(`http://localhost:8080/api/establecimientos/aprobar/${id}`, { method: 'PUT' })
    console.log(`Aprobando tienda con ID: ${id}`);
    // Quitamos la solicitud de la pantalla visualmente
    setSolicitudes(solicitudes.filter(sol => sol.id !== id));
    alert("Negocio aprobado exitosamente");
  };

  const handleRechazar = async (id) => {
    // Aquí llamaremos a tu Java: fetch(`http://localhost:8080/api/establecimientos/rechazar/${id}`, { method: 'PUT' })
    console.log(`Rechazando tienda con ID: ${id}`);
    setSolicitudes(solicitudes.filter(sol => sol.id !== id));
  };

  return (
    <div className="py-10 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Panel de Control Global</h1>
            <p className="text-gray-500 font-medium mt-1">Supervisión administrativa de AutoRed</p>
          </div>
        </div>

        {/* KPIs GENERALES */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-wider">Usuarios Totales</p>
                <p className="text-3xl font-black text-gray-900">{kpis.usuarios}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-autoblue shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-wider">Refaccionarias</p>
                <p className="text-3xl font-black text-gray-900">{kpis.refaccionarias}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl text-gray-700 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
            </div>
          </div>

          <div className="bg-autoblue p-6 rounded-xl border border-blue-900 shadow-md md:col-span-2 text-white relative overflow-hidden transition-transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-full"></div>
            <p className="text-blue-200 text-sm font-bold mb-1 uppercase tracking-wider relative z-10">Volumen de Transacciones (Mes)</p>
            <p className="text-4xl font-black relative z-10">${kpis.volumen.toLocaleString()} <span className="text-xl font-medium text-blue-200">MXN</span></p>
          </div>
        </div>

        {/* GESTIÓN RÁPIDA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Aprobación de Negocios */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-autored" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Aprobación de Nuevos Negocios
            </h3>
            
            <div className="space-y-3 flex-1">
              {cargando ? (
                 <p className="text-sm text-gray-400 text-center py-4">Cargando solicitudes...</p>
              ) : solicitudes.length === 0 ? (
                 <p className="text-sm text-gray-400 text-center py-4">No hay negocios pendientes de aprobación.</p>
              ) : (
                solicitudes.map(sol => (
                  <div key={sol.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-white transition-colors hover:shadow-sm">
                    <div>
                      <p className="font-bold text-gray-900">{sol.nombre}</p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">RFC: {sol.rfc}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleRechazar(sol.id)} className="text-red-500 bg-white border border-gray-200 hover:bg-red-50 p-2 rounded-lg transition-colors shadow-sm" title="Rechazar">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                      <button onClick={() => handleAprobar(sol.id)} className="text-green-600 bg-white border border-gray-200 hover:bg-green-50 p-2 rounded-lg transition-colors shadow-sm" title="Aprobar">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}