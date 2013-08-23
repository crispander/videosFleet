#!/usr/bin/python
#-*- coding: utf-8 -*-
#
#----------------------------------------
# Modulo utilizado para simplificar el uso
# de correo electronico
# este utiliza de el modulo mailer
# lo unico que hace es simplificarlo y reducir d¿sus acciones
# pero teniendo el mismo efecto
# copyright: cristian david montoya 
#
#----------------------------------------
#

from mailer import Mailer
from mailer import Message
import smtplib

class MyEmail():
    """Enviar correo electrinoci facilmente."""
    def __init__(self, recipient):
        """iniciador de la clase"""
        self.recipient = recipient
        self.message = Message(From="youtufan.web@gmail.com", To=[recipient, "youtufan.web@gmail.com"],
            charset="utf-8")

    def set_structure(self, message, html):
        """Crea la estructura de el mensaje"""
        self.message.Subject = "Confirmacion de correo"
        self.message.Html = html
        self.message.Body = message

    def send_email(self):
        """Envia el correo"""
        sender = Mailer("smtp.gmail.com", 587, True)
        sender.login("youtufan.web@gmail.com", "90062957564")
        try:
            sender.send(self.message)
        except smtplib.AMTPAuthenticationError as Error:
            print(Error)
            return False
        except IOError as (error_string, error_number):
            print(str(error_string) + " " + str(error_number))
            return False
        else:
            return True
