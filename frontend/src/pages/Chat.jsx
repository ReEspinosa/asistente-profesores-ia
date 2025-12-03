import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { enviarMensajeCasual, obtenerBienvenida } from '../services/api';

function Chat() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll automático al último mensaje
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Cargar mensaje de bienvenida al iniciar
    useEffect(() => {
        const cargarBienvenida = async () => {
            try {
                const response = await obtenerBienvenida();
                const bienvenidaMessage = {
                    type: 'assistant',
                    content: response.data.mensaje,
                    timestamp: new Date().toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };
                setMessages([bienvenidaMessage]);
            } catch (error) {
                // Mensaje por defecto si falla
                setMessages([{
                    type: 'assistant',
                    content: 'Hola, soy Cuali, tu asistente para dar una buena educación. ¿En qué te puedo ayudar hoy?',
                    timestamp: new Date().toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                }]);
            }
        };
        cargarBienvenida();
    }, []);

    const handleSend = async () => {
        if (!inputText.trim() || loading) return;

        const userMessage = {
            type: 'user',
            content: inputText,
            timestamp: new Date().toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setLoading(true);

        try {
            // Preparar historial para el backend
            const historial = messages.map(msg => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.content
            }));

            const response = await enviarMensajeCasual(inputText, historial);

            const assistantMessage = {
                type: 'assistant',
                content: response.data.respuesta,
                timestamp: new Date().toLocaleTimeString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error en chat:', error);
            const errorMessage = {
                type: 'assistant',
                content: 'Uy, parece que tuve un problemita técnico. ¿Me repites eso?',
                timestamp: new Date().toLocaleTimeString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
            setMessages(prev => [...prev, errorMessage]);
        }

        setLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="min-h-screen bg-brand-beige flex flex-col">
            {/* Header */}
            <div className="bg-brand-blue text-white p-4 shadow-lg">
                <div className="container mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="text-2xl hover:scale-110 transition-transform"
                        aria-label="Volver al inicio"
                    >
                        ←
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Conversación con Cuali</h1>
                        <p className="text-sm text-blue-200">Tu asistente educativo</p>
                    </div>
                </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                                <div className={`flex items-start gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xl ${
                                        msg.type === 'user'
                                            ? 'bg-brand-blue text-white'
                                            : 'bg-white border-2 border-brand-blue'
                                    }`}>
                                        {msg.type === 'user' ? '👤' : '🎓'}
                                    </div>

                                    {/* Message Bubble */}
                                    <div className="flex-1">
                                        <div className={`rounded-2xl p-4 ${
                                            msg.type === 'user'
                                                ? 'bg-brand-blue text-white'
                                                : 'bg-white text-gray-800 shadow-md'
                                        }`}>
                                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                        </div>
                                        <p className={`text-xs text-gray-500 mt-1 px-2 ${
                                            msg.type === 'user' ? 'text-right' : 'text-left'
                                        }`}>
                                            {msg.timestamp}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-brand-blue text-xl">
                                    🎓
                                </div>
                                <div className="bg-white rounded-2xl p-4 shadow-md">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Elemento invisible para scroll automático */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-white rounded-2xl shadow-lg p-4">
                    <div className="flex gap-3">
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje aquí..."
                rows="1"
                className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none resize-none"
                style={{ minHeight: '48px', maxHeight: '120px' }}
            />
                        <button
                            onClick={handleSend}
                            disabled={loading || !inputText.trim()}
                            className="bg-brand-blue text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Enviar
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Presiona Enter para enviar, Shift + Enter para nueva línea
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Chat;