#-*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
from crispander.app.models import Page
from datetime import datetime
import datetime as fechas

from django.core.paginator import Paginator

class NameCollection(models.Model):
    user = models.ForeignKey(User)
    name = models.CharField(max_length=100, help_text="nombre de la coleccion", default="Random")
    date = models.DateTimeField(auto_now=False, auto_now_add=True)

    class Meta:
        ordering = ["-date"]
        verbose_name_plural = "name collections"
        
    def __unicode__(self):
        return self.name
        
    def get_collection(self):
        """obtener todas las colleciones de dicha carpeta de colleciones"""
        value = Collection.objects.filter(namecollection=self)
        
        return value
    
    def get_number_collection(self):
        """obtener el numero de colleciones"""
        number_collection = self.get_collection()
        
        return number_collection.count()
        
    def get_modified_date(self):
        """devuelve la ultima fecha de modificacion de la colecion"""
        try:
            values = self.get_collection().order_by("-modified")[0]
        except IndexError:
            values = "Sin modificar"

        return values


class Collection(models.Model):
    user = models.ForeignKey(User)
    namecollection = models.ForeignKey(NameCollection)
    name = models.CharField(max_length=100, help_text="Escriba el titulo o nombre de el video")
    page = models.ForeignKey(Page)
    info = models.TextField(help_text="Escriba informacion relacionada con el video, la cancion o el autor", null=True, blank=True, default="=información= \n este campo esta creado para que cualquier persona escriba una **reseña** o información relacionada con el video solo oprima el botom editar y redacte la información, sientase libre de hacerlo es muy fácil. \n \\ \\ ----{{ http://www.wikicreole.org/attach/CheatSheet/creole_cheat_sheet.png | creole image }} \n [[ / | inicio]]")
    date = models.DateTimeField(auto_now=False, auto_now_add=True)
    modified = models.DateTimeField(auto_now=True, auto_now_add=True, null=True, blank=True)
    comment = models.TextField(null=True, blank=True)
    
    class Meta:
        ordering = ["-modified"]
        verbose_name_plural = "collections"
        
    def __unicode__(self):
        return self.page.name
    
    def on_like(self, user_std=None):
        """Confirma si el usuario actual le gusta este video"""
        if user_std:
            user_std = User.objects.get(pk=user_std)
            value = QualifyCollection.objects.filter(user=user_std, collection=self)
            number = value.count()
            
            if number >= 1:
                if value[0].value:
                    return "like"
                else:
                    return "likeno"
            else:
                return False
        else:
            return False
        
    
    def get_number_likes(self):
        """Devuelve el numero de likes que se le han asignado un video"""
        number = QualifyCollection.objects.filter(collection=self, value=True).count()
        
        return number
    
    def get_number_nolikes(self):
        """Devuelve el numero de likes que se le han asignado un video"""
        number = QualifyCollection.objects.filter(collection=self, value=False).count()
        
        return number
        
    def get_main_comments(self):
        """Devuelve los comentarios principales"""
        comments = Comment.objects.filter(collection=self)
        p = Paginator(comments, 6)
        page = p.page(1)
        
        if page.has_next:
            url = "/api/v1/comments/?collection=" + str(self.id) + "&offset=6&limit=6"
        else:
            url = ""
        
        send = (page.object_list, page.has_next(), url)

        return send
        
    def get_visits(self):
        """obtener todas la visitas"""
        visits = VisitCollection.objects.filter(collection__id=self.id).count()
        
        return visits

class GenMusic(models.Model):
    """generos de la musica electronica"""
    name = models.CharField(max_length=200)
    date = models.DateTimeField(auto_now_add=True, auto_now=True)
    info = models.TextField()
    
    class Meta:
        ordering = ["name"]
        verbose_name_plural = "generos de la musica"

    def __unicode__(self):
        return self.name

class GenMusicUser(models.Model):
    """generos de la musica electronica"""
    user = models.ForeignKey(User)
    gen_music = models.ForeignKey(GenMusic)
    date = models.DateTimeField(auto_now_add=True, auto_now=True)
    
    class Meta:
        ordering = ["-date"]
        verbose_name_plural = "generos por usuario"

    def __unicode__(self):
        return self.gen_music.name + "  " + self.user.username


