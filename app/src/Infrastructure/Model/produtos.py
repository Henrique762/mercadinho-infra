from src.config.config import db

class Produtos(db.Model):
    __tablename__ = "produtos"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    id_vendedor = db.Column(db.Integer, db.ForeignKey('vendedores.id', ondelete="CASCADE"), nullable=False)
    nome = db.Column(db.String(100), nullable=False)
    preco = db.Column(db.Float, nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='Ativo')
    imagem = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "id_vendedor": self.id_vendedor,
            "quantidade": self.quantidade,
            "preco": self.preco,
            "status": self.status,
            "imagem": self.imagem
        }

def listar_produto(id):
    produtos = db.session.query(Produtos).filter_by(id_vendedor=id).all()
    resultado = [a.to_dict() for a in produtos]

    return resultado


def alterar_quantidade(id, quant):
    produto = db.session.query(Produtos).filter_by(id=id).first()
    
    produto.quantidade = quant

    db.session.commit()

    produto = db.session.query(Produtos).filter_by(id=id).first()

    return produto.quantidade

def alterar_produto(data):
    produto_id = data['id_produto']
    produto = Produtos.query.get(produto_id)

    try:
        produto.id_vendedor = data['id_vendedor']
        produto.nome = data['nome']  # Adicionado
        produto.quantidade = data['quantidade']
        produto.preco = float(data['preco'])  # Alterado de "valor" para "preco"
        produto.status = data['status']

        db.session.commit()
        return {'message': 'Produto atualizado com sucesso', "status_code": 200}

    except Exception as e:
        db.session.rollback()
        return {'message': f'Erro ao atualizar produto: {str(e)}', "status_code": 500}

def inativar_produto(produto_id):
    produto = db.session.query(Produtos).filter_by(id=produto_id).first()

    if not produto:
        return False, 'Produto não encontrado'

    produto.status = 'Inativo'
    db.session.commit()
    return True, 'Produto inativado com sucesso'