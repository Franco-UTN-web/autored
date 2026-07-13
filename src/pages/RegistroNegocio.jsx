import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MapaSelector from '../components/MapaAutoRed';

export default function RegistroNegocio() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  
  const [formData, setFormData] = useState({ 
    nombre: '', rfc: '', telefono: '', 
    calle: '', numero: '', colonia: '', cp: '', ciudad: '', estado_rep: '' 
  });
  
  const [archivoCSF, setArchivoCSF] = useState(null);
  const [archivoINE, setArchivoINE] = useState(null);

  const [estado, setEstado] = useState('formulario'); 
  const [mensajeError, setMensajeError] = useState('');
  const [campoActivo, setCampoActivo] = useState('');
  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);

 

  useEffect(() => {
    const datosUsuarioJson = localStorage.getItem('user_data');
    if (datosUsuarioJson && datosUsuarioJson !== "undefined") {
      setUsuario(JSON.parse(datosUsuarioJson));
    } else {
      navigate('/login');
    }
  }, [navigate]);

 const subirDocumentoASupabase = async (file, tipo) => {
    if (!file) return null;
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Hablamos con nuestro Java y le decimos que va a la carpeta 'documentos_negocio'
    const response = await fetch('https://backautored-production.up.railway.app/api/archivos/subir?carpeta=documentos_negocio', {
      method: 'POST',
      body: formData 
    });

    if (!response.ok) throw new Error(`Error del servidor al subir el documento ${tipo}`);
    
    const data = await response.json();
    return data.url; 
  };

  const validarFormulario = () => {
    // Validaciones estrictas por JavaScript
    if (!formData.nombre.trim()) { setMensajeError("Falta ingresar el Nombre de la Refaccionaria."); return false; }
    if (!formData.rfc.trim()) { setMensajeError("Falta ingresar el RFC."); return false; }
    
    const telRegex = /^\d{10}$/;
    const telLimpio = formData.telefono.replace(/\s+/g, ''); 
    if (!telRegex.test(telLimpio)) {
      setMensajeError("El teléfono debe tener exactamente 10 dígitos numéricos.");
      return false;
    }

    const rfcRegex = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
    if (!rfcRegex.test(formData.rfc.toUpperCase())) {
      setMensajeError("El RFC ingresado no tiene un formato válido para México.");
      return false;
    }

    const cpRegex = /^\d{5}$/;
    if (!cpRegex.test(formData.cp)) {
      setMensajeError("El Código Postal debe ser de exactamente 5 dígitos numéricos.");
      return false;
    }

    if (!formData.calle.trim() || !formData.numero.trim() || !formData.colonia.trim() || !formData.ciudad.trim() || !formData.estado_rep) {
      setMensajeError("Por favor, completa todos los campos de la dirección.");
      return false;
    }

    if (!archivoCSF || !archivoINE) {
      setMensajeError("Por favor adjunta la Constancia Fiscal y la INE.");
      return false;
    }

    const MAX_SIZE = 5 * 1024 * 1024; 
    if (archivoCSF.size > MAX_SIZE || archivoINE.size > MAX_SIZE) {
      setMensajeError("Los documentos son muy pesados. El tamaño máximo por archivo es de 5MB.");
      return false;
    }

    return true; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError('');

    if (!validarFormulario()) {
      setEstado('error');
      return;
    }

    setEstado('cargando');

    try {
      const urlCSF = await subirDocumentoASupabase(archivoCSF, 'CSF');
      const urlINE = await subirDocumentoASupabase(archivoINE, 'INE');

      const payload = {
        nombre: formData.nombre,
        rfc: formData.rfc.trim().toUpperCase(),
        telefono: formData.telefono.replace(/\s+/g, ''),
        calle: formData.calle,
        numero: formData.numero,
        colonia: formData.colonia,
        codigoPostal: formData.cp, 
        ciudad: formData.ciudad,
        estadoRep: formData.estado_rep, 
        propietario_id: usuario.id,
        doc_csf_url: urlCSF,
        doc_ine_url: urlINE,
        latitud: latitud,
        longitud: longitud
      };

      const response = await fetch('https://backautored-production.up.railway.app/api/establecimientos/solicitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setEstado('exito');
      } else {
        throw new Error('Tu servidor de Spring Boot rechazó la solicitud o está apagado. Verifica tu consola de Java.');
      }
    } catch (error) {
      setMensajeError(error.message);
      setEstado('error');
    }
  };

  if (!usuario) return null;

  const InfoIcon = () => (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <Link to="/inicio" className="flex justify-center mb-6">
          <img src="/logo.jpeg" alt="AutoRed" className="h-12 object-contain" />
        </Link>
        <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">
          Únete a la Red de Distribuidores
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-medium px-4">
          Para garantizar la seguridad de la red AutoRed, requerimos validar la identidad y ubicación de todos nuestros socios comerciales.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-xl border border-gray-200 sm:rounded-2xl sm:px-10">
          
          {estado === 'exito' ? (
            <div className="text-center animate-fade-in py-8">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">¡Documentación Recibida!</h3>
              <p className="text-gray-500 font-medium mb-8 max-w-md mx-auto">
                Hemos recibido los datos y documentos de <span className="font-bold text-gray-800">{formData.nombre}</span>. Nuestro equipo de auditoría validará tu información en un plazo de 24 a 48 horas.
              </p>
              <button onClick={() => navigate('/inicio')} className="w-full sm:w-auto bg-autoblue hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                Volver al Inicio
              </button>
            </div>
          ) : (
            <form className="space-y-8" onSubmit={handleSubmit} noValidate>
              
              {/* SECCIÓN 1: DATOS BÁSICOS */}
              <div>
                <h3 className="text-lg font-black text-gray-900 border-b border-gray-200 pb-2 mb-4">1. Información del Negocio</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Nombre de la Refaccionaria</label>
                    <input 
                      type="text" value={formData.nombre} 
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} 
                      onFocus={() => setCampoActivo('nombre')} onBlur={() => setCampoActivo('')}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue transition-all" placeholder="Ej. Autopartes El Rápido" 
                    />
                    {campoActivo === 'nombre' && (
                      <p className="text-xs text-autoblue font-bold mt-1 animate-fade-in flex items-center gap-1.5"><InfoIcon /> Ingresa el nombre comercial oficial.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">RFC del Negocio</label>
                    <input 
                      type="text" value={formData.rfc} 
                      onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })} 
                      onFocus={() => setCampoActivo('rfc')} onBlur={() => setCampoActivo('')}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue transition-all uppercase" placeholder="ABCD123456EF7" maxLength={13} 
                    />
                    {campoActivo === 'rfc' && (
                      <p className="text-xs text-autoblue font-bold mt-1 animate-fade-in flex items-center gap-1.5"><InfoIcon /> Registro SAT: 12 o 13 caracteres.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: CONTACTO Y UBICACIÓN */}
              <div>
                <h3 className="text-lg font-black text-gray-900 border-b border-gray-200 pb-2 mb-4 mt-6">2. Contacto y Ubicación</h3>
                
                <div className="mb-4">
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Teléfono de Mostrador (10 dígitos)</label>
                  <input 
                    type="tel" value={formData.telefono} 
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} 
                    onFocus={() => setCampoActivo('telefono')} onBlur={() => setCampoActivo('')}
                    className="w-full sm:w-1/2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue transition-all" placeholder="Ej. 5512345678" maxLength={10} 
                  />
                  {campoActivo === 'telefono' && (
                    <p className="text-xs text-autoblue font-bold mt-1 animate-fade-in flex items-center gap-1.5"><InfoIcon /> Número a 10 dígitos sin espacios.</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                  
                  <div className="md:col-span-4">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Calle o Avenida</label>
                    <input 
                      type="text" 
                      value={formData.calle || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, calle: e.target.value }))} 
                      onFocus={() => setCampoActivo('calle')} onBlur={() => setCampoActivo('')}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue" placeholder="Ej. Av. Universidad" 
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Número</label>
                    <input 
                      type="text" 
                      value={formData.numero || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))} 
                      onFocus={() => setCampoActivo('numero')} onBlur={() => setCampoActivo('')}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue" placeholder="Ej. 123 Int B" 
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Colonia</label>
                    <input 
                      type="text" 
                      value={formData.colonia || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, colonia: e.target.value }))} 
                      onFocus={() => setCampoActivo('colonia')} onBlur={() => setCampoActivo('')}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue" placeholder="Ej. Centro" 
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Código Postal</label>
                    <input 
                      type="text" 
                      value={formData.cp || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, cp: e.target.value }))} 
                      onFocus={() => setCampoActivo('cp')} onBlur={() => setCampoActivo('')}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue" placeholder="Ej. 50000" maxLength={5} 
                    />
                  </div>

                 {/* MAPA A TAMAÑO COMPLETO */}
             <div className="md:col-span-6 w-full my-2">
               <MapaSelector 
               onCoordenadasSeleccionadas={(lat, lng) => {
               setLatitud(lat);
               setLongitud(lng);
                }}
            onDireccionEncontrada={(datosMapa) => {
              setFormData(prev => ({
              ...prev,
        calle: datosMapa.calle,
        numero: datosMapa.numero,
        colonia: datosMapa.colonia,
        cp: datosMapa.cp,
        ciudad: datosMapa.ciudad,
        estado_rep: datosMapa.estado_rep 
      }));
    }}
  />
