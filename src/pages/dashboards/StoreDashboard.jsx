import { useState } from 'react';
// IMPORTANTE: Asegúrate de que esta ruta hacia mockData sea correcta en tu proyecto
import { mockProducts } from '../../data/mockData'; 

export default function StoreDashboard() {
  // Estados para la navegación y el formulario
  const [activeTab, setActiveTab] = useState('orders');
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    marca: '', modelo: '', nombre_comercial: '', descripcion: '',
    fabricante_original: '', nivel_calidad: 'Premium', tiempo_duracion: '',
    stock: 0, precio_lista: 0, precio_oferta: 0,
    establecimiento_id: '08440253-dabf-41b3-b30d-babf48f7974f' // ¡Recuerda poner tu UUID real aquí!
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/inventario/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert("¡Producto guardado exitosamente en Supabase!");
        setShowForm(false);
      } else {
        alert("Error en el servidor al guardar.");
      }
    } catch (error) {
      alert("Error de conexión con el backend.");
    }
  };

  // Datos extendidos de cotizaciones para la simulación
  const mockRequests = [
    { id: "REQ-042", part: "Bomba de Agua GMB", vehicle: "Chevy 2005 1.6L", client: "Taller Mecánico Automotriz Silva", status: "Pendiente", time: "Hace 5 min" },
    { id: "REQ-039", part: "Balatas Delanteras Brembo", vehicle: "Nissan Versa 2018", client: "Jesús Alarcón (Particular)", status: "Respondido", time: "Hace 20 min" },
    { id: "REQ-031", part: "Aceite Sintético Castrol 5W-30", vehicle: "Universal", client: "Refaccionaria Hermanos Gómez", status: "Vendido", time: "Ayer" }
  ];

  return (
    <div className="py-10 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado Principal */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mostrador Digital</h1>
            <p className="text-gray-500 font-medium mt-1">Autopartes Express — <span className="text-autoblue font-bold">Sucursal Norte</span></p>
          </div>
          <span className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            Terminal Sincronizada con Supabase
          </span>
        </div>

        {/* Tarjetas de Indicadores Clave (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-xs font-black uppercase tracking-wider">Solicitudes Nuevas</p>
                <p className="text-4xl font-black text-autoblue mt-1">12</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-autoblue">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-3 flex items-center gap-1">
              <svg className="w-4 h-4 text-autored" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              3 requieren atención inmediata
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-xs font-black uppercase tracking-wider">Conversión de Cotizaciones</p>
                <p className="text-4xl font-black text-green-600 mt-1">74%</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-3 flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
              En comparación al mes pasado
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-autored transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-xs font-black uppercase tracking-wider">Alertas de Inventario</p>
                <p className="text-4xl font-black text-autored mt-1">2 <span className="text-lg text-gray-400 font-bold">SKUs</span></p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl text-autored">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
            </div>
            <p className="text-xs text-red-600 font-bold mt-3">Piezas con bajo stock en mostrador</p>
          </div>
        </div>

        {/* Sistema de Navegación por Pestañas (Tabs) */}
        <div className="flex border-b border-gray-200 mb-6 gap-4 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'orders' ? 'border-autoblue text-autoblue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            Cotizaciones Entrantes
          </button>
          <button 
            onClick={() => setActiveTab('catalog')}
            className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'catalog' ? 'border-autoblue text-autoblue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Mi Inventario Local
          </button>
        </div>

        {/* Contenido de Pestaña: Cotizaciones Entrantes */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="p-4 font-bold uppercase tracking-wider text-xs">ID / Tiempo</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-xs">Cliente / Vehículo</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-xs">Pieza Solicitada</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-xs">Estado</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-xs text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockRequests.map((req, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{req.id}</p>
                        <p className="text-gray-500 text-xs mt-1">{req.time}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-autoblue">{req.client}</p>
                        <p className="text-gray-600 text-xs mt-1">{req.vehicle}</p>
                      </td>
                      <td className="p-4 font-bold text-gray-900">
                        {req.part}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          req.status === 'Pendiente' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                          req.status === 'Respondido' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {req.status === 'Pendiente' ? (
                          <button className="bg-autoblue text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-900 transition-colors shadow-sm text-xs">
                            Enviar Cotización
                          </button>
                        ) : (
                          <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors text-xs border border-gray-200">
                            Ver Detalles
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contenido de Pestaña: Mi Inventario Local */}
        {activeTab === 'catalog' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fade-in">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-900">Gestión de Stock Real</h3>
              <button 
                onClick={() => setShowForm(!showForm)}
                className={`border-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${showForm ? 'border-gray-300 text-gray-500 hover:bg-gray-100' : 'border-autoblue text-autoblue hover:bg-autoblue hover:text-white'}`}
              >
                {showForm ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    Cancelar Registro
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Agregar Nueva Pieza
                  </>
                )}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-5 shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Nombre Comercial</label>
                    <input type="text" name="nombre_comercial" value={formData.nombre_comercial} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:ring-1 focus:ring-autoblue focus:border-autoblue outline-none transition-all" placeholder="Ej. Balatas Traseras Cerámicas" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Marca</label>
                    <input type="text" name="marca" value={formData.marca} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:ring-1 focus:ring-autoblue focus:border-autoblue outline-none transition-all" placeholder="Ej. Brembo" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Modelo Compatible</label>
                    <input type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:ring-1 focus:ring-autoblue focus:border-autoblue outline-none transition-all" placeholder="Ej. Nissan Versa 2018+" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Cantidad en Stock</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:ring-1 focus:ring-autoblue focus:border-autoblue outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Precio Compra ($)</label>
                    <input type="number" name="precio_lista" value={formData.precio_lista} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:ring-1 focus:ring-autoblue focus:border-autoblue outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Precio Venta ($)</label>
                    <input type="number" name="precio_oferta" value={formData.precio_oferta} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:ring-1 focus:ring-autoblue focus:border-autoblue outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Calidad</label>
                    <select name="nivel_calidad" value={formData.nivel_calidad} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 focus:ring-1 focus:ring-autoblue focus:border-autoblue outline-none transition-all">
                      <option value="Premium">Premium</option>
                      <option value="Económica">Económica</option>
                      <option value="Original OEM">Original OEM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Descripción Técnica</label>
                  <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 h-20 focus:ring-1 focus:ring-autoblue focus:border-autoblue outline-none transition-all" placeholder="Especificaciones adicionales de la pieza..."></textarea>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" className="bg-autoblue hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                    Sincronizar a Base de Datos
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockProducts.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:border-autoblue transition-colors group bg-white shadow-sm hover:shadow-md">
                  <div className="flex gap-4">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-gray-100 bg-gray-50" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-autoblue transition-colors">{product.name}</p>
                      <p className="text-gray-500 text-xs mt-1 font-medium">{product.brand}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-wider text-gray-400">Precio Público</p>
                      <p className="font-black text-autored">${product.price}</p>
                    </div>
                    <button className="text-gray-400 hover:text-autoblue p-2 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}