import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../supabase'; // Ajusta la ruta

const BASE_DE_DATOS_AUTOS = {
  "Chevrolet": ["Aveo", "Beat", "Chevy", "Onix", "Spark", "Tornado", "Tracker", "Trax"],
  "Ford": ["EcoSport", "Escape", "F-150", "Fiesta", "Figo", "Focus", "Ranger"],
  "Honda": ["Accord", "BR-V", "City", "Civic", "CR-V", "HR-V"],
  "Nissan": ["Altima", "Kicks", "March", "NP300", "Sentra", "Tiida", "Tsuru", "Versa"],
  "Toyota": ["Camry", "Corolla", "Hiace", "Hilux", "Prius", "RAV4", "Yaris"],
  "Volkswagen": ["Bora", "Gol", "Golf", "Jetta", "Polo", "Saveiro", "Tiguan", "Vento"]
};

const ANIOS_DISPONIBLES = Array.from({ length: 2026 - 1995 + 1 }, (_, i) => 2026 - i);

export default function VehicleModal({ userId, onClose, onSuccess }) {
  const [nuevaMarca, setNuevaMarca] = useState('');
  const [nuevoModelo, setNuevoModelo] = useState('');
  const [nuevoAnio, setNuevoAnio] = useState('');
  const [nuevoMotor, setNuevoMotor] = useState('');
  const [guardandoVehiculo, setGuardandoVehiculo] = useState(false);

  useEffect(() => {
    setNuevoModelo('');
  }, [nuevaMarca]);

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
      onSuccess();
    } catch (error) {
      alert("No se pudo registrar el vehículo: " + error.message);
    } finally {
      setGuardandoVehiculo(false);
    }
  };

  const modelosDisponibles = nuevaMarca ? BASE_DE_DATOS_AUTOS[nuevaMarca] : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 border border-gray-100 animate-fade-in">
        
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-autoblue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            Registrar Vehículo
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 p-1.5 rounded-lg border border-gray-200">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleAgregarVehiculo} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Marca</label>
            <select required value={nuevaMarca} onChange={(e) => setNuevaMarca(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:bg-white focus:ring-2 focus:ring-autoblue transition-all font-bold">
              <option value="">Selecciona una marca...</option>
              {Object.keys(BASE_DE_DATOS_AUTOS).map(marca => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Modelo</label>
            <select required disabled={!nuevaMarca} value={nuevoModelo} onChange={(e) => setNuevoModelo(e.target.value)} className={`w-full border rounded-xl p-3 text-sm font-bold transition-all ${!nuevaMarca ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-autoblue'}`}>
              <option value="">{nuevaMarca ? 'Selecciona el modelo...' : 'Primero elige una marca'}</option>
              {modelosDisponibles.map(modelo => (
                <option key={modelo} value={modelo}>{modelo}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Año</label>
              <select required value={nuevoAnio} onChange={(e) => setNuevoAnio(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-autoblue transition-all">
                <option value="">Seleccionar...</option>
                {ANIOS_DISPONIBLES.map(anio => (
                  <option key={anio} value={anio}>{anio}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Motor (Opcional)</label>
              <input type="text" value={nuevoMotor} onChange={(e) => setNuevoMotor(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-autoblue transition-all" placeholder="Ej. 1.6L" />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 rounded-xl text-sm transition-colors border border-gray-200">
              Cancelar
            </button>
            <button type="submit" disabled={guardandoVehiculo} className="flex-1 bg-autoblue hover:bg-blue-900 text-white font-black py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center disabled:opacity-50">
              {guardandoVehiculo ? 'Guardando...' : 'Guardar Auto'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}