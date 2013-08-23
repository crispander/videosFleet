from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie.authorization import Authorization
from tastypie import fields
from crispander.app.models import MessageBar, Page, QualifyPage
from crispander.personal.models import *
from accounts.models import *

from django.contrib.auth.models import User

from datetime import datetime
from datetime import timedelta
from tastypie.paginator import Paginator


class MessageBarResource(ModelResource):
    """recurso de la api, para barra de mesnajes de la aplicativo."""
    
    class Meta:
        queryset = MessageBar.objects.all()
        resource_name = "messagebar"
        authorization = Authorization()
        filtering = {
            'date': ['exact', 'lt', 'lte', 'gte', 'gt'],
        }
        
    def dehydrate(self, bundle):
        bundle.data['data_serialized'] = bundle.obj.date_serial()
        
        return bundle

class UserResource(ModelResource):
    """Manejo de cuentas por usuario"""

    class Meta:
        queryset = User.objects.all()
        resource_name = "user"
        authorization = Authorization()
        fields = ['username', 'id', 'first_name', 'last_name', 'last_login']
        ordering = ["last_login"]
    
    def dehydrate(self, bundle):
        try:
            m = bundle.obj.get_profile().get_imagen().imagen
        except AttributeError:
            bundle.data['foto'] = None
        else:
            bundle.data['foto'] = bundle.obj.get_profile().get_imagen().imagen.url
        bundle.data['feed_collection'] = bundle.obj.get_profile().get_collections_feed().values()
        
        return bundle

class UserProfileResource(ModelResource):
    """Manejo de cuentas por usuario"""

    class Meta:
        queryset = UsersProfile.objects.all()
        resource_name = "userprofile"
        authorization = Authorization()
    
    def dehydrate(self, bundle):
        send = []
        for i in bundle.obj.get_collections_feed():
            send.append({
            'name': i.name,
            'visits': i.page.get_visits(),
            'body': i.page.body,
            'video': i.page.video,
            'id': i.id,
            'foto': i.page.foto,
            'comment': i.comment,
        })
        bundle.data['feed_collection'] = send
        bundle.data['user'] = bundle.obj.user.first_name

        if bundle.request.user.id:
            bundle.data['on_follow'] = bundle.obj.on_follow(bundle.request.user.id)
        else:
            bundle.data['on_follow'] = bundle.obj.on_follow(None)
            
        return bundle
        
class PageResource(ModelResource):
    """paginas recursos api REST"""
    class Meta:
        queryset = Page.objects.all()
        resource_name = "pages"
        fields = ['id', 'name', 'video', 'path', 'foto']
        limit = 10
        authorization = Authorization()
    
    def dehydrate(self, bundle):
        bundle.data['visitas']  = bundle.obj.get_visits()
        bundle.data['qualifyuno'] = "2"
        bundle.data['qualifydos'] = "2"
        bundle.data['qualifytres'] = "2"
        
        return bundle

class NameCollectionResource(ModelResource):
    """Recursos de nombres de colecciones"""
    user = fields.ForeignKey(UserResource, 'user')
    class Meta:
        queryset = NameCollection.objects.all()
        resource_name = "namecollections"
        authorization = Authorization()
        filtering = {
            'user': ALL_WITH_RELATIONS,
        }

def check(foo):
    try:
        m = foo.imagen
    except AttributeError:
        return None
    else:
        return foo.imagen.url
        
            
def bar_comments(foo):
    """obtener comentariuos"""
    k = []
    for i in foo:
        if i.user:
            k.append({
                'imagen': check(i.user.get_profile().get_imagen()),
                'name': i.user.first_name,
                'date': i.get_std_timer(),
                'comment': i.comment,
                'id': i.id,
                'raiting': i.get_raitings(),
                'on_like': i.on_like(i.user.id),
            })
        else:
            k.append({
                'imagen': None,
                'name': None,
                'date': i.get_std_timer(),
                'comment': i.comment,
                'id': i.id,
                'raiting': i.get_raitings(),
                'on_like': False,
            })

    return k
        
