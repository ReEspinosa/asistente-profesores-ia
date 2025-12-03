import { useNavigate } from 'react-router-dom';

function Recursos() {
    const navigate = useNavigate();

    const herramientas = [
        {
            title: 'Diapositivas',
            color: 'bg-orange-100',
            emoji: '📊',
            disponible: true,
            ruta: '/diapositivas'
        },
        {
            title: 'Generador de Exámenes',
            color: 'bg-slate-200',
            emoji: '📝',
            disponible: false
        },
        {
            title: 'Banco de Actividades',
            color: 'bg-teal-100',
            emoji: '🎯',
            disponible: false
        },
        {
            title: 'Calendario Escolar',
            color: 'bg-amber-100',
            emoji: '📅',
            disponible: false
        },
        {
            title: 'Material Didáctico',
            color: 'bg-rose-100',
            emoji: '🎨',
            disponible: false
        },
        {
            title: 'Rúbricas de Evaluación',
            color: 'bg-violet-100',
            emoji: '✅',
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

            {/* Título */}
            <main className="container mx-auto px-8 py-12">
                <h2 className="text-4xl font-bold text-brand-blue mb-12 text-center" style={{fontFamily: 'Georgia, serif'}}>
                    Recursos Educativos
                </h2>

                {/* Grid de recursos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {herramientas.map((tool, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(tool.ruta || '/en-construccion')}
                            className={`${tool.color} rounded-3xl p-8 h-64 relative overflow-hidden hover:scale-105 transition-all shadow-lg group flex flex-col items-center justify-center`}
                        >
                            {/* Emoji grande y centrado */}
                            <div className="text-8xl mb-6" style={{
                                filter: 'contrast(1.1) saturate(1.1)',
                                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                                {tool.emoji}
                            </div>

                            {/* Título */}
                            <h3 className="text-2xl font-bold text-gray-800 text-center px-4" style={{fontFamily: 'Georgia, serif'}}>
                                {tool.title}
                            </h3>

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-3xl" />
                        </button>
                    ))}
                </div>

                {/* Nota informativa */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 text-sm">
                        Estas herramientas estarán disponibles próximamente
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Recursos;