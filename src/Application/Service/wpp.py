from src.config.config import db
from src.Infrastructure.Model.wpp import Validacao
from src.Infrastructure.Model.usuario import Vendedores

def cadastrar_codigo(codigo, cliente):
    codigo_wpp = Validacao(codigo=codigo, cliente=cliente)
    db.session.add(codigo_wpp)
    db.session.commit()
    
def validar_cod_e_tel(cod, celular):
    codigo_user = Validacao.query.filter_by(codigo=cod).first()
    if not codigo_user: 
        return 'Codigo inexistente!' 
    
    usuario = Vendedores.query.get(codigo_user.cliente)
    if usuario.numero_cel == celular and codigo_user.codigo == cod:
        alterar_status(codigo_user.cliente)
        return 'Número válido!'
    else:
        return 'Número inválido!'
    
def alterar_status(id): 
    usuario = db.session.query(Vendedores).filter_by(id=id).first()
    usuario.status = 'Ativo'
    db.session.commit()
    return True