import { useState } from 'react';

export default function GestorCSV({ establecimientoId, onUploadSuccess }) {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  // URL base de tu backend en producción
  const API_URL = 'https://backautored-production.up.railway.app/api/inventario';

  const manejarDescarga = () => {
    // 🔥 Apuntamos a la URL pública de Railway 🔥
    window.location.href = `${API_URL}/plantilla-csv`;
  };

  const subirArchivo = async () => {
    if (!archivo) {
      setMensaje('Por favor selecciona un archivo CSV.');
      return;
    }

    setCargando(true);
    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('establecimiento_id', establecimientoId);

    try {
      // 🔥 Apuntamos a la URL pública de Railway 🔥
      const response = await fetch(`${API_URL}/upload-csv`, {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();
      setMensaje(text);

      if (response.ok) {
        setArchivo(null); // Limpiamos el selector de archivo
        if (onUploadSuccess) onUploadSuccess(); // Recargamos el inventario en el dashboard
      }
      
    } catch (error) {
      setMensaje('Error conectando con el servidor en la nube.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Carga Masiva de Inventario</h3>
          <p className="text-xs text-gray-500">Sube tus refacciones en lote usando nuestra plantilla oficial.</p>
        </div>
        <button 
          type="button"
          onClick={manejarDescarga}
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Descargar Plantilla
        </button>
      </div>

      <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
        <input 
          type="file" 
          accept=".csv"
          onChange={(e) => setArchivo(e.target.files[0])}
          className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-autoblue hover:file:bg-blue-100 cursor-pointer"
        />
        <button 
          type="button"
          onClick={subirArchivo}
          disabled={!archivo || cargando}
          className="bg-autoblue text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-800 transition-all disabled:opacity-50 shadow-sm"
        >
          {cargando ? 'Procesando...' : 'Subir Datos'}
        </button>
      </div>
      
      {mensaje && (
        <p className={`text-sm font-semibold ${mensaje.toLowerCase().includes('error') ? 'text-red-500' : 'text-green-600'}`}>
          {mensaje}
        </p>
      )}
    </div>
  );
}