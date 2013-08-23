from accounts.models import *
from django.http import HttpResponse
from django.contrib.auth.models import User

from django.shortcuts import redirect, render
from django.contrib.auth import authenticate

def edit_user(request, pk):
    """Vista para editar datos de usuario
    
    Espera recibir una peticion post y un respectivo 
    conjunto de claves de keyrwords como son:
    
    REQUEST['firstname']
    REQUEST['lastname']
    REQUEST['email']
    REQUEST['genere']
    REQUEST['description']
    
    """
    if not request.user.is_authenticated():
        return redirect("/")
    else:
        try:
            url = request.REQUEST['url']
        except KeyError:
            url = "/home/configuration/" + pk

        try:
            firstname = request.REQUEST['firstname']
            lastname  = request.REQUEST['lastname']
            email = request.REQUEST['email']
            genere = request.REQUEST['genere']
            desc = request.REQUEST['description']
            country = request.REQUEST['country']
        except KeyError:
            send = "bad query - error en la peticion --> id(" + pk + ")"
        else:
            try:
                user = User.objects.get(pk=pk)
            except User.DoesNotExist:
                send = "el usuario no existe"
            else:
                user.first_name = firstname
                user.last_name = lastname
                user.email = email
                user.save()
                
                profile = user.get_profile()
                profile.genere = genere
                profile.comment = desc
                profile.country = country
                profile.save()
                
                send = "Solicitud Exitosa usuario " + pk + "fue editado"
            

    return redirect(url)

def set_password(request, pk):
    """comprueba la nueva contrasena y asigna una nueva"""
    if not request.user.is_authenticated():
        return HttpResponse("error:no esta autentificado", "text/plain")
    else:
        user_m = User.objects.get(pk=pk)
        if user_m.pk == request.user.pk:
            try:
                password_before = request.REQUEST['passw_before']
            except KeyError:
                return HttpResponse("error:falta la clave passw_before", "text/plain")

            user = authenticate(username=user_m.username, password=password_before)
            if user is not None:
                try:
                    password_after = request.REQUEST['passw_after']
                except KeyError:
                    return HttpResponse("error:falta la clave passw_after", "text/plain")
                else:
                    user_m.set_password(password_after)
                    user_m.save()
                    return HttpResponse("OK:guardado", "text/plain")
            else:
                return HttpResponse("error:contrasena actual erronea", "text/plain")

        else:
            return HttpResponse("0", "text/plain")
    
