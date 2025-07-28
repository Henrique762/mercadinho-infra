from src.Infrastructure.Model.produtos import Produtos, alterar_produto, inativar_produto
from src.config.config import db

def validar_produto(data):
    produto_id = data['id_produto']
    produto = db.session.query(Produtos).filter_by(id=produto_id).first()

    if not produto:
        return {'message': 'Produto não encontrado', "status_code": 400}

    return alterar_produto(data)


def in_produto(id_vendedor, produto_id):
    produto = db.session.query(Produtos).filter_by(id=produto_id, id_vendedor=id_vendedor).first()

    if not produto:
        return {'message': 'Produto não encontrado', 'status_code': 404}

    sucesso, mensagem = inativar_produto(produto_id)

    if not sucesso:
        return {'message': mensagem, 'status_code': 400}

    return {'message': mensagem, 'status_code': 200}