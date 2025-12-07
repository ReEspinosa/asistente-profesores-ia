import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-brand-beige relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 pointer-events-none z-0">
                <svg className="absolute top-0 left-0 h-full" style={{width: '60px'}} viewBox="0 0 60 1000" preserveAspectRatio="none">
                    <path d="M0,0 Q30,50 0,100 T0,200 T0,300 T0,400 T0,500 T0,600 T0,700 T0,800 T0,900 T0,1000 L0,0 Z"
                          fill="none" stroke="#2b5287" strokeWidth="3"/>
                </svg>
                <svg className="absolute top-0 right-0 h-full" style={{width: '60px'}} viewBox="0 0 60 1000" preserveAspectRatio="none">
                    <path d="M60,0 Q30,50 60,100 T60,200 T60,300 T60,400 T60,500 T60,600 T60,700 T60,800 T60,900 T60,1000 L60,0 Z"
                          fill="none" stroke="#2b5287" strokeWidth="3"/>
                </svg>
            </div>

            <header className="bg-brand-blue text-white py-4 px-8 relative z-10">
                <nav className="container mx-auto flex items-center justify-between text-sm">
                    <div className="flex items-center gap-8">
                        <button onClick={() => navigate('/planeacion')} className="hover:underline uppercase">
                            Planeacion
                        </button>
                        <button onClick={() => navigate('/plantillas')} className="hover:underline uppercase">
                            Plantillas
                        </button>
                        <button onClick={() => navigate('/recursos')} className="hover:underline uppercase">
                            Recursos
                        </button>
                    </div>
                    <div className="flex items-center gap-8">
                        <button onClick={() => navigate('/recursos')} className="hover:underline uppercase">
                            Preguntas Frecuentes
                        </button>
                        <button onClick={() => navigate('/recursos')} className="hover:underline uppercase">
                            Soporte y Contacto
                        </button>
                    </div>
                </nav>
            </header>

            <main className="flex-1 flex items-center justify-center relative z-10 px-8">
                <div className="text-center w-full max-w-4xl relative">
                    <div className="absolute" style={{top: '-80px', left: '15%'}}>
                        <span className="text-brand-blue text-3xl">*</span>
                    </div>
                    <div className="absolute" style={{top: '-60px', left: '20%'}}>
                        <span className="text-brand-blue text-xl">*</span>
                    </div>
                    <div className="absolute" style={{top: '-80px', right: '15%'}}>
                        <span className="text-brand-blue text-4xl">*</span>
                    </div>
                    <div className="absolute" style={{top: '-50px', right: '20%'}}>
                        <span className="text-brand-blue text-2xl">*</span>
                    </div>

                    <h1 className="text-8xl md:text-9xl font-serif text-brand-blue mb-12" style={{fontFamily: 'Georgia, serif'}}>
                        Cuali.ai
                    </h1>

                    <button
                        onClick={() => navigate('/chat')}
                        className="bg-brand-blue text-white px-16 py-5 rounded-full text-xl font-semibold hover:bg-opacity-90 transition-all shadow-xl"
                    >
                        Iniciar Conversacion
                    </button>
                </div>
            </main>

            <footer className="relative z-10 px-8 py-6 flex items-center justify-between text-brand-blue">
                <div className="text-sm font-bold uppercase tracking-widest">
                    La Nueva Escuela Mexicana
                </div>
                <div className="text-lg font-serif" style={{fontFamily: 'Georgia, serif'}}>
                    Usuario
                </div>
            </footer>
        </div>
    );
}

export default Home;