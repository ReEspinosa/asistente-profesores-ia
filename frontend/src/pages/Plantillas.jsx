import { useNavigate } from 'react-router-dom';

function Plantillas() {
  const navigate = useNavigate();

  const plantillas = [
    { title: 'Generador de Exámenes', color: 'bg-blue-200', emoji: '📝' },
    { title: 'Banco de Actividades', color: 'bg-green-200', emoji: '🎯' },
    { title: 'Rúbricas de Evaluación', color: 'bg-purple-200', emoji: '✅' },
    { title: 'Material Didáctico', color: 'bg-pink-200', emoji: '🎨' },
    { title: 'Calendario Escolar', color: 'bg-yellow-200', emoji: '📅' },
    { title: 'Reportes de Progreso', color: 'bg-orange-200', emoji: '📊' },
  ];

  return (
    <div className="min-h-screen bg-brand-beige">
      <header className="bg-brand-blue text-white py-4 px-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-serif" style={{fontFamily: 'Georgia, serif'}}>
              Cuali.ai ✧
            </h1>
            <span className="text-sm uppercase tracking-wide">LA NUEVA ESCUELA MEXICANA</span>
          </div>
          <button onClick={() => navigate('/')} className="hover:underline">
            🏠 Inicio
          </button>
        </div>
      </header>

      <main className="container mx-auto px-8 py-12">
        <h2 className="text-4xl font-bold text-brand-blue mb-8 text-center">Plantillas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plantillas.map((plantilla, idx) => (
            <button
              key={idx}
              onClick={() => navigate('/en-construccion')}
              className={`${plantilla.color} rounded-3xl p-8 h-64 relative hover:scale-105 transition-all shadow-lg`}
            >
              <div className="text-6xl mb-4">{plantilla.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-800">{plantilla.title}</h3>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Plantillas;
