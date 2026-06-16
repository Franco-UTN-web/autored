import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatWindow from './components/ChatWindow';
import Footer from './components/Footer';

// Páginas Públicas
import SobreNosotros from './pages/SobreNosotros';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Login from './pages/Login'; // O AuthView, dependiendo de cómo llamaste al archivo
import ProductDetail from './pages/ProductDetail'; 

// Páginas Privadas (Dashboards)
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import StoreDashboard from './pages/dashboards/StoreDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

function App() {
  return (
    <Router>
      {/* Contenedor Flexbox para mantener el Footer siempre abajo */}
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans selection:bg-autoblue selection:text-white">
        
        <Navbar />
        
        {/* main con flex-grow empuja el Footer hacia el fondo */}
        <main className="flex-grow">
          <Routes>
            {/* --- RUTAS PÚBLICAS --- */}
            <Route path="/" element={<SobreNosotros />} /> {/* Presentación Corporativa */}
            <Route path="/inicio" element={<Home />} />    {/* Tienda y Destacados */}
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            
            {/* --- RUTAS PRIVADAS (Paneles) --- */}
            <Route path="/dashboard/cliente" element={<CustomerDashboard />} />
            <Route path="/store-dashboard" element={<StoreDashboard />} /> {/* Dejamos solo esta para la tienda */}
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        <Footer />
        
        {/* El ChatWindow flota por encima de todo, está perfecto aquí */}
        <ChatWindow />
        
      </div>
    </Router>
  );
}

export default App;