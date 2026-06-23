import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase';

// ==========================================
// DICCIONARIO DE AUTOS (Base de datos local)
// ==========================================
const BASE_DE_DATOS_AUTOS = {
  "Chevrolet": ["Aveo", "Beat", "Chevy", "Onix", "Spark", "Tornado", "Tracker", "Trax"],
  "Ford": ["EcoSport", "Escape", "F-150", "Fiesta", "Figo", "Focus", "Ranger"],
  "Honda": ["Accord", "BR-V", "City", "Civic", "CR-V", "HR-V"],
  "Nissan": ["Altima", "Kicks", "March", "NP300", "Sentra", "Tiida", "Tsuru", "Versa"],
  "Toyota": ["Camry", "Corolla", "Hiace", "Hilux", "Prius", "RAV4", "Yaris"],
  "Volkswagen": ["Bora", "Gol", "Golf", "Jetta", "Polo", "Saveiro", "Tiguan", "Vento"]
};

// Generamos los años desde 2026 hasta 1995
const ANIOS_DISPONIBLES = Array.from({ length: 2026 - 1995 + 1 }, (_, i) => 2026 - i);

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

  const [vehiculos, setVehiculos] = useState([]);
  const [cargandoVehiculos, setCargandoVehiculos] = useState(true);
  const [misPedidos, setMisPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);

  // --- Estados del Modal ---
  const [modalVehiculoAbierto, setModalVehiculoAbierto] = useState(false);
  const [nuevaMarca, setNuevaMarca] = useState('');
  const [nuevoModelo, setNuevoModelo] = useState('');
  const [nuevoAnio, setNuevoAnio] = useState('');
  const [nuevoMotor, setNuevoMotor] = useState('');
  const [guardandoVehiculo, setGuardandoVehiculo] = useState(false);

  // Efecto: Si cambia la marca, reseteamos el modelo para evitar errores (Ej. Nissan Jetta)
  useEffect(() => {
    setNuevoModelo('');
  }, [nuevaMarca]);

  const fetchVehiculos = async () => {
    if (!userId) return;
    setCargandoVehiculos(true);
    try {
      const { data, error } = await supabase.from('vehiculos_cliente').select('*').eq('usuario_id', userId);
      if (error) throw error;
      setVehiculos(data || []);
    } catch (error) {
      console.error("Error al cargar los vehículos:", error.message);
    } finally {
      setCargandoVehiculos(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
    if (userId) {
      setTimeout(() => {
        setMisPedidos([
          { id: 'COT-8923', producto: 'Amortiguadores Traseros Gas KYB', estado: 'Aprobada', tienda: 'Mecánica Total Sur', precio: 2100 },
          { id: 'REQ-042', producto: 'Bomba de Agua GMB', estado: 'Pendiente', tienda: 'Autopartes Express', precio: null }
        ]);
        setCargandoPedidos(false);
      }, 1000);
    }
  }, [userId]);

  const handleAgregarVehiculo = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setGuardandoVehiculo(true);

    try {
      const { error } = await supabase.from('vehiculos_cliente').insert([{
        usuario_id: userId,
        marca: nuevaMarca,
        modelo: nuevoModelo,
        anio: nuevoAnio,
        motor: nuevoMotor || null
      }]);

      if (error) throw error;

      setNuevaMarca('');
      setNuevoModelo('');
      setNuevoAnio('');
      setNuevoMotor('');
      setModalVehiculoAbierto(false);
      await fetchVehiculos();
    } catch (error) {
      alert("No se pudo registrar el vehículo: " + error.message);
    } finally {
      setGuardandoVehiculo(false);
    }
  };

  const handleEliminarVehiculo = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este vehículo de tu garaje?")) return;
    try {
      const { error } = await supabase.from('vehiculos_cliente').delete().eq('id', id);
      if (error) throw error;
      await fetchVehiculos();
    } catch (error) {
      alert("Error al eliminar: " + error.message);
    }
  };

  // Obtenemos la lista dinámica de modelos según la marca seleccionada
  const modelosDisponibles = nuevaMarca ? BASE_DE_DATOS_AUTOS[nuevaMarca] : [];

  return (
    <div className="py-10 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mi Taller Virtual</h1>
            <p className="text-gray-500 font-medium mt-1">Bienvenido de vuelta, <span className="text-autoblue font-bold">{nombreMostrado}</span></p>
          </div>
          <Link to="/catalogo" className="bg-autoblue hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            Buscar Nueva Pieza
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* GARAJE VIRTUAL */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-autoblue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                  Mis Vehículos
                </h3>
                <button onClick={() => setModalVehiculoAbierto(true)} className="text-autoblue hover:bg-blue-100 text-sm font-bold bg-blue-50 px-3 py-1 rounded-lg transition-colors">
                  Añadir +
                </button>
              </div>

              <div className="space-y-3">
                {cargandoVehiculos ? (
                  <p className="text-xs text-gray-400 text-center py-4 animate-pulse">Cargando tu garaje...</p>
                ) : vehiculos.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl p-4">
                    <p className="text-sm text-gray-400 font-medium">No tienes vehículos registrados.</p>
                  </div>
                ) : (
                  vehiculos.map(carro => (
                    <div key={carro.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 group relative">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 shadow-sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{carro.marca} {carro.modelo}</p>
                          <p className="text-xs text-gray-500 font-medium">{carro.anio} {carro.motor ? `• ${carro.motor}` : ''}</p>
                        </div>
                      </div>
                      <button onClick={() => handleEliminarVehiculo(carro.id)} className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* HISTORIAL / SOLICITUDES */}
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

      {/* ======================================================== */}
      {/* MODAL INTERACTIVO MEJORADO CON SELECTORES */}
      {/* ======================================================== */}
      {modalVehiculoAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 border border-gray-100 animate-fade-in">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-autoblue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                Registrar Vehículo
              </h3>
              <button onClick={() => setModalVehiculoAbierto(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleAgregarVehiculo} className="space-y-4">
              
              {/* SELECTOR DE MARCA */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Marca</label>
                <select 
                  required 
                  value={nuevaMarca} 
                  onChange={(e) => setNuevaMarca(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-autoblue transition-all cursor-pointer font-medium"
                >
                  <option value="">Selecciona una marca...</option>
                  {Object.keys(BASE_DE_DATOS_AUTOS).map(marca => (
                    <option key={marca} value={marca}>{marca}</option>
                  ))}
                </select>
              </div>

              {/* SELECTOR DE MODELO (Solo se activa si ya hay marca) */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Modelo</label>
                <select 
                  required 
                  disabled={!nuevaMarca}
                  value={nuevoModelo} 
                  onChange={(e) => setNuevoModelo(e.target.value)} 
                  className={`w-full border rounded-xl p-3 text-sm outline-none transition-all font-medium ${!nuevaMarca ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-autoblue cursor-pointer'}`}
                >
                  <option value="">{nuevaMarca ? 'Selecciona el modelo...' : 'Primero elige una marca'}</option>
                  {modelosDisponibles.map(modelo => (
                    <option key={modelo} value={modelo}>{modelo}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* SELECTOR DE AÑO */}
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Año</label>
                  <select 
                    required 
                    value={nuevoAnio} 
                    onChange={(e) => setNuevoAnio(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-autoblue transition-all cursor-pointer font-medium"
                  >
                    <option value="">Seleccionar...</option>
                    {ANIOS_DISPONIBLES.map(anio => (
                      <option key={anio} value={anio}>{anio}</option>
                    ))}
                  </select>
                </div>
                
                {/* INPUT LIBRE (MOTOR) */}
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Motor (Opcional)</label>
                  <input 
                    type="text" 
                    value={nuevoMotor} 
                    onChange={(e) => setNuevoMotor(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-autoblue transition-all" 
                    placeholder="Ej. 1.6L, V6..." 
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setModalVehiculoAbierto(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl text-sm transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={guardandoVehiculo} className="flex-1 bg-autoblue hover:bg-blue-900 text-white font-black py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2">
                  {guardandoVehiculo ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "Guardar Auto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}