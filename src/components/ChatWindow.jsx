import { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabase';

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy tu asistente inteligente en AutoRed 🚗. ¿Buscas alguna refacción en especial o necesitas ayuda para navegar?", isBot: true }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll para que siempre se vea el último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

 const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setMessages(prev => [...prev, { text: userText, isBot: false }]);
    setInputMsg('');
    setIsLoading(true);

    try {
      // 🛡️ 1. INTENTO DE BASE DE DATOS BLINDADO 🛡️
      let contextoDB = "No tenemos esta pieza en el catálogo actualmente.";
      
      try {
        // A. Limpiamos el texto de signos de puntuación y lo pasamos a minúsculas
        const textoLimpio = userText.toLowerCase().replace(/[.,¿?¡!]/g, '');
        
        // B. Lista de palabras basura que NO queremos buscar
        const palabrasIgnorar = ['hola', 'oye', 'quiero', 'busco', 'necesito', 'puedes', 'hablar', 'del', 'sobre', 'las', 'los', 'para', 'una', 'uno', 'tiene', 'tienen', 'info', 'informacion'];
        
        // C. Filtramos para quedarnos solo con lo importante
        const palabrasClave = textoLimpio.split(' ').filter(p => p.length > 2 && !palabrasIgnorar.includes(p));
        
        let consulta = supabase.from('piezas').select('nombre_comercial, marca, modelo, categoria');
        
        // Si sobrevivió alguna palabra clave (ej. "filtro"), buscamos con esa
        if (palabrasClave.length > 0) {
           consulta = consulta.ilike('nombre_comercial', `%${palabrasClave[0]}%`);
        }
        
        const { data: piezasDB, error: dbError } = await consulta.limit(5);
        
        if (dbError) {
          console.warn("⚠️ Advertencia de Supabase:", dbError.message);
        } else if (piezasDB && piezasDB.length > 0) {
          contextoDB = JSON.stringify(piezasDB);
        }
      } catch (dbCrash) {
        console.warn("⚠️ Crash al conectar con Supabase:", dbCrash.message);
      }

      // 🤖 2. LLAMADA A GEMINI 🤖
      const API_KEY = 'AQ.Ab8RN6JSshRwX3nrf6sJk8MT1pMoI3EEUWpD_zua43RXUWzTxA'; 
      
      const promptDelSistema = `Eres el asistente virtual oficial de AutoRed, una plataforma de refacciones automotrices.
      
      REGLAS ESTRICTAS:
      1. SOLO puedes hablar sobre refacciones, mecánica, autos y la plataforma AutoRed. 
      2. Saluda cordialmente si el usuario dice "hola" o te saluda.
      3. NUNCA inventes precios, marcas o existencias. 
      4. Basa tu respuesta sobre inventario ÚNICAMENTE en la siguiente información de nuestra BD:
      
      [DATOS REALES DE AUTORED]: 
      ${contextoDB}
      
      Pregunta del cliente: ${userText}`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

      const response = await fetch(url, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptDelSistema }] }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      const botReply = data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { text: botReply, isBot: true }]);
      
    } catch (error) {
      console.error("🔴 Error Crítico con Gemini:", error);
      setMessages(prev => [...prev, { text: "Ups, mis engranes fallaron un poco al responder. Intenta de nuevo. 🔧", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
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

      {/* VENTANA DEL CHAT */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[100] flex flex-col overflow-hidden animate-fade-in" style={{ height: '500px', maxHeight: '80vh' }}>
          
          {/* Cabecera */}
          <div className="bg-autoblue p-4 text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
              <img src="/logo.jpeg" alt="AutoRed Bot" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <h3 className="font-black text-sm">Asistente AutoRed</h3>
              <p className="text-[10px] text-blue-200 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> En línea y listo
              </p>
            </div>
          </div>

          {/* Área de mensajes */}
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

          {/* Input de texto */}
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