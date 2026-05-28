import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (roleRoute) => {
    navigate(roleRoute);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-md text-center shadow-lg">
        
        <img src="/logo.jpeg" alt="AutoRed" className="h-12 mx-auto mb-6 object-contain" />
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso al Sistema</h2>
        <p className="text-gray-500 mb-8 text-sm">Selecciona tu perfil de prueba</p>
        
        <div className="space-y-4">
          <button onClick={() => handleLogin('/dashboard/cliente')} className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 hover:text-autoblue py-3 rounded-lg font-medium transition-all flex justify-center items-center gap-2 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            Entrar como Cliente
          </button>
          
          <button onClick={() => handleLogin('/dashboard/refaccionaria')} className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 hover:text-autored py-3 rounded-lg font-medium transition-all flex justify-center items-center gap-2 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Entrar como Refaccionaria
          </button>

          <button onClick={() => handleLogin('/dashboard/admin')} className="w-full bg-autoblue hover:bg-blue-900 border border-transparent text-white py-3 rounded-lg font-medium transition-all flex justify-center items-center gap-2 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Entrar como Admin
          </button>
        </div>
      </div>
    </div>
  );
}