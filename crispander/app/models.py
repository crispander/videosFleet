#-*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
from resources.foo import *
import re

import urllib2
import simplejson

from gdata.youtube.service import YouTubeService

def PrintEntryDetails(entry):
  print 'Video title: %s' % entry.media.title.text
  print 'Video published on: %s ' % entry.published.text
  print 'Video description: %s' % entry.media.description.text
  print 'Video tags: %s' % entry.media.keywords.text
  print 'Video watch page: %s' % entry.media.player.url
  print 'Video flash player URL: %s' % entry.GetSwfUrl()
  print 'Video duration: %s' % entry.media.duration.seconds
    
def PrintVideoFeed(feed):
  for entry in feed.entry:
    PrintEntryDetails(entry)
    
def GetAndPrintUserUploads(uri):
    yt_service = YouTubeService()

    try:
        return yt_service.GetYouTubeVideoEntry(video_id=uri).media.duration.seconds
    except:
        return False
        
class Page(models.Model):
    """Pagina que ira a tener una conjunto de funciones, como calificacion, 
    videos imagenes, visitas, comentarios."""
    name = models.CharField(max_length=100, help_text="Escriba el titulo o nombre de el video")
    date = models.DateTimeField(auto_now=True, auto_now_add=True)
    author = models.ForeignKey(User, help_text="Seleccione el nombre de el autor principal")
    path = models.CharField(max_length=50, null=True, blank=True)
    video = models.CharField(max_length=500, help_text="codigo de el video de youTube")
    body = models.CharField(help_text="en el momento lo cambie como el identificador de gestor de videos youtube o vimeo o mp3", max_length=50)
    urlaudio = models.FileField(upload_to='archivos/audio/%Y/%m/%d', null=True, blank=True)
    urlvideo = models.FileField(upload_to='archivos/video/%Y/%m/%d', null=True, blank=True)
    info = models.TextField(help_text="Escriba informacion relacionada con el video, la cancion o el autor", null=True, blank=True, default="=información= \n este campo esta creado para que cualquier persona escriba una **reseña** o información relacionada con el video solo oprima el botom editar y redacte la información, sientase libre de hacerlo es muy fácil. \n \\ \\ ----{{ http://www.wikicreole.org/attach/CheatSheet/creole_cheat_sheet.png | creole image }} \n [[ / | inicio]]")
    keywords = models.CharField(max_length=300, help_text="Escriba los keywords separados por comas", null=True, blank=True)
    foto = models.CharField(max_length=200, help_text="url de la foto", null=True, blank=True)
    duration = models.CharField(max_length=200, help_text="duracion de el objecto en milisegundos", null=True, blank=True)
    top_select = models.BooleanField(default=False)
    
    def __unicode__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if self.body == "vimeo":
            fleep = re.findall(r'/([\-\w]+)', self.video)
            self.video = fleep[1]
            data_api = urllib2.urlopen("http://vimeo.com/api/v2/video/" + fleep[1] + ".json")
            data_api = simplejson.load(data_api)
            self.foto = data_api[0]['thumbnail_small']
            print(data_api[0])
            self.duration = data_api[0]['duration']
        elif self.body == "youtube":
            self.video = re.findall( r'v\=([\-\w]+)', self.video )[0]
            self.foto =  "http://img.youtube.com/vi/" + self.video + "/default.jpg"
            uri = self.video
            duration = GetAndPrintUserUploads(uri)
            self.duration = duration
            
        self.path = filter_name(self.name)
        self.keywords = (self.name + ", " + self.author.first_name + ", crispander")
        super(Page, self).save(*args, **kwargs) # Call the "real" save() method.
        
    class Meta:
        ordering = ["-date"]
        verbose_name_plural = "pages"
        
    
    def on_like(self, user_std=None):
        """Confirma si el usuario actual le gusta este video"""
        if user_std:
            user_std = User.objects.get(pk=user_std)
            value = QualifyPage.objects.filter(user=user_std, page=self)
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
        number = QualifyPage.objects.filter(page=self, value=True).count()
        
        return number
    
    def get_number_nolikes(self):
        """Devuelve el numero de likes que se le han asignado un video"""
        number = QualifyPage.objects.filter(page=self, value=False).count()
        
        return number

    
    def get_visits(self):
        """obtener todas la visitas"""
        visits = VisitPage.objects.filter(page__id=self.id).count()
        
        return visits
    
    
    def get_video(self):
        """ expresion rgular de la ruta de el video """
        try:
            video = re.findall( r'v\=([\-\w]+)', self.video )[0]
        except IndexError:
            video = ("Disculpenos, pero la url de el sitio es erronea " +
                "si usted es el propietario porfavor corrijala " +
                "sino, puede comunicarse o reportarla, gracias querido usuario")

        return video

    

class MessageBar(models.Model):
    """mensajes que asociaran a la barra o al banner de mensajes
    
    en cada una de las paginas, este trabajara en tiempo real.
    
    """
    message = models.CharField(max_length=100)
    country = models.CharField(max_length=10)
    date = models.DateTimeField(auto_now=True, auto_now_add=True)
    
    def __unicode__(self):
        return self.date.strftime("%A %B %Y- %H:%M:%S%p")
    
    class Meta:
        ordering = ["-date"]
        verbose_name_plural = "messages bar"
    
    def date_serial(self):
        date = round(float(self.date.strftime('%S.%f')),3)
        
        return date


class VisitPage(models.Model):
    """Numero de visitas por pagina."""
    page = models.ForeignKey(Page, null=True, blank=True)
    user = models.ForeignKey(User, null=True, blank=True)
    date = models.DateTimeField(auto_now=True, auto_now_add=True)
    ip = models.CharField(max_length=20)
    
    def __unicode__(self):
        return self.date.strftime("%A %B %Y- %H:%M:%S%p")

    class Meta:
        ordering = ["-date"]
        verbose_name_plural = "visits"
        

class QualifyPage(models.Model):
    """Valoracion a cada uno de los videos o imagenes o paginas
    
    la cual obtendra una buena o mala calificacion y su 
    total.
    
    """
    user = models.ForeignKey(User, null=True, blank=True)
    page = models.ForeignKey(Page)
    date = models.DateTimeField(auto_now=True, auto_now_add=True)
    value = models.BooleanField()
    
    def __unicode__(self):
        return self.page.name

    class Meta:
        ordering = ["-date"]
        verbose_name_plural = "qualifies collection"
        
def create_qualify(sender, instance, created, **kwargs):
    """funcion o callback llamado despues de crear una pagina
    
    para este crear una nueva instance de calificaciones
    los parametros necesarios son la instancia de el objecto creado.
    
    """
    if created:
        value = Qualify(page=instance, fine=0, bad=0)
        value.save()
    else:
        pass



#models.signals.post_save.connect(create_qualify, sender=Page)
