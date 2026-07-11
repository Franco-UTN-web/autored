import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; // 🔥 IMPORTAMOS REACT-MARKDOWN 🔥

export default function ChatWindow() {
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy tu copiloto en AutoRed 🚗. ¿En qué te ayudo?", isBot: true }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate(); 
  const location = useLocation();

  const sugerencias = {
    comprador: ["Buscar balatas cerámicas", "¿Cómo registro mi auto?", "Ver catálogo"],
    tienda: ["Redactar descripción de venta", "Ver mi inventario", "¿Cómo destaco un producto?"],
    admin: ["Auditar refaccionarias", "Revisar usuarios", "Ver métricas"]
  };

  useEffect(() => {
    try {
      const datos = localStorage.getItem('user_data');
      if (datos && datos !== "undefined") {
        setEstaAutenticado(true);
      } else {
        setEstaAutenticado(false); 
        setIsOpen(false);
      }
    } catch (e) {
      console.warn("Error al leer la sesión");
    }
  }, [location.pathname]); 

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
      
      let respuestaIA;
      try {
        respuestaIA = JSON.parse(data.rawJson);
      } catch (parseError) {
        console.warn("La IA no devolvió un JSON perfecto, usando texto crudo.");
        respuestaIA = { mensaje: data.rawJson, accion: 'NINGUNA' };
      }

      setMessages(prev => [...prev, { text: respuestaIA.mensaje, isBot: true }]);

      const accion = respuestaIA.accion ? respuestaIA.accion.trim() : 'NINGUNA';

      if (accion !== 'NINGUNA') {
        setTimeout(() => {
          if (accion === 'OPEN_PRODUCT' && respuestaIA.producto_id) {
            navigate(`/producto/${respuestaIA.producto_id}`);
          } 
          else {
            switch(accion) {
              case 'NAVIGATE_CATALOG': navigate('/catalogo'); break;
              case 'NAVIGATE_HOME': navigate('/inicio'); break;
              case 'NAVIGATE_GARAGE': navigate('/dashboard/customer'); break;
              case 'NAVIGATE_MY_INVENTORY': navigate('/dashboard/store'); break;
              case 'NAVIGATE_USERS':
              case 'NAVIGATE_STORES': navigate('/dashboard/admin'); break;
              default: console.log("Acción desconocida:", accion); break;
            }
          }
        }, 1500); 
      }
      
    } catch (error) {
      console.error("🔴 Error Crítico:", error);
      setMessages(prev => [...prev, { text: "Hubo un corto circuito. Intenta de nuevo. 🔧", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!estaAutenticado) {
    return null; 
  }

  return (
    <>
      {/* Botón flotante para abrir chat */}
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
        <div className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] bg-white rounded-3xl shadow-2xl border border-gray-100 z-[100] flex flex-col overflow-hidden animate-fade-in" style={{ height: '550px', maxHeight: '85vh' }}>
          
          {/* Header del Chat */}
          <div className="bg-gradient-to-r from-autoblue to-blue-800 p-4 text-white flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full blur-xl -mr-10 -mt-10"></div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shrink-0 relative z-10 shadow-sm">
              <img src="/logo.jpeg" alt="AutoRed Bot" className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="relative z-10">
              <h3 className="font-black text-base leading-tight mb-0.5">Copiloto AutoRed</h3>
              <p className="text-[11px] text-blue-200 flex items-center gap-1 font-medium tracking-wide uppercase">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span> En línea
              </p>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[90%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.isBot 
                  ? 'bg-white border border-gray-100 text-gray-800 self-start rounded-tl-sm shadow-sm' 
                  : 'bg-autoblue text-white self-end rounded-tr-sm shadow-sm'
              }`}>
                {msg.isBot ? (
                  // 🔥 AQUÍ ESTÁ LA MAGIA DEL MARKDOWN 🔥
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-autoblue">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white border border-gray-100 text-gray-400 self-start p-3.5 rounded-2xl rounded-tl-sm text-sm flex gap-1 shadow-sm w-16 justify-center">
                <span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias Rápidas */}
          <div className="bg-white pt-2 border-t border-gray-50">
            <div className="flex gap-2 overflow-x-auto p-3 scrollbar-hide">
              {sugerencias[obtenerRolActual()]?.map((sug, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setInputMsg(sug)}
                  className="whitespace-nowrap bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-autoblue border border-gray-200 hover:border-blue-200 px-4 py-2 rounded-full text-xs font-bold transition-all"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-white flex gap-2">
            <input 
              type="text" 
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Pregúntame lo que necesites..." 
              className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-autoblue/20 focus:border-autoblue transition-all"
            />
            <button type="submit" disabled={!inputMsg.trim() || isLoading} className="bg-autoblue hover:bg-blue-800 text-white p-3 rounded-2xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <svg className="w-5 h-5 ml-0.5 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}