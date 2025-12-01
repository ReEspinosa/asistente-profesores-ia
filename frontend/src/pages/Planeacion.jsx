import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generarPlanClase } from '../services/api';

function Planeacion() {
  const navigate = useNavigate();
  const [selectedCampo, setSelectedCampo] = useState('');
  const [tema, setTema] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState('');

  const campos = [
    { value: 'lenguaje', label: 'Lenguajes' },
    { value: 'pensamiento', label: 'Saberes y Pensamiento Científico' },
    { value: 'etica', label: 'Ética, Naturaleza y Sociedades' },
    { value: 'humano', label: 'De lo Humano y lo Comunitario' },
  ];

  const handleGenerar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await generarPlanClase({
        materia: selectedCampo,
        tema,
        duracion_minutos: 50,
        usar_rag: true
      });
      setResultado(response.data.contenido);
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-beige relative overflow-hidden">
      {/* Borde decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute top-0 right-0 h-full w-20" viewBox="0 0 100 1000" preserveAspectRatio="none">
          <path d="M100,0 Q50,50 100,100 T100,200 T100,300 T100,400 T100,500 T100,600 T100,700 T100,800 T100,900 T100,1000 L100,0 Z" 
                fill="none" stroke="#2b5287" strokeWidth="3"/>
        </svg>
      </div>

      {/* Estrellas decorativas */}
      <div className="absolute top-20 right-40 text-brand-blue text-2xl z-0">✦</div>
      <div className="absolute top-40 right-60 text-brand-blue text-xl z-0">✧</div>

      {/* Header */}
      <header className="bg-brand-blue text-white py-4 px-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-serif" style={{fontFamily: 'Georgia, serif'}}>
              Cuali.ai ✧
            </h1>
            <span className="text-sm uppercase tracking-wide">LA NUEVA ESCUELA MEXICANA</span>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={() => navigate('/')} className="hover:underline flex items-center gap-2">
              🏠
            </button>
            <button className="hover:underline">PLANEACIÓN</button>
            <button onClick={() => navigate('/recursos')} className="hover:underline">
              SOPORTE Y CONTACTO
            </button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="container mx-auto px-8 py-8 relative z-10">
        {/* 4 Campos Formativos */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {campos.map((campo) => (
            <button
              key={campo.value}
              onClick={() => setSelectedCampo(campo.value)}
              className={`h-20 rounded-lg font-semibold text-white transition-all ${
                selectedCampo === campo.value
                  ? 'bg-brand-blue ring-4 ring-brand-blue/50'
                  : 'bg-brand-blue hover:bg-opacity-80'
              }`}
            >
              {campo.label}
            </button>
          ))}
        </div>

        {/* Área de trabajo */}
        <div className="bg-white rounded-lg p-8 shadow-lg min-h-[500px]">
          {!selectedCampo ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>Selecciona un campo formativo para comenzar</p>
            </div>
          ) : (
            <form onSubmit={handleGenerar} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Tema de la clase
                </label>
                <input
                  type="text"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none"
                  placeholder="Ej: La comunicación efectiva"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-blue text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-gray-400"
              >
                {loading ? 'Generando...' : 'Generar Planeación'}
              </button>

              {resultado && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">{resultado}</pre>
                </div>
              )}
            </form>
          )}
        </div>
      </main>

      {/* Avatar usuario */}
      <div className="fixed bottom-8 right-8 w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
        <span className="text-2xl">👤</span>
      </div>
    </div>
  );
}

export default Planeacion;
