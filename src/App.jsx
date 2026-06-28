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


import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import StoreDashboard from './pages/dashboards/StoreDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

function App() {

  // ==========================================
  // ATRAPADOR DE SESIÓN DE GOOGLE (Mejorado)
  // ==========================================
  useEffect(() => {
    const hash = window.location.hash;
    
    // Si la URL trae un token de Google...
    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");

      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaG50cXNhYndjYnVsbmFwZmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjYyNDYsImV4cCI6MjA5NTUwMjI0Nn0.8YqiYDidhvZc-n0VInSPy0XxvqYFgWz5fEijnDh6K_o';
      const SUPABASE_USER_URL = 'https://rdhntqsabwcbulnapfcg.supabase.co/auth/v1/user';

      // Vamos a buscar los datos del usuario
      fetch(SUPABASE_USER_URL, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`
        }
      })
      .then(res => res.json())
      .then(user => {
        // ✨ EL ARREGLO ESTÁ AQUÍ ✨
        // Si el usuario viene de Google y no tiene rol, le ponemos 'comprador' por defecto
        if (!user.user_metadata) {
          user.user_metadata = {};
        }
        if (!user.user_metadata.role) {
          user.user_metadata.role = 'comprador';
        }

        // Ahora sí, guardamos todo correcto en memoria
        localStorage.setItem('session_token', accessToken);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        // Limpiamos la URL dejándola exactamente en /inicio y recargamos
        window.history.replaceState(null, null, window.location.pathname);
        window.location.reload(); 
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
            
            
            <Route path="/dashboard/cliente" element={
              <ProtectedRoute allowedRoles={['comprador']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/store-dashboard" element={
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