import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  // 1. Buscamos si hay un usuario conectado en la memoria del navegador
  let usuarioLogueado = null;
  let rolUsuario = null;

  try {
    const datosUsuarioJson = localStorage.getItem('user_data');
    if (datosUsuarioJson && datosUsuarioJson !== "undefined") {
      usuarioLogueado = JSON.parse(datosUsuarioJson);
      rolUsuario = usuarioLogueado?.user_metadata?.role;
    }
  } catch (error) {
    console.error("Error leyendo la sesión:", error);
  }

  // 2. REGLA UNO: Si no está logueado, mándalo al Login directamente
  if (!usuarioLogueado) {
    return <Navigate to="/login" replace />;
  }

  // 3. REGLA DOS: Si la ruta exige un rol específico y no lo tiene, mándalo al Inicio
  // (Por ejemplo, si un "comprador" intenta entrar al panel de "tienda")
  if (allowedRoles && !allowedRoles.includes(rolUsuario)) {
    return <Navigate to="/" replace />;
  }

  // 4. Si pasó todos los filtros de seguridad, déjalo ver la página que pidió
  return children;
}