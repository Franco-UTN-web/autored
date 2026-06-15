import { useState, useEffect } from 'react';

// --- DICCIONARIOS LOCALES (Viven AFUERA del componente) ---
const vehiculosDb = {
  "Nissan": ["Versa", "Sentra", "Tsuru", "March", "NP300", "Kicks", "Tiida"],
  "Volkswagen": ["Jetta", "Golf", "Vento", "Polo", "Saveiro", "Tiguan", "Vocho"],
  "Chevrolet": ["Chevy", "Aveo", "Spark", "Silverado", "Beat", "Tracker", "Onix"],
  "Ford": ["Fiesta", "Focus", "Figo", "Ranger", "Explorer", "F-150", "Mustang"],
  "Toyota": ["Yaris", "Corolla", "Camry", "Hilux", "RAV4", "Avanza"],
  "Honda": ["Civic", "City", "CR-V", "Accord", "HR-V"],
  "Universal": ["Aplica para cualquier modelo"]
};

const aniosDisponibles = [
  "Todos los años", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"
];

const marcasRefacciones = [
  "Bosch", "Brembo", "Gates", "LUK", "Valeo", "ACDelco", "Castrol", "KYB", "NGK", "Genérica"
];

// =====================================================================
// INICIO DEL COMPONENTE PRINCIPAL (Todo lo de adentro debe estar aquí)
// =====================================================================
export default function StoreDashboard() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [showForm, setShowForm] = useState(false);
  const [inventarioLocal, setInventarioLocal] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  
  // ESTADO DE EDICIÓN (Acomodado correctamente adentro)
  const [idEdicion, setIdEdicion] = useState(null);

  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'exito' });
  const [modalEliminar, setModalEliminar] = useState({ visible: false, idProducto: null });

  // Función controladora de la notificación flotante
  const mostrarNotificacion = (mensaje, tipo = 'exito') => {
    setNotificacion({ visible: true, mensaje, tipo });
    // Se oculta sola después de 3.5 segundos
    setTimeout(() => setNotificacion({ visible: false, mensaje: '', tipo: 'exito' }), 3500);
  };

  const ESTABLECIMIENTO_ID = '08440253-dabf-41b3-b30d-babf48f7974f';
  // ¡RECUERDA PONER TU LLAVE REAL AQUÍ PARA QUE PUEDAS SUBIR FOTOS!
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaG50cXNhYndjYnVsbmFwZmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjYyNDYsImV4cCI6MjA5NTUwMjI0Nn0.8YqiYDidhvZc-n0VInSPy0XxvqYFgWz5fEijnDh6K_o'; 

  const [formData, setFormData] = useState({
    categoria: 'Motor', marca: '', nombre_comercial: '', descripcion: '',
    fabricante_original: '', nivel_calidad: 'Premium', tiempo_duracion: '',
    stock: 1, precio_lista: 0, precio_oferta: 0, establecimiento_id: ESTABLECIMIENTO_ID,
    tipo_vehiculo: 'Auto', marca_vehiculo: '', modelo: '', anio_vehiculo: '', imagen_url: ''
  });

  const cargarInventario = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/inventario/tienda/${ESTABLECIMIENTO_ID}`);
      if (response.ok) {
        const data = await response.json();
        setInventarioLocal(data);
      }
    } catch (error) {
      console.error("Error al cargar inventario:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  // FUNCIÓN PARA CARGAR DATOS EN EL FORMULARIO (MODO EDICIÓN)
  const cargarDatosParaEdicion = (item) => {
    setIdEdicion(item.id);
    setImagenSeleccionada(null); // Limpiamos si había otra foto seleccionada
    setFormData({
      categoria: item.pieza?.categoria || 'Motor',
      marca: item.pieza?.marca || '',
      nombre_comercial: item.pieza?.nombre_comercial || '',
      descripcion: item.pieza?.descripcion || '',
      nivel_calidad: item.pieza?.nivel_calidad || 'Premium',
      stock: item.stock || 1,
      precio_lista: item.precio_lista || 0,
      precio_oferta: item.precio_oferta || 0,
      establecimiento_id: ESTABLECIMIENTO_ID,
      tipo_vehiculo: item.pieza?.tipo_vehiculo || 'Auto',
      marca_vehiculo: item.pieza?.marca_vehiculo || '',
      modelo: item.pieza?.modelo || '',
      anio_vehiculo: item.pieza?.anio_vehiculo || '',
      imagen_url: item.pieza?.imagen_url || ''
    });
    
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Te lleva al formulario automáticamente
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'marca_vehiculo') newData.modelo = '';
      return newData;
    });
  };

  const confirmarEliminacion = (id) => {
    setModalEliminar({ visible: true, idProducto: id });
  };

  // 2. Si dice que "Sí", se ejecuta esto:
  const ejecutarEliminacion = async () => {
    const id = modalEliminar.idProducto;
    setModalEliminar({ visible: false, idProducto: null }); // Cerramos el modal

    try {
      const response = await fetch(`http://localhost:8080/api/inventario/eliminar/${id}`, { method: 'DELETE' });
      if (response.ok) {
        mostrarNotificacion("Producto eliminado del inventario.");
        cargarInventario();
      } else {
        mostrarNotificacion("Error al intentar eliminar el producto.", "error");
      }
    } catch (error) {
      mostrarNotificacion("Error de conexión: " + error.message, "error");
    }
  };

  const subirImagenASupabase = async (file) => {
    const extension = file.name.split('.').pop();
    const nombreUnico = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`;
    const urlUpload = `https://rdhntqsabwcbulnapfcg.supabase.co/storage/v1/object/refaccionarias/${nombreUnico}`;

    const response = await fetch(urlUpload, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': file.type 
      },
      body: file
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || "Rechazado por Supabase Storage");
    }

    return `https://rdhntqsabwcbulnapfcg.supabase.co/storage/v1/object/public/refaccionarias/${nombreUnico}`;
  };

  // HANDLESUBMIT INTELIGENTE (Crea o Actualiza)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let urlFinalImagen = formData.imagen_url;

      if (imagenSeleccionada) {
        mostrarNotificacion("Subiendo imagen a la nube..."); // Así se ve moderno y no congela
        urlFinalImagen = await subirImagenASupabase(imagenSeleccionada);
      }

      const payloadCompleto = { ...formData, imagen_url: urlFinalImagen };

      // Lógica de decisión: POST vs PUT
      const urlFetch = idEdicion 
        ? `http://localhost:8080/api/inventario/actualizar/${idEdicion}` 
        : 'http://localhost:8080/api/inventario/agregar';
      
      const metodoFetch = idEdicion ? 'PUT' : 'POST';

      const response = await fetch(urlFetch, {
        method: metodoFetch,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadCompleto)
      });

      if (response.ok) {
        mostrarNotificacion(idEdicion ? "¡Producto actualizado correctamente!" : "¡Refacción guardada exitosamente!");
        setShowForm(false);
        setIdEdicion(null); // Limpiamos el modo edición
        setImagenSeleccionada(null);
        
        setFormData({
          categoria: 'Motor', marca: '', nombre_comercial: '', descripcion: '',
          fabricante_original: '', nivel_calidad: 'Premium', tiempo_duracion: '',
          stock: 1, precio_lista: 0, precio_oferta: 0, establecimiento_id: ESTABLECIMIENTO_ID,
          tipo_vehiculo: 'Auto', marca_vehiculo: '', modelo: '', anio_vehiculo: '', imagen_url: ''
        });
        
        cargarInventario();
      } else {
        alert("Error en el servidor de Java.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="py-10 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mostrador Digital</h1>
            <p className="text-gray-500 font-medium mt-1">Autopartes Express — <span className="text-autoblue font-bold">Sucursal Norte</span></p>
          </div>
          <span className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            Terminal Sincronizada Automática
          </span>
        </div>

        <div className="flex border-b border-gray-200 mb-6 gap-4 overflow-x-auto">
          <button onClick={() => setActiveTab('orders')} className={`py-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap ${activeTab === 'orders' ? 'border-autoblue text-autoblue' : 'border-transparent text-gray-500'}`}>
            Cotizaciones Entrantes
          </button>
          <button onClick={() => setActiveTab('catalog')} className={`py-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap ${activeTab === 'catalog' ? 'border-autoblue text-autoblue' : 'border-transparent text-gray-500'}`}>
            Mi Inventario Local
          </button>
        </div>

        {activeTab === 'catalog' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fade-in">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-900">Gestión de Stock Real</h3>
              <button onClick={() => {
                setShowForm(!showForm);
                if(showForm) setIdEdicion(null); // Limpiar edición si cancelan
              }} className={`border-2 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 ${showForm ? 'border-gray-300 text-gray-500' : 'border-autoblue text-autoblue'}`}>
                {showForm ? 'Cancelar' : '+ Agregar Nueva Pieza'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-6 shadow-inner border-t-4 border-t-autoblue">
                
                {/* 1. DATOS DE LA REFACCIÓN */}
                <div>
                  <h4 className="text-sm font-bold text-autoblue mb-3 border-b pb-1">1. Datos de la Refacción</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Tipo de Pieza</label>
                      <select name="categoria" value={formData.categoria} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
                        <option value="Motor">Motor (Bujías, Bandas)</option>
                        <option value="Suspensión">Suspensión y Dirección</option>
                        <option value="Frenos">Frenos</option>
                        <option value="Transmisión">Transmisión</option>
                        <option value="Filtros">Filtros</option>
                        <option value="Eléctrico">Eléctrico</option>
                        <option value="Carrocería">Carrocería</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Marca de la Pieza</label>
                      <select name="marca" value={formData.marca} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
                        <option value="">Selecciona marca...</option>
                        {marcasRefacciones.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Nombre Comercial</label>
                      <input type="text" name="nombre_comercial" value={formData.nombre_comercial} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="Ej. Balatas de Cerámica" />
                    </div>
                  </div>
                </div>

                {/* 2. COMPATIBILIDAD */}
                <div>
                  <h4 className="text-sm font-bold text-autoblue mb-3 border-b pb-1">2. Compatibilidad del Vehículo</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Tipo de Vehículo</label>
                      <select name="tipo_vehiculo" value={formData.tipo_vehiculo} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
                        <option value="Auto">Auto / Sedán</option>
                        <option value="Camioneta">Camioneta / SUV</option>
                        <option value="Motocicleta">Motocicleta</option>
                        <option value="Universal">Universal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Marca Vehículo</label>
                      <select name="marca_vehiculo" value={formData.marca_vehiculo} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
                        <option value="">Selecciona marca...</option>
                        {Object.keys(vehiculosDb).map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Modelo</label>
                      <select name="modelo" value={formData.modelo} onChange={handleInputChange} required disabled={!formData.marca_vehiculo} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm disabled:bg-gray-100">
                        <option value="">Selecciona modelo...</option>
                        {formData.marca_vehiculo && vehiculosDb[formData.marca_vehiculo].map(mod => <option key={mod} value={mod}>{mod}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Año</label>
                      <select name="anio_vehiculo" value={formData.anio_vehiculo} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
                        <option value="">Selecciona año...</option>
                        {aniosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. STOCK Y MULTIMEDIA */}
                <div>
                  <h4 className="text-sm font-bold text-autoblue mb-3 border-b pb-1">3. Precios y Multimedia</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Stock</label>
                      <input type="number" name="stock" min="0" step="1" value={formData.stock} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Precio Compra ($)</label>
                      <input type="number" name="precio_lista" min="0" step="0.01" value={formData.precio_lista} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Precio Venta ($)</label>
                      <input type="number" name="precio_oferta" min="0" step="0.01" value={formData.precio_oferta} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Calidad</label>
                      <select name="nivel_calidad" value={formData.nivel_calidad} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
                        <option value="Premium">Premium</option>
                        <option value="Original OEM">Original OEM</option>
                        <option value="Económica">Económica</option>
                        <option value="Genérica">Genérica</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">Fotografía (Opcional si se mantiene la misma)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setImagenSeleccionada(e.target.files[0])}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button type="submit" className="bg-autoblue hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">
                    {idEdicion ? 'Actualizar Producto en BD' : 'Sincronizar a Base de Datos'}
                  </button>
                </div>
              </form>
            )}

            {/* MAPEO DE PRODUCTOS */}
            {cargando ? (
              <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Cargando inventario...</div>
            ) : inventarioLocal.length === 0 ? (
              <div className="p-8 text-center text-gray-500 border-2 border-dashed rounded-xl">No hay piezas.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventarioLocal.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:border-autoblue transition-colors group bg-white shadow-sm">
                    <div className="flex gap-4">
                      
                      {item.pieza?.imagen_url ? (
                        <img 
                          src={item.pieza.imagen_url} 
                          alt={item.pieza.nombre_comercial} 
                          className="w-16 h-16 object-cover rounded-lg border border-gray-100 bg-gray-50"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 font-black text-xl">
                          {item.pieza?.nombre_comercial?.charAt(0)}
                        </div>
                      )}

                      <div>
                        <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-autoblue transition-colors">
                          {item.pieza?.nombre_comercial}
                        </p>
                        <p className="text-gray-500 text-xs mt-1 font-medium">{item.pieza?.marca} • {item.pieza?.modelo}</p>
                        
                        {/* SEMÁFORO DE STOCK */}
                        <div className="mt-2 flex items-center gap-2">
                          <p className={`font-bold text-xs px-2 py-0.5 rounded inline-block ${
                            item.stock === 0 ? 'bg-red-100 text-red-600' : 
                            item.stock <= 5 ? 'bg-orange-100 text-orange-600' : 
                            'bg-green-50 text-green-600'
                          }`}>
                            Stock: {item.stock}
                          </p>

                          {item.stock > 0 && item.stock <= 5 && (
                            <span className="text-[10px] font-black text-orange-600 uppercase flex items-center gap-1 animate-pulse">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                              ¡Últimas piezas!
                            </span>
                          )}

                          {item.stock === 0 && (
                            <span className="text-[10px] font-black text-red-600 uppercase flex items-center gap-1">
                              Agotado
                            </span>
                          )}
                        </div>

                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase font-black text-gray-400">Precio Oferta</p>
                        <p className="font-black text-autored text-lg">${item.precio_oferta}</p>
                      </div>
                      
                      {/* BOTÓN DE EDITAR */}
                      <button 
                        onClick={() => cargarDatosParaEdicion(item)}
                        className="text-autoblue bg-blue-50 hover:bg-blue-100 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        Editar
                      </button>
                      <button 
                        onClick={() => confirmarEliminacion(item.id)}
                        className="text-red-600 bg-red-50 hover:bg-red-100 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ml-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        Eliminar
                      </button>

                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* COMPONENTES FLOTANTES DE INTERFAZ (FUERA DE LAS TARJETAS) */}
        {/* ========================================================= */}

        {/* 1. NOTIFICACIÓN FLOTANTE ANIMADA (Centrada en la parte superior) */}
        <div className={`fixed top-24 left-1/2 z-[100] transform -translate-x-1/2 transition-all duration-500 ${notificacion.visible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white font-bold ${notificacion.tipo === 'exito' ? 'bg-green-600' : 'bg-red-600'}`}>
            {notificacion.tipo === 'exito' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            )}
            {notificacion.mensaje}
          </div>
        </div>

        {/* 2. MODAL OSCURO DE CONFIRMACIÓN DE ELIMINACIÓN */}
        {modalEliminar.visible && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="text-xl font-black text-center text-gray-900 mb-2">¿Eliminar refacción?</h3>
              <p className="text-center text-gray-500 text-sm mb-8 font-medium">Esta acción es permanente. La pieza desaparecerá de tu almacén local y del catálogo global.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setModalEliminar({ visible: false, idProducto: null })} 
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={ejecutarEliminacion} 
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}