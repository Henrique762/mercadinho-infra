import re
from src.Application.Service.cadastro import adicionar_vendedor, validacao_vendedor
from src.Application.Validators.wpp import gerar_codigo
from src.Application.Service.wpp import cadastrar_codigo
from src.Infrastructure.http.wpp import gerar_msg


def validacao_nome(form):
    if "nome" not in form:
        raise ValueError("Campo não informado.")

    if form['nome'] is None:
        raise ValueError("Campo está vazio.")

    if not isinstance(form['nome'], str):
        raise ValueError("Campo deve ser uma String")
    
    if len(form['nome']) > 255:
        raise ValueError("Campo deve ter no máximo 255 caracteres.")
    
    return True
    
def validacao_cnpj(form):
    if "cnpj" not in form:
        raise ValueError("Campo não informado.")
    
    if form['cnpj'] is None:
        raise ValueError("Campo está vazio.")

    if not isinstance(form['cnpj'], str):
        raise ValueError("Campo deve ser uma String")
    
    if len(form['cnpj']) != 14:
        raise ValueError("Campo deve ter 14 Caracteres")
    
    return True

def validacao_email(form):
    if "email" not in form:
        raise ValueError("Campo não informado.")
    
    if form['email'] is None:
        raise ValueError("Campo está vazio.")

    if not isinstance(form['email'], str):
        raise ValueError("Campo deve ser uma String")
    
    if len(form['email']) > 255:
        raise ValueError("Campo deve ter no máximo 255 caracteres")
    
    valid_email = r"@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$"

    if re.search(valid_email, form['email']) is None:
        raise ValueError("Campo inválido")
    
    return True
    
def validacao_senha(form):
    if "senha" not in form:
        raise ValueError("Campo não informado.")
    
    if form['senha'] is None:
        raise ValueError("Campo está vazio.")

    if not isinstance(form['senha'], str):
        raise ValueError("Campo deve ser uma String")
    
    valid_senha = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$'
    
    if len(form['senha']) < 8 and re.search(valid_senha, form['senha']) is None :
        raise ValueError("Campo deve ter no mínimo 8 caracteres com maiusculas, minusculas e um caractere especial")
    
    return True

def validacao_celular(form):
    if "celular" not in form:
        raise ValueError("Campo não informado.")
    
    if form['celular'] is None:
        raise ValueError("Campo está vazio.")

    if not isinstance(form['celular'], str):
        raise ValueError("Campo deve ser uma String")
    
    valid_num = r"^\+\d{1,3}\d{2}\d{8,9}$"

    if re.search(valid_num, form['celular']) is None:
        raise ValueError("Número inválido. Use o formato: +DDIDDDNÚMERO (ex: +5511912345678)")
    
    return True

def validacao_form(form):
    errors = {}
    
    try:
        validacao_nome(form)
    except ValueError as e:
        errors['nome'] = str(e)

    try:
        validacao_cnpj(form)
    except ValueError as e:
        errors['cnpj'] = str(e)
    try:
        validacao_email(form)
    except ValueError as e:
        errors['email'] = str(e)

    try:
        validacao_senha(form)
    except ValueError as e:
        errors['senha'] = str(e)

    try:
        validacao_celular(form)
    except ValueError as e:
        errors['celular'] = str(e)

    if errors:
        return errors
    else:
        return True
    
def create_user(form):
    result_validacao = validacao_form(form)
    if result_validacao != True:
        return {'message': 'Erro no Cadastro do Usuario', 'errors': result_validacao, 'status_code': 400}
    
    result_exist_vendedor = validacao_vendedor(form)

    if result_exist_vendedor != True:
        return{'message': result_exist_vendedor, 'status_code': 400}

    status = adicionar_vendedor(form)
    codigo = gerar_codigo()
    cadastrar_codigo(codigo, status)
    gerar_msg(codigo, form['celular'])
    return {'message': 'Usuario Cadastrado, Realize a Validacao do Codigo', 'status_code': 200}
    

    
    

    

