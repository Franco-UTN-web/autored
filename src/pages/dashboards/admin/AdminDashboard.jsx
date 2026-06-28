import React, { useState, useEffect } from 'react';
import StoreManagement from './views/StoreManagement';
import { LayoutDashboard, Store, LogOut } from 'lucide-react';
import AnalyticsView from './views/AnalyticsView';

export default function AdminDashboard() {
  const [vistaActiva, setVistaActiva] = useState('tiendas');
  
  // Listas de tiendas según su estado
  const [solicitudes, setSolicitudes] = useState([]);
  const [tiendasActivas, setTiendasActivas] = useState([]); 
  const [tiendasSuspendidas, setTiendasSuspendidas] = useState([]);
  
  const [metricas, setMetricas] = useState({ tiendasAprobadas: 0, tiendasPendientes: 0 });
  const [cargando, setCargando] = useState(true);
  
  const [procesandoId, setProcesandoId] = useState(null);
  const [tipoAccion, setTipoAccion] = useState(null);
  const [modalConfirm, setModalConfirm] = useState({ visible: false, id: null, accion: '', nombreTienda: '' });
  const [verDirectorio, setVerDirectorio] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/establecimientos/todos');
        if (response.ok) {
          const data = await response.json();
          
          const pendientes = data.filter(tienda => tienda.estado === 'PENDIENTE');
          const aprobadas = data.filter(tienda => tienda.estado === 'APROBADO');
          const suspendidas = data.filter(tienda => tienda.estado === 'SUSPENDIDO');
          
          setSolicitudes(pendientes);
          setTiendasActivas(aprobadas);
          setTiendasSuspendidas(suspendidas);
          
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
      // Tu lógica dinámica es perfecta aquí
      const response = await fetch(`http://localhost:8080/api/establecimientos/${accion}/${id}`, { method: 'PUT' });
      if (response.ok) {
        const tiendaProcesada = [...solicitudes, ...tiendasActivas, ...tiendasSuspendidas].find(t => t.id === id);
        
        setTimeout(() => {
          if (accion === 'aprobar' || accion === 'reactivar') {
            setSolicitudes(prev => prev.filter(sol => sol.id !== id));
            setTiendasSuspendidas(prev => prev.filter(t => t.id !== id));
            setTiendasActivas(prev => [...prev, { ...tiendaProcesada, estado: 'APROBADO' }]);
            
            if (accion === 'aprobar') {
              setMetricas(prev => ({ tiendasAprobadas: prev.tiendasAprobadas + 1, tiendasPendientes: prev.tiendasPendientes - 1 }));
            } else {
              setMetricas(prev => ({ ...prev, tiendasAprobadas: prev.tiendasAprobadas + 1 }));
            }
          } 
          else if (accion === 'rechazar') {
            setSolicitudes(prev => prev.filter(sol => sol.id !== id));
            setMetricas(prev => ({ ...prev, tiendasPendientes: prev.tiendasPendientes - 1 }));
          } 
          else if (accion === 'suspender') {
            setTiendasActivas(prev => prev.filter(t => t.id !== id));
            setTiendasSuspendidas(prev => [...prev, { ...tiendaProcesada, estado: 'SUSPENDIDO' }]);
            setMetricas(prev => ({ ...prev, tiendasAprobadas: prev.tiendasAprobadas - 1 }));
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

  if (cargando) return <div className="flex h-screen items-center justify-center font-medium text-gray-500">Cargando panel...</div>;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar Profesional */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-4">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2 py-3 border-b border-gray-100">
            <span className="font-extrabold text-xl tracking-tight text-red-600">Auto<span className="text-gray-900">Red</span></span>
            <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 px-1.5 py-0.5 rounded font-bold">ADMIN</span>
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setVistaActiva('tiendas')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                vistaActiva === 'tiendas' ? 'bg-red-50/60 text-red-700' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Store size={18} /> Refaccionarias
            </button>
            <button
              onClick={() => setVistaActiva('analiticas')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                vistaActiva === 'analiticas' ? 'bg-red-50/60 text-red-700' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard size={18} /> Analíticas
            </button>
          </nav>
        </div>
        <button className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 overflow-y-auto">
        {vistaActiva === 'tiendas' && (
          <StoreManagement 
            solicitudes={solicitudes}
            tiendasActivas={tiendasActivas}
            tiendasSuspendidas={tiendasSuspendidas}
            metricas={metricas}
            cargando={cargando}
            confirmarAccion={confirmarAccion}
            ejecutarAccion={ejecutarAccion}
            modalConfirm={modalConfirm}
            setModalConfirm={setModalConfirm}
            procesandoId={procesandoId}
            tipoAccion={tipoAccion}
            verDirectorio={verDirectorio}
            setVerDirectorio={setVerDirectorio}
          />
          
        )}
        {vistaActiva === 'analiticas' && (
          <AnalyticsView />
          )}
      </main>
    </div>
  );
}