import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  
  // Estados para capturar lo que el usuario escribe
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setError('');
    setIsLoading(true);

    try {
      // Hacemos la petición real a Spring Boot
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // El backend respondió con éxito (200 OK)
        // Aquí en el futuro puedes guardar el token JWT en localStorage
        navigate(data.redirectUrl);
      } else {
        // Mostramos el error del backend (ej. Credenciales inválidas)
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor (¿Está encendido Spring Boot?)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-md shadow-lg">
        
        <img src="/logo.jpeg" alt="AutoRed" className="h-12 mx-auto mb-6 object-contain" />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Acceso al Sistema</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">Ingresa tus credenciales corporativas</p>
        
        {/* Mostramos errores si existen */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-autored text-sm px-4 py-3 rounded-lg mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-autoblue focus:border-transparent transition-all"
              placeholder="Ingresa tu nombre de usuario"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-autoblue focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white py-3 rounded-lg font-bold transition-all flex justify-center items-center gap-2 shadow-sm 
              ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-autoblue hover:bg-blue-900'}`}
          >
            {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 font-medium">Credenciales de prueba:</p>
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <p>cliente@autored.com / 123</p>
            <p>tienda@autored.com / 123</p>
            <p>admin@autored.com / 123</p>
          </div>
        </div>

      </div>
    </div>
  );
}