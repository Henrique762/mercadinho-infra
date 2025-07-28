from src.Application.Service.cadastro import valid_exist_vendedor
from src.Application.Service.vendas import valid_infos

def validacao_id_produto(form):
    if "id_produto" not in form:
        raise ValueError("Campo não informado.")
    
    if form['id_produto'] is None:
        raise ValueError("Campo está vazio.")

    if not isinstance(form['id_produto'], int):
        raise ValueError("Campo deve ser um Int")
    
    return True

    
def validacao_id_vendedor(form):
    if "id_vendedor" not in form:
        raise ValueError("Campo não informado.")
    
    if form['id_vendedor'] is None:
        raise ValueError("Campo está vazio.")
    
    if not isinstance(form['id_vendedor'], int):
        raise ValueError("Campo deve ser um Int")
    
    
    ### Validação para verificar se o seller existe
    validar_vend = valid_exist_vendedor(form['id_vendedor'])

    if validar_vend != True:
        raise ValueError(f"{validar_vend}")
    
    return True

    
    
def validacao_quantidade(form):
    #### Validacao Forms
    if "quantidade" not in form:
        raise ValueError("Campo não informado.")
    
    if form['quantidade'] is None:
        raise ValueError("Campo está vazio.")
    
    if not isinstance(form['quantidade'], int):
        raise ValueError("Campo deve ser um Int")
  
    return True
    

def validacao_venda(form):
    errors = {}
    
    try:
        validacao_id_produto(form)
    except ValueError as e:
        errors['id_produto'] = str(e)

    try:
        validacao_id_vendedor(form)
    except ValueError as e:
        errors['id_vendedor'] = str(e)

    try:
        validacao_quantidade(form)
    except ValueError as e:
        errors['quantidade'] = str(e)

    if errors:
        return errors
    else:
        return True


def create_venda(form):
    result_validacao = validacao_venda(form)
    if result_validacao != True:
        return {"message": "Erro no Formulario de venda", "errors": result_validacao, "status_code": 400}
    
    try: 
        result = valid_infos(form)
    except ValueError as e:

        if len(e.args) > 1:
            return {"message": str(e.args[0]), "Estoque de Produtos": str(e.args[1]), "status_code": 400}
        
        else:
            return {"message": str(e), "status_code": 400}
    
    return {"message": "Venda Registrada", "Estoque de Produtos": result[0], "Valor Total": result[1], "status_code": 200}