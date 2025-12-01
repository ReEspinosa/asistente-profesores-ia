import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generarPlanClase } from '../services/api';

function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: '¡Hola! Soy tu asistente educativo. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputText,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await generarPlanClase({
        materia: 'general',
        tema: inputText,
        duracion_minutos: 50,
        usar_rag: true
      });

      const assistantMessage = {
        type: 'assistant',
        content: response.data.contenido,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'assistant',
        content: 'Lo siento, hubo un error. Por favor intenta de nuevo.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-beige flex flex-col">
      {/* Header */}
      <div className="bg-brand-blue text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-2xl hover:scale-110 transition-transform"
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">💬 Conversación</h1>
            <p className="text-sm text-blue-200">Asistente Educativo IA</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.type === 'user' ? 'bg-brand-blue' : 'bg-white border-2 border-brand-blue'
                  }`}>
                    {msg.type === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="flex-1">
                    <div className={`rounded-2xl p-4 ${
                      msg.type === 'user' 
                        ? 'bg-brand-blue text-white' 
                        : 'bg-white text-gray-800 shadow-md'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-2">
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl p-4 shadow-md">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu mensaje aquí..."
              className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={loading || !inputText.trim()}
              className="bg-brand-blue text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-blue-light transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
