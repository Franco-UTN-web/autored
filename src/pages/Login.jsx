import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); 
  const [activeTab, setActiveTab] = useState('login'); 
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaG50cXNhYndjYnVsbmFwZmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjYyNDYsImV4cCI6MjA5NTUwMjI0Nn0.8YqiYDidhvZc-n0VInSPy0XxvqYFgWz5fEijnDh6K_o';
  const SUPABASE_AUTH_URL = 'https://rdhntqsabwcbulnapfcg.supabase.co/auth/v1';

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setErrorMsg('');

    let endpoint = activeTab === 'login' ? '/token?grant_type=password' : '/signup';
    let body = { email, password };

    if (activeTab === 'signup') {
      body = {
        ...body,
        options: {
          data: {
            full_name: fullName,
            role: 'comprador' 
          }
        }
      };
    }

    try {
      const response = await fetch(`${SUPABASE_AUTH_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_description || data.message || `Error en ${activeTab === 'login' ? 'login' : 'registro'}`);
      }

      if (activeTab === 'login') {
        localStorage.setItem('session_token', data.access_token);
        localStorage.setItem('user_data', JSON.stringify(data.user));

        const userRole = data.user?.user_metadata?.role || 'comprador';

        if (userRole === 'tienda') {
          navigate('/store-dashboard'); 
        } else {
          navigate('/catalog'); 
        }
      } else {
        // Al registrarse con éxito, cambiamos a la pestaña de login y mostramos un aviso
        setActiveTab('login');
        setErrorMsg('¡Cuenta creada! Revisa tu correo para confirmar o inicia sesión directamente si desactivaste la confirmación.');
      }

    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200">
        
        {/* --- LADO IZQUIERDO: Presentación (Azul Corporativo AutoRed) --- */}
        <div className="w-full md:w-1/2 bg-autoblue p-10 flex flex-col justify-center items-center text-white text-center relative overflow-hidden">
          {/* Elemento decorativo de fondo */}
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

        {/* --- LADO DERECHO: Formulario (Blanco Limpio) --- */}
        <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center">
          
          <div className="flex justify-center mb-6">
            <img src="/logo.jpeg" alt="AutoRed Logo" className="h-16 object-contain" />
          </div>

          {/* Pestañas de Navegación */}
          <div className="mb-8 flex justify-center gap-8 border-b border-gray-100 pb-2">
            <button 
              onClick={() => { setActiveTab('login'); setErrorMsg(''); }} 
              className={`text-lg font-black transition-colors ${activeTab === 'login' ? 'text-autoblue border-b-2 border-autored' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Iniciar Sesión
            </button>
            <span className="text-gray-300 font-light text-lg">|</span>
            <button 
              onClick={() => { setActiveTab('signup'); setErrorMsg(''); }} 
              className={`text-lg font-black transition-colors ${activeTab === 'signup' ? 'text-autoblue border-b-2 border-autored' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Crear Cuenta
            </button>
          </div>

          {errorMsg && (
            <div className={`mb-6 p-3 border rounded-xl text-xs font-bold flex items-center gap-2 ${errorMsg.includes('creada') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600 animate-shake'}`}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {errorMsg.includes('creada') 
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                }
              </svg>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {activeTab === 'signup' && (
              <div className="animate-fade-in">
                <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Nombre Completo</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={activeTab === 'signup'} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-autoblue transition-all"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
            )}

            <div className="animate-fade-in">
              <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-autoblue transition-all"
                placeholder="nombre@ejemplo.com"
              />
            </div>

            <div className="animate-fade-in">
              <label className="block text-xs font-black uppercase text-gray-500 mb-1 tracking-wider">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-autoblue transition-all"
                placeholder="••••••••"
              />
            </div>

            {activeTab === 'login' && (
              <div className="flex items-center justify-between pt-1 animate-fade-in">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-autoblue focus:ring-autoblue" />
                  <label htmlFor="remember" className="text-xs text-gray-500 font-bold cursor-pointer">Recordarme</label>
                </div>
                <button type="button" className="text-xs text-autoblue font-black hover:text-blue-800 transition-colors">¿Olvidaste tu contraseña?</button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={cargando}
              className="w-full bg-autoblue hover:bg-blue-900 text-white font-black py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-4"
            >
              {cargando ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                activeTab === 'login' ? "Ingresar al Portal" : "Crear Mi Cuenta"
              )}
            </button>
            
            {/* Opcional: Separador para login social en el futuro */}
            {activeTab === 'login' && (
              <div className="mt-6 pt-6 border-t border-gray-100 text-center animate-fade-in">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">O continúa con</p>
                <button type="button" className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-3 shadow-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Iniciar con Google
                </button>
              </div>
            )}
            
          </form>

        </div>
      </div>
    </div>
  );
}