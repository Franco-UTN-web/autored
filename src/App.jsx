import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatWindow from './components/ChatWindow';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail'; 

// 1. Importa los 3 nuevos dashboards
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import StoreDashboard from './pages/dashboards/StoreDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-autoblue selection:text-white">
        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            
            {/* 2. Asigna los componentes a las rutas correspondientes */}
            <Route path="/dashboard/cliente" element={<CustomerDashboard />} />
            <Route path="/dashboard/tienda" element={<StoreDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-500 text-sm mt-auto">
          <p>© 2026 AutoRed. Plataforma de consulta frontend simulada.</p>
        </footer>

        <ChatWindow />
      </div>
    </Router>
  );
}

export default App;