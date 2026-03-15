from src.Infrastructure.Model.usuario import Vendedores
from src.config.config import db


def adicionar_vendedor(form):
    usuario = Vendedores(nome=form['nome'], cnpj=form['cnpj'], email=form['email'], senha=form['senha'], numero_cel=form['celular'])
    db.session.add(usuario)
    db.session.commit()
    id_user = str(usuario.id)
    return id_user

def validacao_vendedor(form):

    vendedor_cnpj = Vendedores.query.filter_by(cnpj=form['cnpj']).first()
    if vendedor_cnpj:
        return 'CNPJ já cadastrado.'
    
    vendedor_email = Vendedores.query.filter_by(email=form['email']).first()
    if vendedor_email:
        return 'Email já cadastrado.'
    
    return True

def valid_exist_vendedor(id):
    usuario = Vendedores.query.filter_by(id=id).first()
    if not usuario:
        return 'Usuario Inexistente'
    
    elif usuario.status == "Inativo":
        return 'Usuario Inativo'
    
    return True
