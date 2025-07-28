import random
from src.Application.Service.wpp import validar_cod_e_tel
import re

def gerar_codigo():
    codigo = ""
    for num in range(4):
        numero = str(random.randint(1, 9))
        codigo += numero
    return codigo

def ativacao_cod(form):
    validacao = validacao_form(form)
    print(validacao)
    if validacao != True:
        return {'message': 'Erro no formulário do código', 'errors': validacao}
    validar = validar_cod_e_tel(form['codigo'], form['celular'])
    return validar

def validacao_codigo(form):
    if "codigo" not in form:
        raise ValueError("Campo não informado.")

    if form['codigo'] is None:
        raise ValueError("Campo está vazio.")

    if not isinstance(form['codigo'], str):
        raise ValueError("Campo deve ser uma String")
    
    if  len(form['codigo']) != 4:
        raise ValueError("Campo deve ter 4 caracteres.")
    
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
        validacao_codigo(form)
    except ValueError as e:
        errors['codigo'] = str(e)

    try:
        validacao_celular(form)
    except ValueError as e:
        errors['celular'] = str(e)

    if errors:
        return errors
    else:
        return True    
