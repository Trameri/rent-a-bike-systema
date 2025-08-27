import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
export const api = axios.create({ baseURL });

export function setToken(t){
  localStorage.setItem('token', t);
  api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
}

export function getToken(){
  const t = localStorage.getItem('token');
  if(t) api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
  return t;
}

export function clearToken(){
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
}

// Inizializza il token all'avvio se presente
getToken();

// Interceptor per debug delle richieste
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor per debug delle risposte
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);
