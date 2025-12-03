import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generarDiapositivas } from '../services/api';

function Diapositivas() {
    const navigate = useNavigate();
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [tema, setTema] = useState('');
    const [numDiapositivas, setNumDiapositivas] = useState(8);
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');

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
        setPdfUrl('');

        try {
            const response = await generarDiapositivas({
                template: selectedTemplate,
                tema: tema,
                num_diapositivas: numDiapositivas
            });

            console.log('Response:', response);
            alert('Presentacion generada exitosamente');
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Diapositivas;