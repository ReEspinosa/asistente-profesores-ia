import { useState } from 'react';
import { generarPlanClase, generarEjercicios } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('plan');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  
  const [formPlan, setFormPlan] = useState({
    materia: 'matematicas',
    tema: '',
    duracion_minutos: 50,
    usar_rag: true,
    comentarios: ''
  });

  const [formEjercicios, setFormEjercicios] = useState({
    materia: 'matematicas',
    tema: '',
    cantidad: 5,
    tipo: 'mixto',
    dificultad: 'media',
    comentarios: ''
  });

  const materias = [
    { value: 'matematicas', label: '🔢 Matemáticas', emoji: '🔢' },
    { value: 'espanol', label: '📖 Español', emoji: '📖' },
    { value: 'ciencias_naturales', label: '🔬 Ciencias Naturales', emoji: '🔬' },
    { value: 'historia', label: '📜 Historia', emoji: '📜' },
    { value: 'geografia', label: '🌎 Geografía', emoji: '🌎' },
    { value: 'formacion_civica', label: '🏛️ Formación Cívica', emoji: '🏛️' }
  ];

  const handleGenerarPlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const userMessage = {
      type: 'user',
      content: `Generar plan de clase de ${formPlan.materia} sobre "${formPlan.tema}"`,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await generarPlanClase(formPlan);
      
      const assistantMessage = {
        type: 'assistant',
        content: response.data.contenido,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'error',
        content: 'Error al generar: ' + error.message,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setLoading(false);
  };

  const handleGenerarEjercicios = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const userMessage = {
      type: 'user',
      content: `Generar ${formEjercicios.cantidad} ejercicios de ${formEjercicios.materia} sobre "${formEjercicios.tema}"`,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await generarEjercicios(formEjercicios);
      
      const assistantMessage = {
        type: 'assistant',
        content: response.data.contenido,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'error',
        content: 'Error al generar: ' + error.message,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-beige">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-brand-blue/20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-brand-blue mb-1" style={{fontFamily: 'Georgia, serif'}}>
                Asistente Profesores IA
              </h1>
              <p className="text-gray-600 text-sm">Nueva Escuela Mexicana • 6to Grado de Primaria</p>
            </div>
            <div className="text-5xl">🎓</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Panel izquierdo - Formularios */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              
              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('plan')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                    activeTab === 'plan' 
                      ? 'bg-brand-blue text-white shadow-md' 
                      : 'bg-brand-light text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  📝 Plan de Clase
                </button>
                <button
                  onClick={() => setActiveTab('ejercicios')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                    activeTab === 'ejercicios' 
                      ? 'bg-brand-blue text-white shadow-md' 
                      : 'bg-brand-light text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ✏️ Ejercicios
                </button>
              </div>

              {/* Formulario Plan de Clase */}
              {activeTab === 'plan' && (
                <form onSubmit={handleGenerarPlan} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Materia
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {materias.map(materia => (
                        <button
                          key={materia.value}
                          type="button"
                          onClick={() => setFormPlan({...formPlan, materia: materia.value})}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            formPlan.materia === materia.value
                              ? 'border-brand-blue bg-brand-blue/10 text-brand-blue font-semibold'
                              : 'border-gray-200 hover:border-brand-blue/30'
                          }`}
                        >
                          <div className="text-2xl mb-1">{materia.emoji}</div>
                          <div className="text-xs">{materia.label.replace(materia.emoji, '').trim()}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tema de la clase
                    </label>
                    <input
                      type="text"
                      value={formPlan.tema}
                      onChange={(e) => setFormPlan({...formPlan, tema: e.target.value})}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none"
                      placeholder="Ej: Fracciones equivalentes"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duración (minutos)
                    </label>
                    <input
                      type="number"
                      value={formPlan.duracion_minutos}
                      onChange={(e) => setFormPlan({...formPlan, duracion_minutos: parseInt(e.target.value)})}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none"
                      min="30"
                      max="120"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Comentarios adicionales (opcional)
                    </label>
                    <textarea
                      value={formPlan.comentarios}
                      onChange={(e) => setFormPlan({...formPlan, comentarios: e.target.value})}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none resize-none"
                      placeholder="Ej: Enfocarse en ejemplos visuales, considerar estudiantes con dislexia..."
                      rows="3"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generando...
                      </span>
                    ) : (
                      '✨ Generar Plan de Clase'
                    )}
                  </button>
                </form>
              )}

              {/* Formulario Ejercicios */}
              {activeTab === 'ejercicios' && (
                <form onSubmit={handleGenerarEjercicios} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Materia
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {materias.map(materia => (
                        <button
                          key={materia.value}
                          type="button"
                          onClick={() => setFormEjercicios({...formEjercicios, materia: materia.value})}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            formEjercicios.materia === materia.value
                              ? 'border-brand-blue bg-brand-blue/10 text-brand-blue font-semibold'
                              : 'border-gray-200 hover:border-brand-blue/30'
                          }`}
                        >
                          <div className="text-2xl mb-1">{materia.emoji}</div>
                          <div className="text-xs">{materia.label.replace(materia.emoji, '').trim()}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tema
                    </label>
                    <input
                      type="text"
                      value={formEjercicios.tema}
                      onChange={(e) => setFormEjercicios({...formEjercicios, tema: e.target.value})}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none"
                      placeholder="Ej: Suma de fracciones"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        value={formEjercicios.cantidad}
                        onChange={(e) => setFormEjercicios({...formEjercicios, cantidad: parseInt(e.target.value)})}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none"
                        min="1"
                        max="20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Dificultad
                      </label>
                      <select
                        value={formEjercicios.dificultad}
                        onChange={(e) => setFormEjercicios({...formEjercicios, dificultad: e.target.value})}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none"
                      >
                        <option value="facil">Fácil</option>
                        <option value="media">Media</option>
                        <option value="dificil">Difícil</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Comentarios adicionales (opcional)
                    </label>
                    <textarea
                      value={formEjercicios.comentarios}
                      onChange={(e) => setFormEjercicios({...formEjercicios, comentarios: e.target.value})}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none resize-none"
                      placeholder="Ej: Incluir problemas de la vida cotidiana, usar ilustraciones..."
                      rows="3"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generando...
                      </span>
                    ) : (
                      '✨ Generar Ejercicios'
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

          {/* Panel derecho - Chat */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg h-[calc(100vh-12rem)] flex flex-col">
              
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-brand-blue" style={{fontFamily: 'Georgia, serif'}}>
                  💬 Conversación
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {messages.length === 0 
                    ? 'Completa el formulario y genera contenido para comenzar' 
                    : `${messages.length} mensaje${messages.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <div className="max-w-md">
                      <div className="text-6xl mb-4">🤖</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        ¡Bienvenido!
                      </h3>
                      <p className="text-gray-500">
                        Selecciona una materia y tema en el panel izquierdo para comenzar a generar contenido educativo.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`flex items-start gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.type === 'user' ? 'bg-brand-blue' : 'bg-brand-beige'
                          }`}>
                            {msg.type === 'user' ? '👤' : '🤖'}
                          </div>
                          <div className="flex-1">
                            <div className={`rounded-2xl p-4 ${
                              msg.type === 'user' 
                                ? 'bg-brand-blue text-white' 
                                : msg.type === 'error'
                                ? 'bg-red-50 text-red-800 border-2 border-red-200'
                                : 'bg-brand-light text-gray-800'
                            }`}>
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 px-2">
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
