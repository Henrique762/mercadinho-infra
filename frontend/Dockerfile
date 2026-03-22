# Stage 1: Build da aplicação React
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Servindo os arquivos com Nginx
FROM nginx:alpine

# Upgrade das dependências para corrigir vulnerabilidades de segurança (CVEs)
RUN apk upgrade --no-cache

# Copia o build do Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Adiciona uma configuração customizada do Nginx
RUN printf 'server {\n\
    listen 80;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

# Copia o script de entrada
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

# Define o entrypoint customizado
ENTRYPOINT ["/entrypoint.sh"]
