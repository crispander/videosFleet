#
# -*- coding: utf-8 -*-
#-------------------------------------------------------------------
# Recursos de django, son unas funciones creadas
# para ayudar con procesos de filtrado o otras operaciones
# todo esta hecho con python, basicamente son funciones 
# reutilizables usadas por init, inicializadores de clases y señales.
#
# cristian david montoya saldarriaga copyright-2012
#-------------------------------------------------------------------
#

def filter_name(value):
    filters = ['"', ' ', "'", "<", ">"]
    response = value
    for i in filters:
        response = response.replace(i, "")
    
    return response
