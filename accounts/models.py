from django.db import models
from django.contrib.auth.models import User

from django.db.models.signals import post_save
from crispander.personal.models import *

from itertools import chain
import itertools
from operator import attrgetter
from django.core.paginator import Paginator
        
    
class UsersProfile(models.Model):
    user = models.OneToOneField(User)
    api = models.CharField(max_length=50, null=True, blank=True, help_text="api de ingreso al usuario facebook, twitter")
    last_login = models.DateTimeField(auto_now=True, auto_now_add=True)
    comment = models.TextField(null=True, blank=True)
    genere = models.CharField(max_length=50, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)

    def __unicode__(self):
        return self.user.username
    
    class Meta:
        ordering = ['-last_login']
        verbose_name_plural = "user profile"
    
    def get_name_collection(self):
        """obtener todas mis colleciones"""
        value = NameCollection.objects.filter(user=self)
        
        return value
    
    def get_my_follows(self):
        """obtener mi numero de seguidores"""
        value = Follow.objects.filter(follow_to=self).count()
        
        return value

    def get_what_follow(self):
        """obtener mi numero de seguidores"""
        value = Follow.objects.filter(user=self)
        
        return value
    
    def get_follows(self, number_page=1, limit=3):
        """obtener los follow de el usuario actual"""
        
        follows = Follow.objects.filter(user=self).values_list('follow_to', flat=True).order_by('follow_to')
        
        value = User.objects.filter(pk=self.id)
        value2 = User.objects.filter(id__in=follows)
        value3 = User.objects.exclude(is_active=False).exclude(id__in=follows).exclude(id=self.id).order_by("-last_login")
        
        
        #matches = sorted(chain(value2, value, value3),
            #key=attrgetter('id')
            #)
    
        list2d = [value, value2, value3]
        matches = [item for sublist in list2d for item in sublist]
        
            
        p = Paginator(matches, limit)
        page = p.page(number_page)
        #value = User.objects.extra(where=["foo='a' OR bar = 'a'", "baz = 'a'"])
        #print(value.query.get_compiler('default').as_sql())
        
        return page.object_list
    
    def get_collections_feed(self, type_music=None):
        """obtener las ultimas colleciones de el usuario
        
        para ser expuestos en la pagina de el feed"""
        if not type_music:
            try:
                collections = Collection.objects.filter(user=self)[:3]
            except IndexError:
                collections = Collection.objects.filter(user=self)
        else:
            try:
                collections = Collection.objects.filter(user=self).filter(namecollection__name=type_music)[:3]
            except IndexError:
                collections = Collection.objects.filter(user=self).filter(namecollection__name=type_music)
        
        return collections
    
    def on_follow(self, user_std):
        """confirma si el usuario actual esta suscrito a dicho usuario"""
        if user_std:
            user_std = User.objects.get(pk=user_std)
            value = Follow.objects.filter(user=user_std, follow_to=self)
            number = value.count()
            
            if number >= 1:
                return value[0].id
            else:
                return False
        else:
            return "no_registred"
        
    def get_imagen(self):
        """Obtiene la imagen de perfil"""
        
        try:
            m = Imagen.objects.filter(user=self.user, main=True)[0]
        except IndexError:
            m = None
        
        return m
    
    def get_first_imagen(self):
        """obtiene la primera foto de su conjunto"""
        try:
            m = Imagen.objects.filter(user=self)[0]
        except IndexError:
            m = None
        
        return m
    
    def get_second_imagen(self):
        """obtiene la primera foto de su conjunto"""
        try:
            m = Imagen.objects.filter(user=self)[1]
        except IndexError:
            m = None
        
        return m
        
    def get_sugerencias(self):
        """obtiene las sugerencias paara dicho usuario"""
        follows = Follow.objects.filter(user=self).values_list('follow_to', flat=True).order_by('follow_to')
        
        value = User.objects.exclude(is_active=False).exclude(id=self.id).exclude(id__in=follows)[:9]
        
        return value
        
    def get_generes_music(self):
        """obtener los generos a los que el usuario les gusta"""
        values = GenMusicUser.objects.filter(user=self.user)
        
        return values

# class Imagen(models.Model):
    # user = models.ForeignKey(UsersProfile)
    # imagen = models.FileField(upload_to='perfiles/%Y/%m/%d')
    # main = models.BooleanField()
    # date = models.DateTimeField(auto_now=False, auto_now_add=True)
    
    # def __unicode__(self):
        # return self.imagen.name
    
    # class Meta:
        # ordering = ['-date']
        # verbose_name_plural = "imagenes usuario"


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UsersProfile.objects.create(user=instance)
        NameCollection.objects.create(user=instance)
        NameCollection.objects.create(user=instance, name="House")
        NameCollection.objects.create(user=instance, name="Techno")
        NameCollection.objects.create(user=instance, name="Trance")
        

post_save.connect(create_user_profile, sender=User)

