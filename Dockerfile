# Imagem base
FROM python:3.11-slim

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos de requirements para o container
COPY /app/requirements.txt .

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante da aplicação para o container
COPY app/ .

# Expõe a porta que a aplicação vai rodar
EXPOSE 8888

# Comando para iniciar o Gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8888", "app:app"]
