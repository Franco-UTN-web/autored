import React, { useState, useEffect } from 'react';

export default function UserManagement() {
  const [compradores, setCompradores] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/compradores');
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

  const exportarCSV = () => {
    // 1. Verificamos el arreglo correcto: compradores
    if (!compradores || compradores.length === 0) {
      alert("No hay clientes para exportar.");
      return;
    }

    // 2. Encabezados para clientes
    const encabezados = ["ID_Usuario", "Nombre_Registrado", "Rol"];

    // 3. Extraemos los datos de la variable compradores
    const filas = compradores.map(usuario => [
      usuario.id,
      `"${usuario.nombre || 'Sin nombre'}"`, // Comillas para evitar problemas si el nombre tiene comas
      usuario.rol
    ]);

    // 4. Unimos todo con comas y saltos de línea (\n)
    const contenidoCSV = [
      encabezados.join(","),
      ...filas.map(fila => fila.join(","))
    ].join("\n");

    // 5. Creamos el archivo y forzamos la descarga
   const BOM = '\uFEFF'; // <-- El carácter mágico
   const blob = new Blob([BOM + contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    
    // Le ponemos un nombre diferente al archivo
    const fecha = new Date().toISOString().split('T')[0];
    enlace.setAttribute("download", `Clientes_AutoRed_${fecha}.csv`);
    
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
  };

  if (cargando) return <div className="p-10 text-center text-gray-500 font-medium animate-pulse">Cargando base de datos de clientes...</div>;

  return (
    <div className="py-6 bg-gray-50 min-h-screen font-sans animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO */}
        <div className="mb-8 border-b border-gray-200 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestión de Clientes</h1>
            <p className="text-gray-500 font-medium mt-1">Auditoría y control de usuarios compradores en AutoRed.</p>
          </div>
          <button 
        onClick={exportarCSV}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        Exportar a Excel (.csv)
      </button>
          <div className="bg-autoblue text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Total: {compradores.length}
          </div>
        </div>

        {/* TABLA DE USUARIOS */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <th className="py-4 px-6">ID de Usuario</th>
                  <th className="py-4 px-6">Nombre Registrado</th>
                  <th className="py-4 px-6">Rol</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {compradores.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-400 font-medium">
                      No hay clientes registrados en la plataforma.
                    </td>
                  </tr>
                ) : (
                  compradores.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                          {usuario.id}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-autoblue flex items-center justify-center font-black text-xs">
                            {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <p className="font-bold text-gray-900">{usuario.nombre || 'Usuario sin nombre'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black bg-green-50 text-green-700 border border-green-100 uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          {usuario.rol}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-autoblue hover:text-blue-900 font-bold text-xs transition-colors underline decoration-transparent hover:decoration-blue-900 underline-offset-4">
                          Auditar Actividad
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}