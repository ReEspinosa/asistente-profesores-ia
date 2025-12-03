import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Planeacion from './pages/Planeacion';
import Recursos from './pages/Recursos';
import Plantillas from './pages/Plantillas';
import EnConstruccion from './pages/EnConstruccion';
import Diapositivas from './pages/Diapositivas'; //

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/planeacion" element={<Planeacion />} />
                <Route path="/recursos" element={<Recursos />} />
                <Route path="/plantillas" element={<Plantillas />} />
                <Route path="/diapositivas" element={<Diapositivas />} /> {/*  */}
                <Route path="/en-construccion" element={<EnConstruccion />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;