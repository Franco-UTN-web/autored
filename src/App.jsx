import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react'; // <-- Asegúrate de que esté importado

import Navbar from './components/Navbar';
import ChatWindow from './components/ChatWindow';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import SobreNosotros from './pages/SobreNosotros';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Login from './pages/Login'; 
import ProductDetail from './pages/ProductDetail'; 
import StoreProfile from './pages/StoreProfile';
import RegistroNegocio from './pages/RegistroNegocio';
import DirectorioSucursales from './pages/DirectorioSucursales';


import CustomerDashboard from './pages/dashboards/customer/CustomerDashboard';
import StoreDashboard from './pages/dashboards/store/StoreDashboard';
import AdminDashboard from './pages/dashboards/admin/AdminDashboard';

function App() {

  // ==========================================
  // ATRAPADOR DE SESIÓN DE GOOGLE (Mejorado)
  // ==========================================
  // ==========================================
  // ATRAPADOR DE SESIÓN DE GOOGLE (Mejorado Anti-Suspendidos)
  // ==========================================
  useEffect(() => {
    const hash = window.location.hash;
    
    // Si la URL trae un token de Google...
    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");

      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const SUPABASE_USER_URL = 'https://rdhntqsabwcbulnapfcg.supabase.co/auth/v1/user';

      // Vamos a buscar los datos del usuario en Supabase
      fetch(SUPABASE_USER_URL, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        }
      })
      .then(res => res.json())
      .then(async (user) => { // 🔥 IMPORTANTE: Agregamos 'async' aquí
        
        if (!user.user_metadata) {
          user.user_metadata = {};
        }

        try {
          // 🛡️ 1. LE PREGUNTAMOS A SPRING BOOT ANTES DE DEJARLO ENTRAR
          const syncResponse = await fetch('https://backautored-production.up.railway.app/api/login/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user.id,
              email: user.email,
              nombre: user.user_metadata?.nombre || user.user_metadata?.full_name || 'Usuario'
            })
          });

          if (syncResponse.ok) {
            const syncData = await syncResponse.json();

            // 🚨 2. VERIFICACIÓN DE SUSPENSIÓN
            if (syncData.activo === 'false' || syncData.activo === false) {
              alert('Acceso denegado: Tu cuenta ha sido suspendida por un administrador.');
              window.history.replaceState(null, null, window.location.pathname);
              window.location.href = '/login'; // Lo regresamos al inicio
              return; // ⛔ Detenemos la ejecución, NO SE GUARDA LA SESIÓN
            }

            // 3. Si no está suspendido, forzamos el rol que dijo Java
            user.user_metadata.role = syncData.rol || 'comprador';
            user.user_metadata.nombre = syncData.nombre;
          }

          // 4. Ahora sí, guardamos todo correcto en memoria
          localStorage.setItem('session_token', accessToken);
          localStorage.setItem('user_data', JSON.stringify(user));
          
          // Limpiamos la URL dejándola exactamente en /inicio y recargamos
          window.history.replaceState(null, null, window.location.pathname);
          window.location.reload(); 

        } catch (err) {
          console.error("Error verificando estado en Java:", err);
        }

      })
      .catch(err => console.error("Error verificando cuenta de Google:", err));
    }
  }, []);
  // ==========================================

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans selection:bg-autoblue selection:text-white">
        
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
           <Route path="/nosotros" element={<SobreNosotros />} />
            <Route path="/" element={<Home />} />
            <Route path="/inicio" element={<Home />} />    
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/tienda/:id" element={<StoreProfile />} />
            <Route path="/registro-negocio" element={<RegistroNegocio />} />
            <Route path="/directorio" element={<DirectorioSucursales />} />
            
            
            <Route path="/dashboard/customer" element={
              <ProtectedRoute allowedRoles={['comprador']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/store" element={
              <ProtectedRoute allowedRoles={['tienda']}>
                <StoreDashboard />
              </ProtectedRoute>
            } /> 
            
            <Route path="/dashboard/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>

        <Footer />
        <ChatWindow />
        
      </div>
    </Router>
  );
}

export default App;