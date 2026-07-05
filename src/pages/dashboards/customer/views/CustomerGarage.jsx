import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../supabase';// Ajusta la ruta según tu proyecto
import VehicleModal from '../components/VehicleModal';

export default function CustomerGarage({ usuario }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [cargandoVehiculos, setCargandoVehiculos] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  const userId = usuario?.id;

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
  }, [userId]);

  const handleEliminarVehiculo = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este vehículo de tu garaje?")) return;
    try {
      const { error } = await supabase.from('vehiculos_cliente').delete().eq('id', id);
      if (error) throw error;
      await fetchVehiculos(); // Recargamos la lista
    } catch (error) {
      alert("Error al eliminar: " + error.message);
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mi Garaje Virtual</h1>
        <p className="text-gray-500 font-medium mt-1">Registra tus autos para encontrar refacciones 100% compatibles.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-4xl">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-autoblue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            Mis Vehículos Guardados
          </h3>
          <button onClick={() => setModalAbierto(true)} className="text-autoblue hover:bg-blue-100 text-sm font-bold bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
            + Añadir Auto
          </button>
        </div>

        <div className="space-y-3">
          {cargandoVehiculos ? (
            <p className="text-sm text-gray-400 text-center py-8 animate-pulse font-bold">Abriendo tu garaje...</p>
          ) : vehiculos.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
              <p className="text-sm text-gray-500 font-medium">Aún no tienes vehículos registrados.</p>
            </div>
          ) : (
            vehiculos.map(carro => (
              <div key={carro.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 group relative hover:border-autoblue transition-colors shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 shadow-sm group-hover:text-autoblue transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-lg leading-tight">{carro.marca} {carro.modelo}</p>
                    <p className="text-sm text-gray-500 font-medium">{carro.anio} {carro.motor ? `• Motor: ${carro.motor}` : ''}</p>
                  </div>
                </div>
                <button onClick={() => handleEliminarVehiculo(carro.id)} className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded-lg hover:border-red-200 hover:bg-red-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {modalAbierto && (
        <VehicleModal 
          userId={userId} 
          onClose={() => setModalAbierto(false)} 
          onSuccess={() => {
            setModalAbierto(false);
            fetchVehiculos();
          }} 
        />
      )}
    </div>
  );
}