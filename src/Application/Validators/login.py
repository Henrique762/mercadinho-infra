from src.Application.Service.login import vendedor_cadastrado, vendedor_senha

def validacao_email(form):
    if "email" not in form:
        raise ValueError("Campo não informado.")
    
    if form['email'] is None:
        raise ValueError("Campo está vazio.")

    if not isinstance(form['email'], str):
        raise ValueError("Campo deve ser uma String")
    
    if not vendedor_cadastrado(form):
        raise ValueError("Email não encontrado!")
    
def validacao_senha(form):
    if "senha" not in form:
        raise ValueError("Campo não informado.")
    
    if form['senha'] is None:
        raise ValueError("Campo está vazio.")
    
    senha_valida = vendedor_senha(form)
    
    if not senha_valida['status']:
        raise ValueError(senha_valida['message'])
    else:
        return senha_valida

def validacao_login(form):
    errors = {}
    
    try:
        validacao_email(form)
    except ValueError as e:
        errors['email'] = str(e)

    try:
        validacao_senha(form)
    except ValueError as e:
        errors['senha'] = str(e)

    if errors:
      return {"message": "Erro na autenticação do usuário", "errors": errors, "status": 400}
    else:
      return validacao_senha(form)
        
    
def login_user(form):
    result_login = validacao_login(form)
    return result_login