</div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Ciudad / Municipio</label>
                    <input 
                      type="text" 
                      value={formData.ciudad || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, ciudad: e.target.value }))} 
                      onFocus={() => setCampoActivo('ciudad')} onBlur={() => setCampoActivo('')}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue" placeholder="Ej. Toluca" 
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Estado</label>
                    <select 
                      value={formData.estado_rep || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, estado_rep: e.target.value }))} 
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue cursor-pointer"
                    >
                      <option value="">Selecciona un estado...</option>
                      <option value="Aguascalientes">Aguascalientes</option>
                      <option value="Ciudad de México">Ciudad de México</option>
                      <option value="Estado de México">Estado de México</option>
                      <option value="Jalisco">Jalisco</option>
                      <option value="Nuevo León">Nuevo León</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: DOCUMENTACIÓN ANTI-FRAUDE */}
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="text-lg font-black text-autoblue mb-4">3. Documentación de Validación</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Constancia de Situación Fiscal (SAT)</label>
                    <input type="file" accept=".pdf,image/*" onChange={(e) => setArchivoCSF(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-white file:text-autoblue hover:file:bg-blue-100" />
                  </div>
                  <div className="pt-4 border-t border-blue-200">
                    <label className="block text-sm font-bold text-gray-900 mb-1">Identificación Oficial (INE)</label>
                    <input type="file" accept=".pdf,image/*" onChange={(e) => setArchivoINE(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-white file:text-autoblue hover:file:bg-blue-100" />
                  </div>
                </div>
              </div>

              {/* === CUADRO DE ERROR MUDADO AQUÍ ABAJO === */}
              {estado === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-3 shadow-sm">
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  {mensajeError}
                </div>
              )}

              <button type="submit" disabled={estado === 'cargando'} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-sm font-black text-white bg-autoblue hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-autoblue transition-colors disabled:opacity-50">
                {estado === 'cargando' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Enviando solicitud a los servidores...
                  </span>
                ) : (
                  "Enviar Solicitud de Registro"
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}