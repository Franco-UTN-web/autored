import { useState } from 'react';
import { mockChat } from '../data/mockData';

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        </button>
      )}

      {isOpen && (
        <div className="bg-gray-900 border border-gray-700 w-80 sm:w-96 rounded-xl shadow-2xl flex flex-col h-[450px]">
          <div className="bg-gray-800 p-4 border-b border-gray-700 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <h3 className="text-white font-medium">Asistente AutoRed</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {mockChat.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700 bg-gray-800 rounded-b-xl">
            <div className="flex gap-2">
              <input type="text" placeholder="Escribe tu consulta..." className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}