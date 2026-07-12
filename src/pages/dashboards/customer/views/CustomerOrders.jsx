import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../../supabase'; // Ajusta la ruta a tu archivo de supabase

export default function CustomerOrders({ usuario }) {
  const [historialContactos, setHistorialContactos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      if (!usuario?.id) return;
      
      try {
        // Traemos el historial ordenado por fecha (los más recientes primero)
        const { data, error } = await supabase
          .from('historial_contactos')
          .select('*')
          .eq('usuario_id', usuario.id)
          .order('fecha_contacto', { ascending: false });

        if (error) throw error;
        setHistorialContactos(data || []);
      } catch (err) {
        console.error("Error cargando el historial:", err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchHistorial();
  }, [usuario]);

  // Formateador de fecha amigable (ej: "12 de Jul, 2026")
  const formatearFecha = (fechaISO) => {
    const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(fechaISO).toLocaleDateString('es-MX', opciones);
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Historial de Contactos</h1>
        <p className="text-gray-500 font-medium mt-1">Registro de las piezas y refaccionarias por las que has preguntado.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-5xl">
        <div className="space-y-4">
          {cargando ? (
            <p className="text-sm text-gray-400 text-center py-8 font-bold animate-pulse">Cargando tu historial...</p>
          ) : historialContactos.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
              <p className="text-sm text-gray-500 font-medium">Aún no has contactado a ninguna refaccionaria.</p>
              <Link to="/catalogo" className="mt-4 inline-block text-autoblue font-bold hover:underline">Explorar el catálogo</Link>
            </div>
          ) : (
            historialContactos.map(contacto => (
              <div key={contacto.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-green-500 transition-all group bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Info del Producto y Tienda */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-green-100 text-green-700 p-1.5 rounded-lg">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.94 5.83L3 22l4.25-1.12A9.957 9.957 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm.34 14.53l-1.63-1.63a12.16 12.16 0 01-3.66-2.6 12.16 12.16 0 01-2.6-3.66l1.63-1.63c.25-.25.33-.61.21-.94L5.3 4.22c-.12-.33-.48-.5-.81-.4-.86.25-1.56 1.05-1.56 1.97 0 2.76 1.5 6.4 4.54 9.44 3.04 3.04 6.68 4.54 9.44 4.54.92 0 1.72-.7 1.97-1.56.1-.33-.07-.69-.4-.81l-1.85-.99c-.33-.12-.69-.04-.94.21z" clipRule="evenodd"></path></svg>
                    </span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Contactado el {formatearFecha(contacto.fecha_contacto)}
                    </span>
                  </div>
                  <h4 className="font-black text-gray-900 text-lg group-hover:text-green-600 transition-colors">{contacto.producto}</h4>
                  <p className="text-sm text-gray-600 font-bold flex items-center gap-1.5 mt-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    Vendedor: {contacto.tienda}
                  </p>
                </div>

                {/* Precio y Acción */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Precio de Oferta</p>
                    <p className="text-2xl font-black text-gray-900">${contacto.precio}</p>
                  </div>
                  <Link 
                    to={`/producto/${contacto.inventario_id}`}
                    className="bg-white border border-gray-200 hover:border-green-500 text-gray-700 hover:text-green-600 px-4 py-2 rounded-xl text-sm font-bold mt-0 sm:mt-2 transition-colors inline-block text-center"
                  >
                    Ver Producto
                  </Link>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}