class Follow(models.Model):
    """En este modelo se guardaran las suscripciones que se hagan 
    
    A cada uno de los usuarios de el sistema"""
    date = models.DateTimeField(auto_now=True, auto_now_add=True)
    user = models.ForeignKey(User, null=True, related_name="users")
    follow_to = models.ForeignKey(User, null=True, related_name="follow")
    send_message = models.BooleanField()
    
    class Meta:
        ordering = ["-date"]
        verbose_name_plural = "follows"
    
    def __unicode__(self):
        return self.user.first_name

class QualifyCollection(models.Model):
    """Valoracion a cada uno de los videos o imagenes o paginas
    
    la cual obtendra una buena o mala calificacion y su 
    total.
    
    """
    user = models.ForeignKey(User, null=True, blank=True)
    page = models.ForeignKey(Page, null=True, blank=True)
    collection = models.ForeignKey(Collection, null=True, blank=True)
    date = models.DateTimeField(auto_now=True, auto_now_add=True)
    value = models.BooleanField()
    
    def __unicode__(self):
        return self.collection.name

    class Meta:
        ordering = ["-date"]
        verbose_name_plural = "qualifies collection"
        

class Imagen(models.Model):
    user = models.ForeignKey(User)
    imagen = models.FileField(upload_to='perfiles/%Y/%m/%d')
    main = models.BooleanField()
    date = models.DateTimeField(auto_now=False, auto_now_add=True)
    
    def __unicode__(self):
        return str(self.id) + self.imagen.name
    
    class Meta:
        ordering = ['-date']
        verbose_name_plural = "imagenes usuario"
        

class Comment(models.Model):
    """Comentarios que se ha realizado ha dicha collecion."""
    collection = models.ForeignKey(Collection, null=True, blank=True, related_name="collections")
    page = models.ForeignKey(Page, null=True, blank=True, related_name="pages")
    imagen = models.ForeignKey(Imagen, null=True, blank=True, related_name="images")
    user = models.ForeignKey(User, null=True, blank=True, related_name="users_comment")
    comment = models.CharField(max_length=200)
    date = models.DateTimeField(auto_now=True, auto_now_add=True)
    
    def __unicode__(self):
        try:
            return self.user.username
        except AttributeError:
            return "sin_nombre"

    class Meta:
        ordering = ["-date"]
        verbose_name_plural = "comments"
    
    def get_raitings(self):
        """Devuelve la calificacion por commentario."""

        ok = CommentQualify.objects.filter(comment=self, value=True).count()
        bad = CommentQualify.objects.filter(comment=self, value=False).count()
        
        return (ok, bad, str(chr(ok + 32)))
    
    def on_like(self, user_std=None):
        """averigua si el usuario actual le gusta o no este comentario"""
        if user_std:
            user_std = User.objects.get(pk=user_std)
            value = CommentQualify.objects.filter(user=user_std, comment=self)
            number = value.count()
            
            if number >= 1:
                if value[0].value:
                    return "like"
                else:
                    return "likeno"
            else:
                return False
        else:
            return False
    
    def get_std_timer(self):
        """devuelve la hora en un formato adecuado para la pagina"""
        date = self.date
        current = datetime.now()
        menos_dia = fechas.timedelta(days=1)
        current = current - menos_dia
        
        if current > date:
            send = date.strftime("%x")
        else:
            send = date.strftime("%X")
        
        return send
   
        
class CommentQualify(models.Model):
    """calificacion a cada uno de los comenarios"""
    user = models.ForeignKey(User)
    comment = models.ForeignKey(Comment)
    date = models.DateTimeField(auto_now=True, auto_now_add=True)
    value = models.BooleanField()
    
    def __unicode__(self):
        return self.date.strftime("%A %B %Y- %H:%M:%S%p")

    class Meta:
        ordering = ["-date"]
        verbose_name_plural = "comments ratings"


class VisitCollection(models.Model):
    """Numero de visitas por collecion."""
    collection = models.ForeignKey(Collection, null=True, blank=True)
    date = models.DateTimeField(auto_now=True, auto_now_add=True)
    user = models.ForeignKey(User, null=True, blank=True)
    ip = models.CharField(max_length=20)
    
    def __unicode__(self):
        return self.date.strftime("%A %B %Y- %H:%M:%S%p")

    class Meta:
        ordering = ["-date"]
        verbose_name_plural = "visits"

