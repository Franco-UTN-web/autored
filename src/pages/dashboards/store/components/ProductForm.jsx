import React, { useState, useEffect } from 'react';

// DICCIONARIOS LOCALES
const vehiculosDb = {
  "Nissan": ["Versa", "Sentra", "Tsuru", "March", "NP300", "Kicks", "Tiida"],
  "Volkswagen": ["Jetta", "Golf", "Vento", "Polo", "Saveiro", "Tiguan", "Vocho"],
  "Chevrolet": ["Chevy", "Aveo", "Spark", "Silverado", "Beat", "Tracker", "Onix"],
  "Ford": ["Fiesta", "Focus", "Figo", "Ranger", "Explorer", "F-150", "Mustang"],
  "Toyota": ["Yaris", "Corolla", "Camry", "Hilux", "RAV4", "Avanza"],
  "Honda": ["Civic", "City", "CR-V", "Accord", "HR-V"],
  "Universal": ["Aplica para cualquier modelo"]
};
const aniosDisponibles = ["Todos los años", ...Array.from(new Array(37), (val, index) => (new Date().getFullYear() + 1) - index).map(String)];
const marcasRefacciones = ["Bosch", "Brembo", "Gates", "LUK", "Valeo", "ACDelco", "Castrol", "KYB", "NGK", "Genérica"];

export default function ProductForm({ miEstablecimiento, itemAEditar, onClose, onSuccess, mostrarNotificacion }) {
  const [cargando, setCargando] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const idEdicion = itemAEditar?.id || null;
  
  const [formData, setFormData] = useState({
    categoria: 'Motor', marca: '', nombre_comercial: '', descripcion: '',
    nivel_calidad: 'Premium', stock: 1, precio_lista: 0, precio_oferta: 0, 
    establecimiento_id: miEstablecimiento?.id, 
    tipo_vehiculo: 'Auto', marca_vehiculo: '', modelo: '', anio_vehiculo: '', 
    numero_parte: '', condicion: 'Nueva', garantia: 'Sin garantía', imagen_url: ''
  });

  // Si nos pasan un itemAEditar, llenamos el formulario automáticamente
  useEffect(() => {
    if (itemAEditar) {
      setFormData({
        categoria: itemAEditar.pieza?.categoria || 'Motor', marca: itemAEditar.pieza?.marca || '',
        nombre_comercial: itemAEditar.pieza?.nombre_comercial || '', descripcion: itemAEditar.pieza?.descripcion || '',
        nivel_calidad: itemAEditar.pieza?.nivel_calidad || 'Premium', stock: itemAEditar.stock || 1,
        precio_lista: itemAEditar.precio_lista || 0, precio_oferta: itemAEditar.precio_oferta || 0,
        establecimiento_id: miEstablecimiento?.id, tipo_vehiculo: itemAEditar.pieza?.tipo_vehiculo || 'Auto',
        marca_vehiculo: itemAEditar.pieza?.marca_vehiculo || '', modelo: itemAEditar.pieza?.modelo || '',
        anio_vehiculo: itemAEditar.pieza?.anio_vehiculo || '', imagen_url: itemAEditar.pieza?.imagen_url || '',
        numero_parte: itemAEditar.pieza?.numero_parte || '', condicion: itemAEditar.pieza?.condicion || 'Nueva',
        garantia: itemAEditar.pieza?.garantia || 'Sin garantía' // Agregado fallback de garantía
      });
    }
  }, [itemAEditar, miEstablecimiento]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'marca_vehiculo') newData.modelo = '';
      return newData;
    });
  };

 const subirImagenASupabase = async (file) => {
    // Usamos FormData porque estamos enviando un archivo físico
    const formData = new FormData();
    formData.append('file', file);
    
    // Hablamos con NUESTRO servidor local en lugar de Supabase directo
    const response = await fetch('http://localhost:8080/api/archivos/subir', {
      method: 'POST',
      body: formData // No le ponemos Content-Type, el navegador lo calcula solo al ver un FormData
    });

    if (!response.ok) {
      throw new Error("El servidor no pudo procesar la imagen.");
    }
    
    const data = await response.json();
    return data.url; // Esto ya contiene la URL pública directa
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
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
        onSuccess();
      } else {
        mostrarNotificacion("Error en el servidor de Java.", "error");
      }
    } catch (error) {
      mostrarNotificacion("Error: " + error.message, "error");
    } finally {
      setCargando(false);
    }
  };

  // TU DISEÑO ORIGINAL, INTACTO
  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-6 shadow-inner border-t-4 border-t-autoblue animate-fade-in">
      
      {/* SECCIÓN 1: DATOS DE LA REFACCIÓN */}
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
            <input type="text" name="nombre_comercial" value={formData.nombre_comercial} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="Ej. Balatas" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-1">Número de Parte / OEM</label>
            <input type="text" name="numero_parte" value={formData.numero_parte} onChange={handleInputChange} required className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm uppercase" placeholder="Ej. 06H-103-483-D" />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-1">Condición de la Pieza</label>
            <select name="condicion" value={formData.condicion} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
              <option value="Nueva">Nueva (Caja sellada)</option>
              <option value="Usada">Usada (Buen estado/Yonke)</option>
              <option value="Reconstruida">Reconstruida (Remanufacturada)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-1">Garantía del Vendedor</label>
            <select name="garantia" value={formData.garantia} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
              <option value="Sin garantía">Sin garantía</option>
              <option value="15 días">15 días (Piezas eléctricas/Yonke)</option>
              <option value="1 mes">1 mes</option>
              <option value="3 meses">3 meses</option>
              <option value="6 meses">6 meses</option>
              <option value="1 año">1 año (Fábrica)</option>
            </select>
          </div>
        </div>
        
        {/* NUEVO CAMPO: DESCRIPCIÓN */}
        <div className="mt-4">
          <label className="block text-xs font-black uppercase text-gray-500 mb-1">Descripción Detallada <span className="lowercase font-normal text-autoblue">(Opcional)</span></label>
          <textarea name="descripcion" rows="2" value={formData.descripcion} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm resize-none" placeholder="Añade detalles sobre el material o instrucciones especiales..." />
        </div>
      </div>

      {/* SECCIÓN 2: COMPATIBILIDAD */}
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

      {/* SECCIÓN 3: PRECIOS */}
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
          <label className="block text-xs font-black uppercase text-gray-500 mb-1">Fotografía (Opcional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImagenSeleccionada(e.target.files[0])} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-lg text-sm transition-colors hover:bg-gray-300">
          Cancelar
        </button>
        <button type="submit" disabled={cargando} className="bg-autoblue hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50">
          {cargando ? 'Guardando...' : (idEdicion ? 'Actualizar Producto en BD' : 'Guardar Producto')}
        </button>
      </div>
    </form>
  );
}