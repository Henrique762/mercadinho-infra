import logging
import sys

# Configuração básica de logging para enviar logs para o stdout
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)

from src.config.config import app, db
from src.Application.Controllers.route import cadastro_blueprint, ativacao_blueprint, venda_blueprint, login_blueprint, produtos_bp, health_bp
from flask_cors import CORS
from sqlalchemy import inspect

# Configuração do CORS para permitir o frontend
CORS(app, origins=[
    "https://frontend.henrique.local",
    "http://frontend.henrique.local",
    "http://localhost:8081",
    "http://localhost:5173"
])

app.register_blueprint(cadastro_blueprint)
app.register_blueprint(ativacao_blueprint)
app.register_blueprint(login_blueprint)
app.register_blueprint(venda_blueprint)
app.register_blueprint(produtos_bp)
app.register_blueprint(health_bp)

with app.app_context():
    try:
        inspector = inspect(db.engine)
        if not inspector.has_table("vendedores"):
            logging.info("Tabelas não encontradas, criando...")
            db.create_all()
            logging.info("Tabelas criadas com sucesso.")
        else:
            logging.info("Tabelas já existentes, pulando criação.")
    except Exception as e:
        logging.warning(f"Erro ou condição de corrida ao criar tabelas: {e}")

if __name__ == '__main__':
    app.run(host=app.config["HOST"], port = app.config['PORT'],debug=app.config['DEBUG'])
