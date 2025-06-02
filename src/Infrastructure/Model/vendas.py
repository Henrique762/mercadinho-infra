from src.config.config import db

class Vendas(db.Model):
    __tablename__ = "vendas"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    id_produto = db.Column(db.Integer, db.ForeignKey('produtos.id', ondelete="CASCADE"), nullable=False)
    id_vendedor = db.Column(db.Integer, db.ForeignKey('vendedores.id', ondelete="CASCADE"), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    valor_produto = db.Column(db.Float, nullable=False)
    valor_total = db.Column(db.Float, nullable=False)


def adicionar_venda(form, valor_produto, valor_total):
    id_produto = form['id_produto']
    id_vendedor = form['id_vendedor']
    quantidade = form['quantidade']

    venda = Vendas(id_produto=id_produto, id_vendedor=id_vendedor, quantidade=quantidade, valor_produto=valor_produto, valor_total=valor_total)
    db.session.add(venda)
    db.session.commit()
    id_venda = str(venda.id)

    return [True, id_venda]

def select_vendas(id):
    venda = db.session.query(Vendas).filter_by(id=id).first()

    valor_total = venda.valor_total
    quantidade = venda.quantidade

    return [valor_total, quantidade]