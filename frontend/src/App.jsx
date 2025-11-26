import { useState } from 'react';
import { generarPlanClase, generarEjercicios } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('plan');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState('');
  
  const [formPlan, setFormPlan] = useState({
    materia: 'matematicas',
    tema: '',
    duracion_minutos: 50,
    usar_rag: true
  });

  const handleGenerarPlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await generarPlanClase(formPlan);
      setResultado(response.data.contenido);
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-6">
        <h1 className="text-3xl font-bold">🎓 Asistente de Profesores IA</h1>
        <p className="text-blue-100">Nueva Escuela Mexicana - 6to Grado</p>
      </header>

      <main className="container mx-auto p-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-4 py-2 rounded ${activeTab === 'plan' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Plan de Clase
            </button>
            <button
              onClick={() => setActiveTab('ejercicios')}
              className={`px-4 py-2 rounded ${activeTab === 'ejercicios' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Ejercicios
            </button>
          </div>

          {activeTab === 'plan' && (
            <form onSubmit={handleGenerarPlan} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Materia</label>
                <select
                  value={formPlan.materia}
                  onChange={(e) => setFormPlan({...formPlan, materia: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="matematicas">Matemáticas</option>
                  <option value="espanol">Español</option>
                  <option value="ciencias_naturales">Ciencias Naturales</option>
                  <option value="historia">Historia</option>
                  <option value="geografia">Geografía</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Tema</label>
                <input
                  type="text"
                  value={formPlan.tema}
                  onChange={(e) => setFormPlan({...formPlan, tema: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Ej: Fracciones equivalentes"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Generando...' : 'Generar Plan de Clase'}
              </button>
            </form>
          )}

          {resultado && (
            <div className="mt-6 p-4 bg-gray-50 rounded border">
              <h3 className="font-bold text-lg mb-3">Resultado:</h3>
              <pre className="whitespace-pre-wrap text-sm">{resultado}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