class CollectionResource(ModelResource):
    """Recursos de colecciones"""
    user = fields.ForeignKey(UserResource, 'user')
    namecollection = fields.ForeignKey(NameCollectionResource, "namecollection")
    page = fields.ForeignKey(PageResource, 'page')

    class Meta:
        queryset = Collection.objects.all()
        resource_name = "collections"
        excludes = ['info']
        authorization = Authorization()
        filtering = {
            'namecollection': ALL_WITH_RELATIONS,
        }
        
    def dehydrate(self, bundle):
        
        bundle.data['video']  = bundle.obj.page.video
        bundle.data['foto']  = bundle.obj.page.foto
        bundle.data['urlaudio']  = bundle.obj.page.urlaudio
        bundle.data['urlvideo']  = bundle.obj.page.urlvideo
        bundle.data['visits'] = bundle.obj.get_visits()
        bundle.data['main_comments'] = {'objecto': bar_comments(bundle.obj.get_main_comments()[0]), 'value': bundle.obj.get_main_comments()[1], 'url': bundle.obj.get_main_comments()[2]}
        bundle.data['on_like'] = bundle.obj.on_like(bundle.request.user.id)
        bundle.data['number_likes'] = bundle.obj.get_number_likes()
        bundle.data['number_nolikes'] = bundle.obj.get_number_nolikes()
        bundle.data['belong_to'] = [bundle.obj.namecollection.name, bundle.obj.namecollection.id]
        bundle.data['comment'] = bundle.obj.comment
        bundle.data['id'] = bundle.obj.id
        bundle.data['body'] = bundle.obj.page.body
        bundle.data['fecha']  = bundle.obj.date.strftime("%x")
        
        return bundle

class VisitCollectionResource(ModelResource):
    """visitas de la parte de colleciones"""
    user = fields.ForeignKey(UserResource, 'user', null=True, blank=True)
    collection = fields.ForeignKey(CollectionResource, 'collection')

    class Meta:
        queryset = VisitCollection.objects.all()
        resource_name = "visit_collection"
        authorization = Authorization()
        filtering = {
            'collection': ALL_WITH_RELATIONS,
        }
        
class FollowResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    follow_to = fields.ForeignKey(UserResource, 'follow_to')
    
    class Meta:
        queryset = Follow.objects.all()
        resource_name = "subscriptions"
        authorization = Authorization()
        filtering = {
            'user': ALL_WITH_RELATIONS,
            'follow_to': ALL_WITH_RELATIONS,
        }

        
class QualifyResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    type_object = fields.ForeignKey(CollectionResource, 'collection')
    
    class Meta:
        queryset = QualifyCollection.objects.all()
        resource_name = "qualifycollect"
        authorization = Authorization()
        filtering = {
            'user': ALL_WITH_RELATIONS,
            'collection': ALL_WITH_RELATIONS,
        }
    
class QualifyPageResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    type_object = fields.ForeignKey(PageResource, 'page')
    
    class Meta:
        queryset = QualifyPage.objects.all()
        resource_name = "qualifypage"
        authorization = Authorization()
        filtering = {
            'user': ALL_WITH_RELATIONS,
            'page': ALL_WITH_RELATIONS,
        }

class ImagenResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        queryset = Imagen.objects.all()
        resource_name = "imagenes"
        authorization = Authorization()
        filtering = {
            'user': ALL_WITH_RELATIONS,
        }

class CommentResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user', null=True, blank=True)
    page = fields.ForeignKey(PageResource, 'page', null=True, blank=True)
    collection = fields.ForeignKey(CollectionResource, 'collection', null=True, blank=True)
    imagen = fields.ForeignKey(ImagenResource, 'imagen', null=True, blank=True)
    
    class Meta:
        queryset = Comment.objects.all()
        resource_name = "comments"
        authorization = Authorization()
        filtering = {
            'user': ALL_WITH_RELATIONS,
            'page': ALL_WITH_RELATIONS,
            'collection': ALL_WITH_RELATIONS,
            'imagen': ALL_WITH_RELATIONS,
        }
    
    def dehydrate(self, bundle):
        
        if bundle.obj.user:
            if bundle.obj.user.get_profile().get_imagen():
                bundle.data['image'] = bundle.obj.user.get_profile().get_imagen().imagen.url
            else:
                bundle.data['image'] = None
            bundle.data['name'] = bundle.obj.user.first_name
        else:
            bundle.data['image'] = None
            bundle.data['name'] = "desconocido"
        bundle.data['raiting'] = bundle.obj.get_raitings()
        bundle.data['on_like'] = bundle.obj.on_like(bundle.request.user.id)
        bundle.data['fecha'] = bundle.obj.get_std_timer()

        return bundle


class QualifyCommentsResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    type_object = fields.ForeignKey(CommentResource, 'comment')
    
    class Meta:
        queryset = CommentQualify.objects.all()
        resource_name = "qualifycomments"
        authorization = Authorization()
        filtering = {
            'user': ALL_WITH_RELATIONS,
            'comment': ALL_WITH_RELATIONS,
        }