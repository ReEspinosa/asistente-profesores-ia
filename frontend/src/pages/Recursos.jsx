import { useNavigate } from 'react-router-dom';

function Recursos() {
  const navigate = useNavigate();

  const herramientas = [
    { 
      title: 'Diapositivas', 
      color: 'bg-blue-200',
      imagen: '👩‍🏫',
      disponible: false 
    },
    { 
      title: 'Recursos Visuales', 
      color: 'bg-purple-200',
      imagen: '🌿',
      disponible: false 
    },
    { 
      title: 'Planeaciones', 
      color: 'bg-yellow-600',
      imagen: '📱',
      disponible: false 
    },
    { 
      title: 'Otras herramientas', 
      color: 'bg-yellow-100',
      imagen: '🌺',
      disponible: false 
    },
    { 
      title: 'Calendario SEP', 
      color: 'bg-orange-500',
      imagen: '🍃',
      disponible: false 
    },
    { 
      title: 'Plataforma SEP', 
      color: 'bg-blue-100',
      imagen: '🌿',
      disponible: false 
    },
  ];

  return (
    <div className="min-h-screen bg-brand-beige">
      {/* Header */}
      <header className="bg-brand-blue text-white py-4 px-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-serif" style={{fontFamily: 'Georgia, serif'}}>
              Cuali.ai ✧
            </h1>
            <span className="text-sm uppercase tracking-wide">LA NUEVA ESCUELA MEXICANA</span>
          </div>
          <button onClick={() => navigate('/')} className="hover:underline flex items-center gap-2">
            🏠 Inicio
          </button>
        </div>
      </header>

      {/* Grid de recursos */}
      <main className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {herramientas.map((tool, idx) => (
            <button
              key={idx}
              onClick={() => navigate('/en-construccion')}
              className={`${tool.color} rounded-3xl p-8 h-72 relative overflow-hidden hover:scale-105 transition-all shadow-lg group`}
            >
              {/* Decoración */}
              <div className="absolute top-4 right-4 text-3xl opacity-40">
                {tool.imagen}
              </div>
              {tool.disponible && (
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/30 rounded-full flex items-center justify-center text-xl">
                  ➕
                </div>
              )}

              {/* Título */}
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-3xl font-bold text-gray-800" style={{fontFamily: 'Georgia, serif'}}>
                  {tool.title}
                </h3>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Recursos;
