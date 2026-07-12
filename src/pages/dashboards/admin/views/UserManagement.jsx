import React, { useState, useEffect } from 'react';

export default function UserManagement() {
  const [compradores, setCompradores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // NUEVO ESTADO PARA BUSCADOR

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('https://backautored-production.up.railway.app/api/admin/compradores');
      if (response.ok) {
        const data = await response.json();
        setCompradores(data);
      }
    } catch (error) {
      console.error("Error al cargar los compradores:", error);
    } finally {
      setCargando(false);
    }
  };

  const alternarEstadoUsuario = async (id) => {
    try {
      const response = await fetch(`https://backautored-production.up.railway.app/api/admin/compradores/${id}/suspender`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        setCompradores(prev => 
          prev.map(usuario => 
            usuario.id === id ? { ...usuario, activo: !usuario.activo } : usuario
          )
        );
      } else {
        alert("Hubo un error al cambiar el estado del usuario.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const exportarCSV = () => {
    if (!compradores || compradores.length === 0) {
      alert("No hay clientes para exportar.");
      return;
    }
    const encabezados = ["ID_Usuario", "Nombre_Registrado", "Rol", "Estado"];
    const filas = compradores.map(u => [
      u.id, `"${u.nombre || 'Sin nombre'}"`, u.rol, u.activo === false ? 'Suspendido' : 'Activo'
    ]);
    const contenidoCSV = [encabezados.join(","), ...filas.map(f => f.join(","))].join("\n");
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    const fecha = new Date().toISOString().split('T')[0];
    enlace.setAttribute("download", `Clientes_AutoRed_${fecha}.csv`);
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
  };

  // FILTRADO EN TIEMPO REAL
  const compradoresFiltrados = compradores.filter(usuario => {
    const s = searchTerm.toLowerCase();
    return (
      (usuario.nombre && usuario.nombre.toLowerCase().includes(s)) ||
      (usuario.id && usuario.id.toString().toLowerCase().includes(s))
    );
  });

  if (cargando) return <div className="p-10 text-center text-gray-500 font-medium animate-pulse">Cargando base de datos de clientes...</div>;

  return (
    <div className="py-6 bg-gray-50 min-h-screen font-sans animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO */}
        <div className="mb-8 border-b border-gray-200 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestión de Clientes</h1>
            <p className="text-gray-500 font-medium mt-1">Moderación de usuarios de la comunidad AutoRed.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            
            {/* BUSCADOR */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar por ID o Nombre..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>

            <button onClick={exportarCSV} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Exportar CSV
            </button>
            <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
              Total: {compradoresFiltrados.length}
            </div>
          </div>
        </div>

        {/* TABLA DE USUARIOS */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <th className="py-4 px-6">ID de Usuario</th>
                  <th className="py-4 px-6">Cliente</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6 text-right">Moderación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {compradoresFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-400 font-medium">No se encontraron clientes.</td>
                  </tr>
                ) : (
                  compradoresFiltrados.map((usuario) => {
                    const estaSuspendido = usuario.activo === false;
                    
                    return (
                      <tr key={usuario.id} className={`hover:bg-gray-50 transition-colors ${estaSuspendido ? 'bg-red-50/30' : ''}`}>
                        <td className="py-4 px-6">
                          <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                            {usuario.id.substring(0, 8)}...
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${estaSuspendido ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-autoblue'}`}>
                              {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <p className="font-bold text-gray-900">{usuario.nombre || 'Usuario sin nombre'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black uppercase border ${
                            estaSuspendido ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${estaSuspendido ? 'bg-red-500' : 'bg-green-500'}`}></span>
                            {estaSuspendido ? 'Suspendido' : 'Activo'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => alternarEstadoUsuario(usuario.id)}
                            className={`font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ml-auto border ${
                              estaSuspendido 
                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                : 'bg-white text-red-600 border-red-200 hover:bg-red-50'
                            }`}
                          >
                            {estaSuspendido ? 'Reactivar Acceso' : 'Suspender Usuario'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}