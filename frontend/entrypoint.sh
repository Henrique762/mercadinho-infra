#!/bin/sh
# Gera o arquivo config.js com a URL da API vinda do Deployment
echo "window.CONFIG = { VITE_API_URL: '${VITE_API_URL:-http://127.0.0.1:8888}' };" > /usr/share/nginx/html/config.js

# Inicia o Nginx normalmente
nginx -g "daemon off;"
