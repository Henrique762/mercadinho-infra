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

# Garante que os logs do Python sejam enviados direto para o stdout sem buffering
ENV PYTHONUNBUFFERED=1

# Comando para iniciar o Gunicorn com logs habilitados para stdout
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8888", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
