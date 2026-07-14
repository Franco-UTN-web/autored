import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Si alguien entra aquí sin un token de recuperación, lo rebotamos al login
    const token = localStorage.getItem('recovery_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('recovery_token');
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    try {
      // Le enviamos la nueva contraseña a Supabase usando el token de recuperación
      const response = await fetch('https://rdhntqsabwcbulnapfcg.supabase.co/auth/v1/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: password })
      });

      if (!response.ok) {
        throw new Error('El enlace de recuperación ha expirado o no es válido.');
      }

      // Si todo sale bien, limpiamos la basura temporal y lo mandamos a iniciar sesión
      localStorage.removeItem('recovery_token');
      alert('¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.');
      navigate('/login');

    } catch (err) {
      setError(err.message);
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
          Asegúrate de usar una contraseña que puedas recordar.
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
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue" 
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
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-autoblue" 
                placeholder="••••••••" 
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-bold text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-autoblue hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}