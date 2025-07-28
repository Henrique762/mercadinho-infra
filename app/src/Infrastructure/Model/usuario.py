from src.config.config import db

class Vendedores(db.Model):
    __tablename__ = "vendedores"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    nome = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    cnpj = db.Column(db.String(14), nullable=False, unique=True)
    senha = db.Column(db.String(255), nullable=False)
    numero_cel = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String, nullable=False, default='Inativo')
