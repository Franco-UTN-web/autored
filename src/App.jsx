import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatWindow from './components/ChatWindow';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
// 1. Importamos la nueva vista
import ProductDetail from './pages/ProductDetail'; 

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
            
            {/* 2. Añadimos la ruta del producto detallado */}
            <Route path="/producto/:id" element={<ProductDetail />} />
            
            <Route path="/dashboard/cliente" element={<CustomerDashboard />} />
            <Route path="/dashboard/refaccionaria" element={<div className="p-10 text-center text-2xl">Panel de Refaccionaria (En construcción)</div>} />
            <Route path="/dashboard/admin" element={<div className="p-10 text-center text-2xl">Panel de Admin (En construcción)</div>} />
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