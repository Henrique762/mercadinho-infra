from src.config.config import db

class Validacao (db.Model):
    __tablename__ = "validacao"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    codigo = db.Column(db.String(4), nullable=False)
    cliente = db.Column(db.Integer, db.ForeignKey('vendedores.id', ondelete="CASCADE"), nullable=False)