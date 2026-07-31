import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  
  const navigate = useNavigate();

  const handleRecuperacion = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMensaje({ texto: 'Por favor, ingresa un correo electrónico válido.', tipo: 'error' });
      return;
    }

    setCargando(true);
    try {
      // 💡 Asegúrate de configurar la URL de redirección en tu panel de Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/actualizar-password', // A donde irá después de hacer clic en el correo
      });
      
      if (error) throw error;
      
      setMensaje({ 
        texto: '¡Enlace enviado! Revisa tu bandeja de entrada (y SPAM) para restablecer tu contraseña.', 
        tipo: 'exito' 
      });
      setEmail('');
    } catch(error) {
      setMensaje({ texto: error.message, tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 p-8">
        
        <div className="flex justify-center mb-6">
          <img src="/logo.jpeg" alt="AutoRed Logo" className="h-16 object-contain" />
        </div>

        <h2 className="text-2xl font-black text-center text-gray-900 mb-2 tracking-tight">
          Recuperar Contraseña
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8 font-medium">
          Ingresa el correo asociado a tu cuenta y te enviaremos un enlace para crear una nueva.
        </p>

        {mensaje.texto && (
          <div className={`mb-6 p-3 border rounded-xl text-xs font-bold flex items-start gap-2 ${mensaje.tipo === 'exito' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600 animate-shake'}`}>
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mensaje.tipo === 'exito'
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              }
            </svg>
            <span>{mensaje.texto}</span>
          </div>
        )}

        <form onSubmit={handleRecuperacion} className="space-y-5">
          <div>
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

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-autoblue hover:bg-blue-900 text-white font-black py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {cargando ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Enviar enlace de recuperación"
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <button 
            type="button" 
            onClick={() => navigate('/login')}
            className="text-sm text-gray-500 font-bold hover:text-autoblue transition-colors flex items-center justify-center gap-2 w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Volver a Iniciar Sesión
          </button>
        </div>

      </div>
    </div>
  );
}