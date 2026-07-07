import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); 
  const [activeTab, setActiveTab] = useState('login'); 
  
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [campoActivo, setCampoActivo] = useState('');
  
  const navigate = useNavigate();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setErrorMsg('');

    // 🛡️ EXPLICACIÓN: Validación de formato de Correo (RegEx)
    // Utiliza una "Expresión Regular". Verifica que el texto no tenga espacios ([^\s@]), 
    // que contenga un arroba (@), seguido de más texto, un punto (\.), y el dominio (ej. com).
    // Si no cumple este patrón exacto, frena la función (return) y no gasta recursos del servidor.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Por favor, ingresa un correo electrónico válido.');
      setCargando(false);
      return; 
    }

    // 🛡️ EXPLICACIÓN: Validación de Contraseña Segura (RegEx)
    // Busca hacia adelante (?=) para asegurar que exista: al menos una mayúscula ([A-Z]), 
    // al menos un dígito (\d), y un símbolo especial. El .{6,}$ final asegura que mida 6 o más caracteres.
    // Previene el registro de contraseñas débiles como "123456".
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_.-]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres, incluir una letra mayúscula, un número y un carácter especial (ej. @, #, $, %).');
      setCargando(false);
      return; 
    }

    try {
      if (activeTab === 'signup') {
        
        // 🛡️ EXPLICACIÓN: Validación de Nombre Completo
        // .trim() limpia los espacios en blanco accidentales (o intencionales) al inicio y final.
        // Asegura que queden al menos 3 caracteres reales antes de permitir el registro.
        if (fullName.trim().length < 3) {
          throw new Error('Por favor, ingresa tu Nombre Completo (mínimo 3 letras).');
        }

        // 1. Intentamos crear el usuario en Supabase
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: { 
              nombre: fullName,
              full_name: fullName,
              role: 'comprador' 
            }
          }
        });

        if (error) throw error;

        // ==========================================
        // 🛡️ VALIDACIONES BACKEND (Supabase)
        // ==========================================

        // 🛡️ EXPLICACIÓN: Detección de Correos Duplicados
        // Supabase NO devuelve error si el correo ya existe (medida anti-hackers para no revelar correos).
        // En su lugar, finge éxito pero devuelve el arreglo 'identities' vacío (length === 0).
        // Interceptamos esa trampa aquí para avisarle amablemente al usuario real.
        if (data?.user?.identities != null && data.user.identities.length === 0) {
          throw new Error('Este correo ya está registrado en AutoRed. Por favor, cambia a "Iniciar Sesión" o recupera tu contraseña.');
        }

        // Si pasa todo lo anterior, sí es una cuenta nueva y real
        setActiveTab('login');
        setErrorMsg('¡Cuenta creada! Revisa tu correo (y la carpeta SPAM) para verificar tu cuenta antes de iniciar sesión.');
        setEmail('');
        setPassword('');
        setFullName('');

     } else {
        // 1. Supabase verifica la contraseña
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) throw new Error('Credenciales incorrectas o correo sin verificar.');

        // 2. 🛡️ PREGUNTAMOS A SPRING BOOT LA VERDAD ABSOLUTA
        const syncResponse = await fetch('http://localhost:8080/api/login/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            nombre: data.user.user_metadata?.nombre || 'Usuario'
          })
        });

        if (!syncResponse.ok) throw new Error('Error al sincronizar con el servidor central.');
        
        const syncData = await syncResponse.json();
        
        if (syncData.activo === 'false' || syncData.activo === false) {
          await supabase.auth.signOut(); // Destruimos la sesión que Supabase le acababa de dar
          throw new Error('Acceso denegado: Tu cuenta ha sido suspendida por un administrador.');
        }

        // 3. Forzamos el rol que dijo Java, ignorando el de Supabase
        data.user.user_metadata = {
          ...data.user.user_metadata,
          role: syncData.rol, // <--- LA FUENTE DE LA VERDAD
          nombre: syncData.nombre
        };

        // 4. Guardamos la sesión
        localStorage.setItem('session_token', data.session.access_token);
        localStorage.setItem('user_data', JSON.stringify(data.user));

        // 5. Redirección basada en el rol real
        if (syncData.rol === 'tienda') navigate('/dashboard/store');
        else if (syncData.rol === 'admin') navigate('/dashboard/admin');
        else navigate('/dashboard/customer');
      }
      
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setCargando(false);
    }
  };

  const handlePasswordRecovery = async () => {
    
    // 🛡️ EXPLICACIÓN: Pre-validación de Recuperación
    // Verifica que el input no esté vacío y tenga formato de correo ANTES de contactar a Supabase.
    // Esto evita gastar cuota de correos de recuperación (que cuestan dinero en producción) con peticiones basura.
    if (!email) {
      setErrorMsg('Por favor, ingresa tu correo electrónico arriba para enviar el enlace de recuperación.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setCargando(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setErrorMsg('¡Enlace enviado! Revisa tu bandeja de entrada para restablecer tu contraseña.');
    } catch(error) {
      setErrorMsg(error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/inicio' }
    });
    if (error) setErrorMsg(error.message);
  };

  const InfoIcon = () => (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200">
        
        {/* --- LADO IZQUIERDO --- */}
        <div className="w-full md:w-1/2 bg-autoblue p-10 flex flex-col justify-center items-center text-white text-center relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-900 opacity-20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="mb-8 relative z-10">
            <svg className="w-20 h-20 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight relative z-10">
            Encuentra la pieza exacta, <span className="text-autored">sin complicaciones</span>.
          </h1>
          <p className="text-white text-opacity-90 font-medium max-w-sm text-sm relative z-10">
            Accede al catálogo global de refacciones, cotiza en tiempo real y gestiona tus compras desde un solo portal.
          </p>
          
          <div className="flex gap-2 mt-10 relative z-10">
            {[1, 2, 3].map(i => <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i === 1 ? 'bg-autored w-6' : 'bg-white bg-opacity-30'}`}></div>)}
          </div>
        </div>

        {/* --- LADO DERECHO --- */}
        <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center">
          
          <div className="flex justify-center mb-6">
            <img src="/logo.jpeg" alt="AutoRed Logo" className="h-16 object-contain" />
          </div>

          <div className="mb-8 flex justify-center gap-8 border-b border-gray-100 pb-2">
            <button 
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMsg(''); setCampoActivo(''); }} 
              className={`text-lg font-black transition-colors ${activeTab === 'login' ? 'text-autoblue border-b-2 border-autored' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Iniciar Sesión
            </button>
            <span className="text-gray-300 font-light text-lg">|</span>
            <button 
              type="button"
              onClick={() => { setActiveTab('signup'); setErrorMsg(''); setCampoActivo(''); }} 
              className={`text-lg font-black transition-colors ${activeTab === 'signup' ? 'text-autoblue border-b-2 border-autored' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Crear Cuenta
            </button>
          </div>

          {errorMsg && (
            <div className={`mb-6 p-3 border rounded-xl text-xs font-bold flex items-center gap-2 ${errorMsg.includes('creada') || errorMsg.includes('Enlace') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600 animate-shake'}`}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {errorMsg.includes('creada') || errorMsg.includes('Enlace')
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                }
              </svg>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {activeTab === 'signup' && (
              <div className="animate-fade-in space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onFocus={() => setCampoActivo('fullName')} 
                    onBlur={() => setCampoActivo('')}
                    required={activeTab === 'signup'} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-autoblue transition-all"
                    placeholder="Ej. Juan Pérez"
                  />
                  {campoActivo === 'fullName' && (
                    <p className="text-xs text-autoblue font-bold mt-1.5 animate-fade-in flex items-center gap-1.5">
                      <InfoIcon /> Ingresa tu nombre y apellido reales (mínimo 3 letras).
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="animate-fade-in">
              <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setCampoActivo('email')} 
                onBlur={() => setCampoActivo('')}
                required 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-autoblue transition-all"
                placeholder="nombre@ejemplo.com"
              />
              {campoActivo === 'email' && activeTab === 'signup' && (
                <p className="text-xs text-autoblue font-bold mt-1.5 animate-fade-in flex items-center gap-1.5">
                  <InfoIcon /> Asegúrate de usar un correo válido para recibir el enlace de verificación.
                </p>
              )}
            </div>

            <div className="animate-fade-in">
              <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setCampoActivo('password')} 
                onBlur={() => setCampoActivo('')}
                required 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-autoblue transition-all"
                placeholder="••••••••"
              />
              {campoActivo === 'password' && activeTab === 'signup' && (
                <p className="text-xs text-autoblue font-bold mt-1.5 animate-fade-in flex items-center gap-1.5">
                  <InfoIcon /> Requisitos: Mínimo 6 caracteres, una mayúscula, un número y un carácter especial.
                </p>
              )}
            </div>

            {activeTab === 'login' && (
              <div className="flex items-center justify-between pt-1 animate-fade-in">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-autoblue focus:ring-autoblue" />
                  <label htmlFor="remember" className="text-xs text-gray-500 font-bold cursor-pointer">Recordarme</label>
                </div>
                <button 
                  type="button" 
                  onClick={handlePasswordRecovery}
                  className="text-xs text-autoblue font-black hover:text-blue-800 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={cargando}
              className="w-full bg-autoblue hover:bg-blue-900 text-white font-black py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {cargando ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                activeTab === 'login' ? "Ingresar al Portal" : "Crear Mi Cuenta"
              )}
            </button>
            
            {/* BOTÓN DE GOOGLE SIEMPRE VISIBLE */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center animate-fade-in">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">O continúa con</p>
              <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {activeTab === 'login' ? 'Iniciar con Google' : 'Registrarse con Google'}
              </button>
            </div>
            
          </form>

        </div>
      </div>
    </div>
  );
}