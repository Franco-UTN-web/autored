import { useState, useEffect } from 'react';

export default function ApiUsagePanel() {
  const [metricas, setMetricas] = useState({
    peticionesTotales: 0,
    peticionesHoy: 0, 
    tokensConsumidos: 0,
    costoEstimado: "$0.00", 
    tiempoPromedio: "1.2s"
  });

  const [historialReciente, setHistorialReciente] = useState([]);
  const [cargando, setCargando] = useState(true);

 useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const response = await fetch('https://backautored-production.up.railway.app/api/chat/estadisticas');
        if (response.ok) {
          const data = await response.json();
          
          // 🔥 AQUÍ ESTÁ EL TRUCO: Calculamos el costo ($0.15 dólares por cada 1,000,000 de tokens)
          const costoReal = (data.tokensConsumidos / 1000000) * 0.15;

          setMetricas(prev => ({
            ...prev,
            peticionesTotales: data.peticionesTotales,
            tokensConsumidos: data.tokensConsumidos >= 1000 ? `${(data.tokensConsumidos / 1000).toFixed(1)}k` : data.tokensConsumidos,
            costoEstimado: `$${costoReal.toFixed(4)}` // <-- Muestra $0.0000
          }));

          // Formateamos las fechas que llegan de Java
          const historialFormateado = data.historial.map(log => {
            const fechaObj = new Date(log.fecha);
            return {
              id: log.id,
              usuario: log.rolUsuario.toUpperCase(),
              prompt: log.prompt,
              fecha: fechaObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              tokens: log.tokensEstimados
            };
          });

          setHistorialReciente(historialFormateado);
        }
      } catch (error) {
        console.error("Error cargando estadísticas del chat:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchEstadisticas();
    // Opcional: Actualizar automáticamente cada 30 segundos
    const intervalo = setInterval(fetchEstadisticas, 30000);
    return () => clearInterval(intervalo);
  }, []);

  if (cargando) {
    return <div className="p-8 text-center text-autoblue font-bold animate-pulse">Cargando métricas de IA...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-full font-sans animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-autoblue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Monitor de Copiloto IA (Gemini)
        </h2>
        <p className="text-gray-500 font-medium mt-1">Métricas de uso, consumo de tokens y rendimiento del asistente virtual.</p>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm border-l-4 border-l-autoblue">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Peticiones Históricas</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-gray-900">{metricas.peticionesTotales}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm border-l-4 border-l-purple-500">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tokens Procesados</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-gray-900">{metricas.tokensConsumidos}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm border-l-4 border-l-green-500">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Costo de IA</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-gray-900">{metricas.costoEstimado}</h3>
            <span className="text-xs font-bold text-gray-500 mb-1">Capa Gratuita</span>
          </div>
        </div>
      </div>

      {/* TABLA HISTORIAL */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-black text-gray-900">Últimas Consultas</h3>
          <span className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            En vivo
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Prompt (Pregunta)</th>
                <th className="px-6 py-4 text-center">Tokens</th>
                <th className="px-6 py-4 text-right">Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historialReciente.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{log.usuario}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    <span className="bg-gray-100 px-3 py-1 rounded-lg italic">"{log.prompt}"</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded border border-purple-100">
                      {log.tokens} tkns
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400 font-medium whitespace-nowrap">{log.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}