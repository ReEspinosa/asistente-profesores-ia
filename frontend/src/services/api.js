import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api'
});

export const generarPlanClase = (data) => API.post('/generar-plan-clase', data);
export const generarEjercicios = (data) => API.post('/generar-ejercicios', data);
