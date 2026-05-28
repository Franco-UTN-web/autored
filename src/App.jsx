import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatWindow from './components/ChatWindow';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import RolesPanel from './pages/RolesPanel';

// Dummy Login Component (para evitar errores si navegas a /login)
const Login = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 w-96 text-center">
      <h2 className="text-2xl font-bold text-white mb-6">Iniciar Sesión</h2>
      <input type="email" placeholder="Correo electrónico" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 mb-4" />
      <input type="password" placeholder="Contraseña" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 mb-6" />
      <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-medium transition-colors">Ingresar</button>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 font-sans selection:bg-emerald-500 selection:text-white">
        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/roles" element={<RolesPanel />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        {/* Footer genérico */}
        <footer className="bg-gray-900 border-t border-gray-800 py-8 text-center text-gray-500 text-sm mt-auto">
          <p>© 2026 AutoRed. Plataforma de consulta frontend simulada.</p>
        </footer>

        {/* Componente flotante global */}
        <ChatWindow />
      </div>
    </Router>
  );
}

export default App;