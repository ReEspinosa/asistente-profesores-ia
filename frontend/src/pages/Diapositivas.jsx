import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generarDiapositivas } from '../services/api';

function Diapositivas() {
    const navigate = useNavigate();
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [tema, setTema] = useState('');
    const [numDiapositivas, setNumDiapositivas] = useState(8);
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState(null);

    const templates = [
        {
            id: 'default',
            name: 'Clasico Azul',
            description: 'Plantilla limpia y profesional en azul',
            color: 'bg-blue-100'
        },
        {
            id: 'ucalgary',
            name: 'Moderno Naranja',
            description: 'Diseno dinamico y llamativo',
            color: 'bg-orange-100'
        },
        {
            id: 'leiden',
            name: 'Elegante Azul Marino',
            description: 'Profesional para presentaciones formales',
            color: 'bg-indigo-100'
        },
        {
            id: 'cuerna',
            name: 'Minimalista Verde',
            description: 'Diseno limpio y minimalista',
            color: 'bg-teal-100'
        }
    ];

    const handleGenerar = async (e) => {
        e.preventDefault();

        if (!selectedTemplate) {
            alert('Por favor selecciona una plantilla');
            return;
        }

        setLoading(true);

        try {
            const response = await generarDiapositivas({
                template: selectedTemplate,
                tema: tema,
                num_diapositivas: numDiapositivas
            });

            // Crear un blob del archivo
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            });

            // Crear URL y descargar
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `presentacion_${tema.replace(/ /g, '_')}.pptx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            alert('Presentacion descargada exitosamente');
        } catch (error) {
            console.error('Error:', error);
            alert('Error al generar la presentacion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-beige">
            <header className="bg-brand-blue text-white py-4 px-8">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/recursos')} className="text-2xl hover:scale-110 transition-transform">
                            &larr;
                        </button>
                        <h1 className="text-3xl font-serif" style={{fontFamily: 'Georgia, serif'}}>
                            Generador de Diapositivas
                        </h1>
                    </div>
                    <button onClick={() => navigate('/')} className="hover:underline">
                        Inicio
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-8 py-12 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
                            <h2 className="text-2xl font-bold text-brand-blue mb-6">Configuracion</h2>

                            <form onSubmit={handleGenerar} className="space-y-6">
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-2">
                                        Tema de la presentacion
                                    </label>
                                    <input
                                        type="text"
                                        value={tema}
                                        onChange={(e) => setTema(e.target.value)}
                                        placeholder="Ej: La fotosintesis"
                                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-gray-700 mb-2">
                                        Numero de diapositivas
                                    </label>
                                    <input
                                        type="number"
                                        value={numDiapositivas}
                                        onChange={(e) => setNumDiapositivas(parseInt(e.target.value))}
                                        min="3"
                                        max="20"
                                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Entre 3 y 20 diapositivas</p>
                                </div>

                                {selectedTemplate && (
                                    <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                                        <p className="text-sm font-semibold text-green-800">
                                            Plantilla: {templates.find(t => t.id === selectedTemplate)?.name}
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !selectedTemplate}
                                    className="w-full bg-brand-blue text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Generando...' : 'Generar Presentacion'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-brand-blue mb-6">Selecciona una Plantilla</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template.id)}
                                    className={`${template.color} rounded-2xl p-6 text-left transition-all hover:scale-105 ${selectedTemplate === template.id ? 'ring-4 ring-brand-blue shadow-xl' : 'shadow-lg'}`}
                                >
                                    <div className="bg-white rounded-lg h-40 mb-4 flex items-center justify-center">
                                        <span className="text-6xl">📊</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {template.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {template.description}
                                    </p>

                                    {selectedTemplate === template.id && (
                                        <div className="mt-3 text-brand-blue font-semibold text-sm">
                                            Seleccionada
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {resultado && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="text-2xl font-bold text-brand-blue mb-4">
                                    {resultado.contenido.titulo_presentacion}
                                </h3>

                                <div className="space-y-6">
                                    {resultado.contenido.diapositivas.map((slide) => (
                                        <div key={slide.numero} className="border-2 border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="bg-brand-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                                    {slide.numero}
                                                </span>
                                                <h4 className="text-lg font-bold text-gray-800">
                                                    {slide.titulo}
                                                </h4>
                                            </div>
                                            <ul className="list-disc list-inside space-y-2 ml-11">
                                                {slide.contenido.map((punto, idx) => (
                                                    <li key={idx} className="text-gray-700">
                                                        {punto}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 flex gap-4">
                                    <button
                                        onClick={() => setResultado(null)}
                                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                    >
                                        Nueva presentacion
                                    </button>
                                    <button
                                        onClick={() => {
                                            const texto = JSON.stringify(resultado.contenido, null, 2);
                                            const blob = new Blob([texto], { type: 'text/plain' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = 'presentacion.json';
                                            a.click();
                                        }}
                                        className="flex-1 bg-brand-blue text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                                    >
                                        Descargar contenido
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Diapositivas;