from src.Infrastructure.Model.produtos import Produtos, alterar_quantidade
from src.Infrastructure.Model.usuario import Vendedores
from src.Infrastructure.Model.vendas import adicionar_venda
from src.config.config import db

def valid_infos(form):
    id_produto = form['id_produto']
    id_vendedor = form['id_vendedor']

    produto = Produtos.query.filter_by(id=id_produto, id_vendedor=id_vendedor).first()

    ### Validacao Existencia Produto
    if not produto:
        raise ValueError('Produto Inexistente')

    if produto.status != "Ativo":
        raise ValueError('Produto Inativado')
    
    
    ### Validacao Quantidade em estoque
    
    quantidade = form['quantidade']
    quantidade_disponivel = produto.quantidade

    restante_estoque = quantidade_disponivel - quantidade

    if restante_estoque < 0:
        raise ValueError('Quantidade Indisponivel no Estoque', quantidade_disponivel)

    ### Valor Total Compra

    valor = produto.preco
    preco_total = valor * quantidade

    add = adicionar_venda(form, valor, preco_total)
    if add[0] == True:
        estoque = alterar_quantidade(id_produto, restante_estoque)

    return [estoque, preco_total]
    




        

