import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy tu copiloto en AutoRed 🚗. ¿En qué te ayudo?", isBot: true }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 1. NUEVO ESTADO PARA SABER SI HAY SESIÓN
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate(); 

  // 2. VERIFICAMOS SI HAY ALGUIEN LOGUEADO CUANDO CARGA LA PÁGINA
  useEffect(() => {
    try {
      const datos = localStorage.getItem('user_data');
      if (datos && datos !== "undefined") {
        setEstaAutenticado(true);
      }
    } catch (e) {
      console.warn("Error al leer la sesión");
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const obtenerRolActual = () => {
    try {
      const datos = localStorage.getItem('user_data');
      if (datos && datos !== "undefined") {
        return JSON.parse(datos).user_metadata?.role || "comprador";
      }
    } catch (e) { return "invitado"; }
    return "invitado";
  };

 const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setMessages(prev => [...prev, { text: userText, isBot: false }]);
    setInputMsg('');
    setIsLoading(true);

    try {
      const rolUsuario = obtenerRolActual();
      
      const response = await fetch('http://localhost:8080/api/chat/mensaje', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mensaje: userText,
          rol: rolUsuario 
        })
      });

      if (!response.ok) throw new Error("Error en el servidor");
      
      const data = await response.json();
      const respuestaIA = JSON.parse(data.rawJson);

      setMessages(prev => [...prev, { text: respuestaIA.mensaje, isBot: true }]);

      if (respuestaIA.accion === 'NAVIGATE_CATALOG') {
        setTimeout(() => { navigate('/catalogo'); }, 1500); 
      } else if (respuestaIA.accion === 'NAVIGATE_HOME') {
        setTimeout(() => { navigate('/inicio'); }, 1500);
      }
      
    } catch (error) {
      console.error("🔴 Error Crítico:", error);
      setMessages(prev => [...prev, { text: "Hubo un corto circuito. Intenta de nuevo. 🔧", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. 🪄 EL TRUCO MÁGICO: Si no está logueado, React devuelve "null" (No dibuja nada en pantalla)
  if (!estaAutenticado) {
    return null; 
  }

  // 4. Si SÍ está logueado, dibuja el botón y la ventana normal
  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-autoblue hover:bg-blue-900 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 z-[100] flex items-center justify-center"
      >
        {isOpen ? (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[100] flex flex-col overflow-hidden animate-fade-in" style={{ height: '500px', maxHeight: '80vh' }}>
          
          <div className="bg-autoblue p-4 text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
              <img src="/logo.jpeg" alt="AutoRed Bot" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <h3 className="font-black text-sm">Copiloto AutoRed</h3>
              <p className="text-[10px] text-blue-200 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Seguro • Privado
              </p>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.isBot ? 'bg-white border border-gray-200 text-gray-800 self-start rounded-tl-sm shadow-sm' : 'bg-autoblue text-white self-end rounded-tr-sm shadow-sm'}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white border border-gray-200 text-gray-500 self-start p-3 rounded-2xl rounded-tl-sm text-sm flex gap-1 shadow-sm">
                <span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Escribe tu pregunta..." 
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-autoblue transition-all"
            />
            <button type="submit" disabled={!inputMsg.trim() || isLoading} className="bg-autored hover:bg-red-700 text-white p-2.5 rounded-xl transition-colors disabled:opacity-50">
              <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}