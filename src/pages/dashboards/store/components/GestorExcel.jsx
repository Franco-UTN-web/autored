import { useState } from 'react';

export default function GestorExcel({ establecimientoId, onUploadSuccess }) {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  // URL base de tu backend en producción
  const API_URL = 'https://backautored-production.up.railway.app/api/inventario';

  const manejarDescarga = () => {
    // 🔥 Ahora la descarga es instantánea desde la carpeta pública de React 🔥
    window.location.href = '/plantilla_autored.xlsx';
  };

  const subirArchivo = async () => {
    if (!archivo) {
      setMensaje('Por favor selecciona un archivo Excel (.xlsx).');
      return;
    }

    setCargando(true);
    setMensaje('');
    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('establecimiento_id', establecimientoId);

    try {
      // Apuntamos al nuevo endpoint de Excel
      const response = await fetch(`${API_URL}/upload-excel`, {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();
      setMensaje(text);

      if (response.ok) {
        setArchivo(null); // Limpiamos el selector
        if (onUploadSuccess) onUploadSuccess(); // Recargamos el inventario
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
          <p className="text-xs text-gray-500">Sube tus refacciones usando nuestra plantilla de Excel oficial.</p>
        </div>
        <button 
          type="button"
          onClick={manejarDescarga}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-all shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Descargar Plantilla Excel
        </button>
      </div>

      <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
        <input 
          type="file" 
          accept=".xlsx, .xls"
          onChange={(e) => setArchivo(e.target.files[0])}
          className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
        />
        <button 
          type="button"
          onClick={subirArchivo}
          disabled={!archivo || cargando}
          className="bg-autoblue text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-800 transition-all disabled:opacity-50 shadow-sm"
        >
          {cargando ? 'Procesando...' : 'Subir Inventario'}
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