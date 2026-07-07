import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../supabase'; 

export default function MiPerfil() {
  const [userId, setUserId] = useState(null);
  
  // Estados para datos de Negocio
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  
  // Estados para datos de Acceso
  const [correoActual, setCorreoActual] = useState('');
  const [correo, setCorreo] = useState('');
  const [passwordActual, setPasswordActual] = useState(''); // NUEVO: Contraseña actual
  const [nuevaPassword, setNuevaPassword] = useState(''); // NUEVO: Nueva contraseña
  
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    obtenerDatosUsuario();
  }, []);

  const obtenerDatosUsuario = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (user) {
        setUserId(user.id);
        setCorreoActual(user.email);
        setCorreo(user.email);
        
        const { data: perfil } = await supabase
          .from('perfiles')
          .select('nombre, apellido, telefono, fecha_nacimiento')
          .eq('id', user.id)
          .single();
          
        if (perfil) {
          setNombre(perfil.nombre || '');
          setApellido(perfil.apellido || '');
          setTelefono(perfil.telefono || '');
          setFechaNacimiento(perfil.fecha_nacimiento || ''); // Si es null, lo pone como '' para el input
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      // --- LÓGICA DE CONTRASEÑA ---
      if (nuevaPassword.trim() !== '') {
        if (passwordActual.trim() === '') {
          throw new Error("Debes ingresar tu contraseña actual para poder cambiarla.");
        }
        if (passwordActual === nuevaPassword) {
          throw new Error("La nueva contraseña no puede ser igual a la actual.");
        }

        // 1. Verificamos que la contraseña actual sea correcta haciendo un mini-login
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: correoActual,
          password: passwordActual
        });

        if (signInError) throw new Error("La contraseña actual es incorrecta.");

        // 2. Si es correcta, aplicamos la nueva
        const { error: updateError } = await supabase.auth.updateUser({
          password: nuevaPassword
        });

        if (updateError) throw new Error("Error al actualizar la contraseña: " + updateError.message);
      }

      // --- LÓGICA DE CORREO ---
      if (correo !== correoActual) {
        const { error: emailError } = await supabase.auth.updateUser({ email: correo });
        if (emailError) throw new Error("Error al actualizar correo: " + emailError.message);
      }

      // --- LÓGICA DE BACKEND (SPRING BOOT) ---
      const response = await fetch(`http://localhost:8080/api/perfiles/actualizar/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre,
          apellido: apellido,
          telefono: telefono,
          // SOLUCIÓN AL ERROR 500: Si está vacío, enviamos null, no una cadena vacía ""
          fecha_nacimiento: fechaNacimiento === '' ? null : fechaNacimiento
        })
      });

      if (!response.ok) throw new Error("Error al guardar en el servidor. Revisa los datos.");

      // Si todo sale bien:
      setMensaje({ tipo: 'exito', texto: '¡Tus datos se actualizaron correctamente!' });
      setPasswordActual(''); 
      setNuevaPassword(''); 
      setCorreoActual(correo);

    } catch (error) {
      console.error("Error en la petición:", error);
      setMensaje({ tipo: 'error', texto: error.message });
    } finally {
      setGuardando(false);
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
    }
  };

  if (cargando) return <div className="flex justify-center p-10 text-gray-500 animate-pulse">Cargando tu información...</div>;

  return (
    <div className="py-8 bg-gray-50 min-h-screen font-sans animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <h2 className="text-2xl font-black text-gray-900">Configuración de Cuenta</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">Gestiona tus datos personales y credenciales de acceso.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            
            {/* SECCIÓN DATOS PERSONALES */}
            <div>
              <h3 className="text-lg font-bold text-autoblue border-b border-gray-100 pb-2 mb-4">Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Apellidos</label>
                  <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="Tus apellidos" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Fecha de Nacimiento</label>
                  <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
                  <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="+52..." />
                </div>
              </div>
            </div>

            {/* SECCIÓN SEGURIDAD DE LA CUENTA */}
            <div>
              <h3 className="text-lg font-bold text-autoblue border-b border-gray-100 pb-2 mb-4">Seguridad de la Cuenta</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
                <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className="w-full max-w-md px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña Actual</label>
                  <input 
                    type="password" 
                    value={passwordActual} 
                    onChange={(e) => setPasswordActual(e.target.value)} 
                    className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" 
                    placeholder="Requerida para cambiar contraseña" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nueva Contraseña</label>
                  <input 
                    type="password" 
                    value={nuevaPassword} 
                    onChange={(e) => setNuevaPassword(e.target.value)} 
                    className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" 
                    placeholder="Mínimo 6 caracteres" 
                  />
                </div>
              </div>
            </div>

            {mensaje.texto && (
              <div className={`p-4 rounded-xl text-sm font-bold ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {mensaje.texto}
              </div>
            )}

            <div className="pt-4 flex justify-end border-t border-gray-100">
              <button type="submit" disabled={guardando} className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2.5 px-6 rounded-xl text-sm disabled:opacity-50">
                {guardando ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}