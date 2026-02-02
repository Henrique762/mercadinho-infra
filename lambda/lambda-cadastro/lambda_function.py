import json
import os
from src.config.config import app, db
from src.Application.Validators.cadastro import create_user

def lambda_handler(event, context):
    """
    Handler para o cadastro de vendedores (/api/sellers)
    """
    try:
        # 1. Extração do corpo da requisição (JSON vindo do API Gateway)
        body = event.get('body')
        if not body:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Corpo da requisição ausente'})
            }
        
        forms_cadastro = json.loads(body)

        # 2. Execução dentro do contexto do Flask/SQLAlchemy
        # Isso é necessário para que o seu código de Model e DB funcione
        with app.app_context():
            # Chama a sua lógica de cadastro existente
            # create_user já faz a validação do form e persiste no banco
            resultado = create_user(forms_cadastro)
            
            # 3. Retorno no formato esperado pelo API Gateway
            return {
                'statusCode': resultado.get('status_code', 200),
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'  # Habilita CORS
                },
                'body': json.dumps({
                    'message': resultado.get('message'),
                    'errors': resultado.get('errors')
                }) if 'errors' in resultado else json.dumps({'message': resultado.get('message')})
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f"Erro interno: {str(e)}"})
        }