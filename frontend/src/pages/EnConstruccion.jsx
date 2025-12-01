import { useNavigate } from 'react-router-dom';

function EnConstruccion() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-beige flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-8xl mb-6">🚧</div>
        <h1 className="text-4xl font-bold text-brand-blue mb-4">
          En Construcción
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Estamos trabajando en esta sección. ¡Pronto estará disponible!
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-brand-blue text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-blue-light transition-colors shadow-lg"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}

export default EnConstruccion;
