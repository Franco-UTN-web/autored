import { useState } from 'react';
import { mockChat } from '../data/mockData';

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          // Animación de hover: se hace más grande y cambia ligeramente la sombra
          className="bg-autoblue hover:bg-blue-900 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        </button>
      )}

      {isOpen && (
        <div className="bg-white border border-gray-200 w-80 sm:w-96 rounded-xl shadow-2xl flex flex-col h-[450px] animate-fade-in">
          
          {/* Header del Chat */}
          <div className="bg-autoblue p-4 rounded-t-xl flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-white font-bold">Asistente AutoRed</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-200 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          {/* Área de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {mockChat.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-autoblue text-white rounded-br-sm' : 'bg-white text-gray-700 border border-gray-200 rounded-bl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input de texto */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
            <div className="flex gap-2">
              <input type="text" placeholder="Escribe tu consulta..." className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-autoblue focus:ring-1 focus:ring-autoblue" />
              <button className="bg-autoblue hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}