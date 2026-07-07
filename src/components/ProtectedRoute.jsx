import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const [estado, setEstado] = useState('cargando');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const verificarAcceso = async () => {
      const sessionData = localStorage.getItem('user_data');
      if (!sessionData || sessionData === "undefined") {
        setEstado('denegado');
        return;
      }

      const userData = JSON.parse(sessionData);
      setUsuario(userData);

      try {
        // Le preguntamos a Java si este usuario no está suspendido
        // (Asumiendo que tienes este endpoint o el de obtener todos los usuarios)
        const res = await fetch('http://localhost:8080/api/admin/usuarios'); 
        if (res.ok) {
          const usuariosDB = await res.json();
          const miUsuarioBD = usuariosDB.find(u => u.id === userData.id);
          
          if (miUsuarioBD && miUsuarioBD.estado === 'Suspendido') {
            // ¡Cuenta suspendida! Lo sacamos del sistema
            localStorage.removeItem('user_data');
            localStorage.removeItem('session_token');
            alert("Acceso denegado: Tu cuenta de AutoRed ha sido suspendida por el administrador.");
            setEstado('suspendido');
            return;
          }
        }
        setEstado('permitido');
      } catch (error) {
        // Si el servidor está apagado, lo dejamos pasar por ahora (o puedes bloquearlo)
        setEstado('permitido'); 
      }
    };

    verificarAcceso();
  }, []);

  if (estado === 'cargando') {
    return <div className="flex h-screen items-center justify-center font-bold text-gray-500">Verificando credenciales de seguridad...</div>;
  }

  if (estado === 'suspendido' || estado === 'denegado') {
    return <Navigate to="/login" replace />;
  }

  // Verificamos el rol
  const userRole = usuario?.user_metadata?.role || 'comprador';
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/inicio" replace />;
  }

  return children;
}