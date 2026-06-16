import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// --- DICCIONARIOS LOCALES ---
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
// INICIO DEL COMPONENTE PRINCIPAL
// =====================================================================
export default function StoreDashboard() {
  
  // 1. LECTURA DEL USUARIO
  let usuarioLogueado = null;
  try {
    const datosUsuarioJson = localStorage.getItem('user_data');
    if (datosUsuarioJson && datosUsuarioJson !== "undefined") {
      usuarioLogueado = JSON.parse(datosUsuarioJson);
    }
  } catch (error) {
    console.warn("Datos de usuario corruptos, usando sesión de respaldo.");
  }
  const ESTABLECIMIENTO_ID = usuarioLogueado?.user_metadata?.establecimiento_id || '08440253-dabf-41b3-b30d-babf48f7974f';
  
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaG50cXNhYndjYnVsbmFwZmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjYyNDYsImV4cCI6MjA5NTUwMjI0Nn0.8YqiYDidhvZc-n0VInSPy0XxvqYFgWz5fEijnDh6K_o'; 

  // 2. ESTADOS GENERALES
  const [activeTab, setActiveTab] = useState('catalog');
  const [showForm, setShowForm] = useState(false);
  const [inventarioLocal, setInventarioLocal] = useState([]);
  const [inventarioGlobal, setInventarioGlobal] = useState([]); // <-- NUEVO: Para espiar a la competencia
  const [cargando, setCargando] = useState(true);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [idEdicion, setIdEdicion] = useState(null);

  const navigate = useNavigate();

  // 3. ESTADOS DE UI ANIMADA
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'exito' });
  const [modalEliminar, setModalEliminar] = useState({ visible: false, idProducto: null });

  // 4. ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    categoria: 'Motor', marca: '', nombre_comercial: '', descripcion: '',
    fabricante_original: '', nivel_calidad: 'Premium', tiempo_duracion: '',
    stock: 1, precio_lista: 0, precio_oferta: 0, establecimiento_id: ESTABLECIMIENTO_ID,
    tipo_vehiculo: 'Auto', marca_vehiculo: '', modelo: '', anio_vehiculo: '', imagen_url: ''
  });

  // --- FUNCIONES DE LÓGICA ---
  const mostrarNotificacion = (mensaje, tipo = 'exito') => {
    setNotificacion({ visible: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ visible: false, mensaje: '', tipo: 'exito' }), 3500);
  };

  // NUEVO: Función doble para traer lo local y lo global al mismo tiempo
  const cargarInventarios = async () => {
    try {
      const [resLocal, resGlobal] = await Promise.all([
        fetch(`http://localhost:8080/api/inventario/tienda/${ESTABLECIMIENTO_ID}`),
        fetch('http://localhost:8080/api/inventario/todos')
      ]);

      if (resLocal.ok) setInventarioLocal(await resLocal.json());
      if (resGlobal.ok) setInventarioGlobal(await resGlobal.json());
      
    } catch (error) {
      console.error("Error al cargar inventarios:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarInventarios();
  }, []);

  const cargarDatosParaEdicion = (item) => {
    setIdEdicion(item.id);
    setImagenSeleccionada(null);
    setFormData({
      categoria: item.pieza?.categoria || 'Motor', marca: item.pieza?.marca || '',
      nombre_comercial: item.pieza?.nombre_comercial || '', descripcion: item.pieza?.descripcion || '',
      nivel_calidad: item.pieza?.nivel_calidad || 'Premium', stock: item.stock || 1,
      precio_lista: item.precio_lista || 0, precio_oferta: item.precio_oferta || 0,
      establecimiento_id: ESTABLECIMIENTO_ID, tipo_vehiculo: item.pieza?.tipo_vehiculo || 'Auto',
      marca_vehiculo: item.pieza?.marca_vehiculo || '', modelo: item.pieza?.modelo || '',
      anio_vehiculo: item.pieza?.anio_vehiculo || '', imagen_url: item.pieza?.imagen_url || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const ejecutarEliminacion = async () => {
    const id = modalEliminar.idProducto;
    setModalEliminar({ visible: false, idProducto: null });
    try {
      const response = await fetch(`http://localhost:8080/api/inventario/eliminar/${id}`, { method: 'DELETE' });
      if (response.ok) {
        mostrarNotificacion("Producto eliminado del inventario.");
        cargarInventarios(); // Recargamos ambos para mantener todo sincronizado
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
      headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': file.type },
      body: file
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || "Rechazado por Supabase Storage");
    }
    return `https://rdhntqsabwcbulnapfcg.supabase.co/storage/v1/object/public/refaccionarias/${nombreUnico}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let urlFinalImagen = formData.imagen_url;
      if (imagenSeleccionada) {
        mostrarNotificacion("Subiendo imagen a la nube...");
        urlFinalImagen = await subirImagenASupabase(imagenSeleccionada);
      }
      const payloadCompleto = { ...formData, imagen_url: urlFinalImagen };
      const urlFetch = idEdicion ? `http://localhost:8080/api/inventario/actualizar/${idEdicion}` : 'http://localhost:8080/api/inventario/agregar';
      const metodoFetch = idEdicion ? 'PUT' : 'POST';
      
      const response = await fetch(urlFetch, {
        method: metodoFetch,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadCompleto)
      });

      if (response.ok) {
        mostrarNotificacion(idEdicion ? "¡Producto actualizado correctamente!" : "¡Refacción guardada exitosamente!");
        setShowForm(false); setIdEdicion(null); setImagenSeleccionada(null);
        setFormData({
          categoria: 'Motor', marca: '', nombre_comercial: '', descripcion: '', fabricante_original: '',
          nivel_calidad: 'Premium', tiempo_duracion: '', stock: 1, precio_lista: 0, precio_oferta: 0,
          establecimiento_id: ESTABLECIMIENTO_ID, tipo_vehiculo: 'Auto', marca_vehiculo: '', modelo: '', anio_vehiculo: '', imagen_url: ''
        });
        cargarInventarios();
      } else {
        mostrarNotificacion("Error en el servidor de Java.", "error");
      }
    } catch (error) {
      mostrarNotificacion("Error: " + error.message, "error");
    }
  };

  // --- RENDERIZADO HTML ---
  return (
    <div className="py-10 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mostrador Digital</h1>
            <p className="text-gray-500 font-medium mt-1">Autopartes Express — <span className="text-autoblue font-bold">Sucursal Activa</span></p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
              Terminal Sincronizada Automática
            </span>
          </div>
        </div>

        {/* PESTAÑAS AMPLIADAS */}
        <div className="flex border-b border-gray-200 mb-6 gap-4 overflow-x-auto">
          <button onClick={() => setActiveTab('orders')} className={`py-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap ${activeTab === 'orders' ? 'border-autoblue text-autoblue' : 'border-transparent text-gray-500'}`}>
            Cotizaciones Entrantes
          </button>
          <button onClick={() => setActiveTab('catalog')} className={`py-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap ${activeTab === 'catalog' ? 'border-autoblue text-autoblue' : 'border-transparent text-gray-500'}`}>
            Mi Inventario Local
          </button>
          {/* NUEVA PESTAÑA */}
          <button onClick={() => setActiveTab('global')} className={`py-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap ${activeTab === 'global' ? 'border-autoblue text-autoblue' : 'border-transparent text-gray-500'}`}>
            Explorar Competencia
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL: INVENTARIO LOCAL */}
        {activeTab === 'catalog' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-900">Gestión de Stock Real</h3>
              <button onClick={() => {
                setShowForm(!showForm);
                if(showForm) setIdEdicion(null);
              }} className={`border-2 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 ${showForm ? 'border-gray-300 text-gray-500' : 'border-autoblue text-autoblue'}`}>
                {showForm ? 'Cancelar' : '+ Agregar Nueva Pieza'}
              </button>
            </div>

            {/* FORMULARIO */}
            {showForm && (
              <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-6 shadow-inner border-t-4 border-t-autoblue">
                <div>
                  <h4 className="text-sm font-bold text-autoblue mb-3 border-b pb-1">1. Datos de la Refacción</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Tipo de Pieza</label>
                      <select name="categoria" value={formData.categoria} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
                        <option value="Motor">Motor (Bujías, Bandas)</option><option value="Suspensión">Suspensión y Dirección</option><option value="Frenos">Frenos</option><option value="Transmisión">Transmisión</option><option value="Filtros">Filtros</option><option value="Eléctrico">Eléctrico</option><option value="Carrocería">Carrocería</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Marca de la Pieza</label>
                      <select name="marca" value={formData.marca} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
                        <option value="">Selecciona marca...</option>{marcasRefacciones.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Nombre Comercial</label>
                      <input type="text" name="nombre_comercial" value={formData.nombre_comercial} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="Ej. Balatas" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-autoblue mb-3 border-b pb-1">2. Compatibilidad del Vehículo</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Tipo de Vehículo</label>
                      <select name="tipo_vehiculo" value={formData.tipo_vehiculo} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
                        <option value="Auto">Auto / Sedán</option><option value="Camioneta">Camioneta / SUV</option><option value="Motocicleta">Motocicleta</option><option value="Universal">Universal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Marca Vehículo</label>
                      <select name="marca_vehiculo" value={formData.marca_vehiculo} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
                        <option value="">Selecciona marca...</option>{Object.keys(vehiculosDb).map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Modelo</label>
                      <select name="modelo" value={formData.modelo} onChange={handleInputChange} required disabled={!formData.marca_vehiculo} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm disabled:bg-gray-100">
                        <option value="">Selecciona modelo...</option>{formData.marca_vehiculo && vehiculosDb[formData.marca_vehiculo].map(mod => <option key={mod} value={mod}>{mod}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-500 mb-1">Año</label>
                      <select name="anio_vehiculo" value={formData.anio_vehiculo} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
                        <option value="">Selecciona año...</option>{aniosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

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
                        <option value="Premium">Premium</option><option value="Original OEM">Original OEM</option><option value="Económica">Económica</option><option value="Genérica">Genérica</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1">Fotografía (Opcional)</label>
                    <input type="file" accept="image/*" onChange={(e) => setImagenSeleccionada(e.target.files[0])} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm" />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button type="submit" className="bg-autoblue hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">
                    {idEdicion ? 'Actualizar Producto en BD' : 'Sincronizar a Base de Datos'}
                  </button>
                </div>
              </form>
            )}

            {/* MAPEO DE TARJETAS LOCALES */}
            {cargando ? (
              <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Cargando inventario...</div>
            ) : inventarioLocal.length === 0 ? (
              <div className="p-8 text-center text-gray-500 border-2 border-dashed rounded-xl">No hay piezas registradas en esta sucursal.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventarioLocal.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:border-autoblue transition-colors group bg-gray-100 shadow-sm">
                    <div className="flex gap-4">
                      {item.pieza?.imagen_url ? (
                        <img src={item.pieza.imagen_url} alt={item.pieza.nombre_comercial} className="w-16 h-16 object-cover rounded-lg border border-gray-100 bg-gray-50" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center text-gray-400 font-black text-xl border border-gray-200">
                          {item.pieza?.nombre_comercial?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-autoblue transition-colors">{item.pieza?.nombre_comercial}</p>
                        <p className="text-gray-500 text-xs mt-1 font-medium">{item.pieza?.marca} • {item.pieza?.modelo}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <p className={`font-bold text-xs px-2 py-0.5 rounded inline-block ${item.stock === 0 ? 'bg-red-100 text-red-600' : item.stock <= 5 ? 'bg-orange-100 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                            Stock: {item.stock}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase font-black text-gray-500">Precio Oferta</p>
                        <p className="font-black text-red-600 text-lg">${item.precio_oferta}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => cargarDatosParaEdicion(item)} className="text-blue-600 bg-white border border-gray-200 hover:bg-blue-50 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1">
                          Editar
                        </button>
                        <button onClick={() => confirmarEliminacion(item.id)} className="text-red-600 bg-white border border-gray-200 hover:bg-red-50 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CONTENIDO PRINCIPAL: CATÁLOGO GLOBAL (NUEVO) */}
        {activeTab === 'global' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fade-in">
            <h3 className="font-bold text-lg text-gray-900 mb-1">Catálogo Global</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">Monitorea los precios del mercado y administra tus propias publicaciones.</p>

            {cargando ? (
              <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Cargando catálogo mundial...</div>
            ) : inventarioGlobal.length === 0 ? (
              <div className="p-8 text-center text-gray-500 border-2 border-dashed rounded-xl">El catálogo global está vacío.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventarioGlobal.map((item) => {
                  const esMia = item.establecimiento_id === ESTABLECIMIENTO_ID;

                  return (
                    <div key={item.id} className={`border rounded-lg p-4 flex flex-col justify-between transition-colors shadow-sm ${esMia ? 'border-autoblue bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <div className="flex gap-4">
                        {item.pieza?.imagen_url ? (
                          <img src={item.pieza.imagen_url} alt={item.pieza.nombre_comercial} className="w-16 h-16 object-cover rounded-lg border border-gray-100 bg-gray-50" />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 font-black text-xl border border-gray-200">
                            {item.pieza?.nombre_comercial?.charAt(0)}
                          </div>
                        )}
                        <div>
                          {esMia && <span className="bg-autoblue text-white text-[9px] font-black uppercase px-2 py-0.5 rounded mb-1 inline-block">Tu Publicación</span>}
                          <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{item.pieza?.nombre_comercial}</p>
                          <p className="text-gray-500 text-xs mt-1 font-medium">{item.pieza?.marca} • {item.pieza?.modelo}</p>
                        </div>
                      </div>
                      
                      <div className={`mt-4 pt-4 border-t flex justify-between items-end ${esMia ? 'border-blue-200' : 'border-gray-100'}`}>
                        <div>
                          <p className="text-[10px] uppercase font-black text-gray-500">Precio Público</p>
                          <p className="font-black text-gray-900 text-lg">${item.precio_oferta}</p>
                        </div>
                        
                        {/* BOTÓN INTELIGENTE: Si es tuya, editas; si es de competencia, solo ves detalles */}
                        {esMia ? (
                          <button 
                            onClick={() => { setActiveTab('catalog'); cargarDatosParaEdicion(item); }} 
                            className="text-autoblue bg-white border border-autoblue hover:bg-blue-100 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                          >
                            Editar Mi Pieza
                          </button>
                        ) : (
                          <Link 
                            to={`/producto/${item.id}`} 
                            className="text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                          >
                            Ver Competencia
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MODAL Y NOTIFICACIÓN (GLOBALES) */}
        <div className={`fixed top-24 left-1/2 z-[100] transform -translate-x-1/2 transition-all duration-500 ${notificacion.visible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white font-bold ${notificacion.tipo === 'exito' ? 'bg-green-600' : 'bg-red-600'}`}>
            {notificacion.mensaje}
          </div>
        </div>

        {modalEliminar.visible && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all">
              <h3 className="text-xl font-black text-center text-gray-900 mb-2">¿Eliminar refacción?</h3>
              <p className="text-center text-gray-500 text-sm mb-8 font-medium">Esta acción es permanente.</p>
              <div className="flex gap-3">
                <button onClick={() => setModalEliminar({ visible: false, idProducto: null })} className="flex-1 px-4 py-3 bg-gray-100 font-bold rounded-xl hover:bg-gray-200">Cancelar</button>
                <button onClick={ejecutarEliminacion} className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700">Sí, eliminar</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}