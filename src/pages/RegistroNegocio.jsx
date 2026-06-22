import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function RegistroNegocio() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  
  // Nuevos campos en el estado
  const [formData, setFormData] = useState({ 
    nombre: '', rfc: '', telefono: '', direccion: '' 
  });
  
  // Estados para los archivos
  const [archivoCSF, setArchivoCSF] = useState(null);
  const [archivoINE, setArchivoINE] = useState(null);

  const [estado, setEstado] = useState('formulario'); // 'formulario', 'cargando', 'exito', 'error'
  const [mensajeError, setMensajeError] = useState('');

  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaG50cXNhYndjYnVsbmFwZmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjYyNDYsImV4cCI6MjA5NTUwMjI0Nn0.8YqiYDidhvZc-n0VInSPy0XxvqYFgWz5fEijnDh6K_o';

  useEffect(() => {
    const datosUsuarioJson = localStorage.getItem('user_data');
    if (datosUsuarioJson && datosUsuarioJson !== "undefined") {
      setUsuario(JSON.parse(datosUsuarioJson));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Función para subir archivos a Supabase Storage
  const subirDocumentoASupabase = async (file, tipo) => {
    if (!file) return null;
    
    // 1. Recuperamos la llave maestra (Token) del usuario que inició sesión
    const sessionToken = localStorage.getItem('session_token');
    
    const extension = file.name.split('.').pop();
    const nombreUnico = `${usuario.id}-${tipo}-${Date.now()}.${extension}`;
    const urlUpload = `https://rdhntqsabwcbulnapfcg.supabase.co/storage/v1/object/documentos_negocio/${nombreUnico}`;
    
    const response = await fetch(urlUpload, {
      method: 'POST',
      headers: { 
        // 2. Usamos el token real del usuario en lugar de la llave anónima
        'Authorization': `Bearer ${sessionToken}`, 
        'apikey': SUPABASE_ANON_KEY, // Se manda como respaldo
        'Content-Type': file.type 
      },
      body: file
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Detalle del error Supabase:", errorData);
      throw new Error(`Error al subir el documento ${tipo}`);
    }
    
    return `https://rdhntqsabwcbulnapfcg.supabase.co/storage/v1/object/public/documentos_negocio/${nombreUnico}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivoCSF || !archivoINE) {
      setMensajeError("Por favor adjunta la Constancia Fiscal y la INE para verificar tu negocio.");
      return;
    }

    setEstado('cargando');
    setMensajeError('');

    try {
      // 1. Subimos los documentos primero
      const urlCSF = await subirDocumentoASupabase(archivoCSF, 'CSF');
      const urlINE = await subirDocumentoASupabase(archivoINE, 'INE');

      // 2. Armamos el paquete completo para Java
     // 2. Armamos el paquete completo para Java
      const payload = {
        nombre: formData.nombre,
        rfc: formData.rfc,
        telefono: formData.telefono,
        calle: formData.calle,
        numero: formData.numero,
        colonia: formData.colonia,
        
        // ¡CORRECCIÓN AQUÍ! Quitamos el guion bajo y usamos mayúscula
        codigoPostal: formData.cp, 
        ciudad: formData.ciudad,
        
        // ¡CORRECCIÓN AQUÍ! Quitamos el guion bajo y usamos mayúscula
        estadoRep: formData.estado_rep, 
        
        propietario_id: usuario.id,
        doc_csf_url: urlCSF,
        doc_ine_url: urlINE
      };

      // 3. Enviamos a Spring Boot
      const response = await fetch('http://localhost:8080/api/establecimientos/solicitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setEstado('exito');
      } else {
        throw new Error('No se pudo enviar la solicitud al servidor.');
      }
    } catch (error) {
      setMensajeError(error.message);
      setEstado('error');
    }
  };

  if (!usuario) return null;

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
            <form className="space-y-8" onSubmit={handleSubmit}>
              
              {estado === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  {mensajeError}
                </div>
              )}

              {/* SECCIÓN 1: DATOS BÁSICOS */}
              <div>
                <h3 className="text-lg font-black text-gray-900 border-b border-gray-200 pb-2 mb-4">1. Información del Negocio</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Nombre de la Refaccionaria</label>
                    <input type="text" required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue transition-all" placeholder="Ej. Autopartes El Rápido" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">RFC del Negocio</label>
                    <input type="text" required value={formData.rfc} onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue transition-all uppercase" placeholder="ABCD123456EF7" maxLength={13} />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: CONTACTO Y UBICACIÓN */}
              <div>
  <h3 className="text-lg font-black text-gray-900 border-b border-gray-200 pb-2 mb-4 mt-6">2. Contacto y Ubicación</h3>
  
  <div className="mb-4">
    <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Teléfono de Mostrador</label>
    <input type="tel" required value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="w-full sm:w-1/2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue transition-all" placeholder="Ej. 55 1234 5678" />
  </div>

  {/* GRID DE DIRECCIÓN SEPARADA */}
  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-200">
    <div className="md:col-span-4">
      <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Calle o Avenida</label>
      <input type="text" required value={formData.calle} onChange={(e) => setFormData({ ...formData, calle: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue" placeholder="Ej. Av. Universidad" />
    </div>
    <div className="md:col-span-2">
      <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Número</label>
      <input type="text" required value={formData.numero} onChange={(e) => setFormData({ ...formData, numero: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue" placeholder="Ej. 123 Int B" />
    </div>
    
    <div className="md:col-span-3">
      <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Colonia</label>
      <input type="text" required value={formData.colonia} onChange={(e) => setFormData({ ...formData, colonia: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue" placeholder="Ej. Centro" />
    </div>
    <div className="md:col-span-3">
      <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Código Postal</label>
      <input type="text" required value={formData.cp} onChange={(e) => setFormData({ ...formData, cp: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue" placeholder="Ej. 50000" maxLength={5} />
    </div>

    <div className="md:col-span-3">
      <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Ciudad / Municipio</label>
      <input type="text" required value={formData.ciudad} onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue" placeholder="Ej. Toluca" />
    </div>
    <div className="md:col-span-3">
      <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Estado</label>
      <select required value={formData.estado_rep} onChange={(e) => setFormData({ ...formData, estado_rep: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue">
        <option value="">Selecciona un estado...</option>
        <option value="CDMX">Ciudad de México</option>
        <option value="Estado de México">Estado de México</option>
        <option value="Jalisco">Jalisco</option>
        <option value="Nuevo León">Nuevo León</option>
        {/* ... puedes agregar más ... */}
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
                    <p className="text-xs text-gray-500 mb-2">Sube tu PDF o imagen reciente.</p>
                    <input type="file" accept=".pdf,image/*" onChange={(e) => setArchivoCSF(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-white file:text-autoblue hover:file:bg-blue-100" />
                  </div>
                  <div className="pt-4 border-t border-blue-200">
                    <label className="block text-sm font-bold text-gray-900 mb-1">Identificación Oficial (INE)</label>
                    <p className="text-xs text-gray-500 mb-2">Sube foto de la INE del representante legal (Frente y reverso en una sola imagen/PDF).</p>
                    <input type="file" accept=".pdf,image/*" onChange={(e) => setArchivoINE(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-white file:text-autoblue hover:file:bg-blue-100" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={estado === 'cargando'} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-sm font-black text-white bg-autoblue hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-autoblue transition-colors">
                {estado === 'cargando' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Cifrando y enviando documentos...
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