import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; // Asegúrate de que esta ruta sea la correcta

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Si la URL trae el hash de recuperación, estamos a salvo. No lo expulses.
    if (window.location.hash.includes('type=recovery')) {
      return; 
    }

    // 2. Si no trae hash, comprobamos si tiene sesión activa
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Si de verdad no hay sesión ni hash, entonces sí lo mandamos al login
      if (!session) {
        navigate('/login');
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Aplicamos la misma validación robusta que en el registro
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_.-]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError('La contraseña debe tener al menos 6 caracteres, incluir una letra mayúscula, un número y un carácter especial.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      // Usamos el método nativo de Supabase para actualizar. 
      // Como Supabase ya leyó el token de la URL, sabe a qué usuario pertenece esta petición.
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      // Si todo sale bien, lo mandamos a iniciar sesión
      alert('¡Contraseña actualizada con éxito! Ya puedes iniciar sesión con tu nueva contraseña.');
      
      // Cerramos la sesión temporal de recuperación por seguridad
      await supabase.auth.signOut();
      navigate('/login');

    } catch (err) {
      setError('Error al actualizar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img src="/logo.jpeg" alt="AutoRed" className="mx-auto h-16 object-contain mb-6" />
        <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">
          Crea una nueva contraseña
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-medium">
          Asegúrate de usar una contraseña segura y que puedas recordar.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-gray-200 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-black uppercase text-gray-500 mb-1">Nueva Contraseña</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue outline-none transition-all" 
                placeholder="••••••••" 
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-gray-500 mb-1">Confirmar Contraseña</label>
              <input 
                type="password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue outline-none transition-all" 
                placeholder="••••••••" 
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-start gap-2">
                 <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-autoblue hover:bg-blue-900 text-white font-black py-3.5 rounded-xl transition-all shadow-md disabled:opacity-50 flex justify-center items-center h-12"
            >
              {loading ? (
                 <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : 'Guardar Nueva Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}