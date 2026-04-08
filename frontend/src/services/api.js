import axios from 'axios';

const API = axios.create({
    baseURL: '/api'
});

export const generarPlanClase = (data) => API.post('/generar-plan-clase', data);
export const generarEjercicios = (data) => API.post('/generar-ejercicios', data);

export const enviarMensajeCasual = async (mensaje, historial = []) => {
    return API.post('/chat-casual/mensaje', { mensaje, historial });
};

export const obtenerBienvenida = async () => {
    return API.get('/chat-casual/bienvenida');
};

export const generarDiapositivas = async (data) => {
    return API.post('/generar-diapositivas', data, { responseType: 'blob' });
};
