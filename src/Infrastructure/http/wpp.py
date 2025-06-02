import random
from twilio.rest import Client
import os


def gerar_msg(codigo, numero):
    account_sid = ""
    auth_token = ""
    client = Client(account_sid, auth_token)

    message = client.messages.create(
    from_='whatsapp:+14155238886',
    body=f"Seu Código é:{codigo}",
    to=f"whatsapp:{numero}"
    )
    print(message)
