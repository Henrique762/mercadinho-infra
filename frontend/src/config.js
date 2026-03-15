// Em produção, ele lê do window.CONFIG injetado pelo Nginx no entrypoint.
// Em desenvolvimento (local), ele usa a URL padrão do Vite se não houver o window.CONFIG.

const API_URL = (window.CONFIG && window.CONFIG.VITE_API_URL) 
                || import.meta.env.VITE_API_URL 
                || 'http://127.0.0.1:8888';

export default API_URL;
