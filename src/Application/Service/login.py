from flask import request, jsonify 
from src.Infrastructure.Model.usuario import Vendedores
from flask_jwt_extended import create_access_token, jwt_required

def vendedor_cadastrado(form):
    vendedor = Vendedores.query.filter_by(email=form['email']).first()
    return vendedor is not None 

def vendedor_senha(form):
    vendedor = Vendedores.query.filter_by(email=form['email']).first()

    if not vendedor or vendedor.senha != form['senha']:
        return {"message": "E-mail ou senha inválidos.", "status": False}

    if vendedor.status != 'Ativo':
        return {"message": "Usuário inativo. Não é possível fazer login.", "status": False}
    
    access_token = create_access_token(identity=str(vendedor.id))

    return {"message": f"Bem-vindo, {vendedor.nome}!",
            "access_token": access_token, "status": 200, "id": vendedor.id, "nome": vendedor.nome }


