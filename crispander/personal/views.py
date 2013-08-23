from django.views.generic import *
from django.contrib.auth.models import User
from crispander.personal.models import *
from accounts.models import *
from crispander.app.models import MessageBar

from django.shortcuts import redirect, render

from django.core.servers.basehttp import FileWrapper
import mimetypes
import os
from django.http import HttpResponse

from django.core.files import File
import io

from django.core.paginator import Paginator
from django.utils import simplejson
#from itertools import chain

from PIL import Image
import StringIO
from django.core.files.uploadedfile import InMemoryUploadedFile

class MyPerfil(DetailView):
    template_name = "personal/account.html"
    model = User
    context_object_name = 'data_user'
    
    #def render_to_response(self, context):

        #if not self.request.user.is_authenticated():
            #return redirect('/process/login_form/')

        #return super(MyPerfil, self).render_to_response(context)
    def get_context_data(self, **kwargs):
        context = super(MyPerfil, self).get_context_data(**kwargs)
        
        try:
            self.request.REQUEST['collecion']
        except KeyError:
            context['filter'] = False
        else:
            context['name_collection'] = NameCollection.objects.get(pk=self.request.REQUEST['collecion'])
            context['filter'] = True

        return context
        
class MyConfiguration(DetailView):
    template_name = "personal/configuration.html"
    model = User
    context_object_name = 'data_user'
    
    def render_to_response(self, context):
        if not self.request.user.is_authenticated():
            return redirect('/process/login_form/')

        return super(MyConfiguration, self).render_to_response(context)

    def get_context_data(self, **kwargs):
        context = super(MyConfiguration, self).get_context_data(**kwargs)
        
        context['request'] = self.request

        return context
        
class ViewCollection(DetailView):
    template_name = "personal/collection.html"
    model = NameCollection
    context_object_name = 'collections'
    
    def get_context_data(self, **kwargs):
        context = super(ViewCollection, self).get_context_data(**kwargs)
        
        name_collection = NameCollection.objects.get(pk=self.kwargs['pk'])
        p = Paginator(name_collection.get_collection(), 3)
        
        context['filter_collections'] = p.page(1)

        return context


class MyFeed(TemplateView):
    template_name = "personal/feed.html"
    model = User
    context_object_name = 'user'
    
    def get_context_data(self, **kwargs):
        context = super(MyFeed, self).get_context_data(**kwargs)
        current = self.kwargs['user']
        context['messagebar'] = MessageBar.objects.all()[:10]

        try:
            value = User.objects.get(pk=current)
        except ValueError:
            context['data_page'] = "none"
        else:
            context['feed'] = value.get_profile().get_follows()
            context['data_page'] = User.objects.get(pk=self.kwargs['user'])
            
        try:
            search = self.request.REQUEST['search']
        except KeyError:
            page = Page.objects.all()
            paginator = Paginator(page, 8)
            context['pages'] = paginator.page(1)
            context['next'] = "/process/api/pages/?page=2&limit=8"
        else:
            m = search.split()
            list2d = []
            list2d.append(Page.objects.filter(name__icontains=search))
            for i in m:
                if i.__len__() > 2:
                    list2d.append(Page.objects.filter(name__icontains=i))
            
            
            matches = [item for sublist in list2d for item in sublist]
            seen_titles = set()
            new_list = []
            for obj in matches:
                if obj.id not in seen_titles:
                    new_list.append(obj)
                    seen_titles.add(obj.id)
            
            p = Paginator(new_list, 8)
            page = p.page(1)
            
            context['pages'] = page
            if page.has_next():
                context['next'] = "/process/api/pages/?page=2&limit=8&search=" + search
            else:
                context['next'] = "/process/api/pages/?limit=8&start_index=1&search_you=" + search


        return context


def get_results_feed(request, user):
    """api json de el feed de cada usuario"""
    try:
        by_collection = request.REQUEST['by_collection']
    except KeyError:
        by_collection = None
        
    try:
        number_page = int(request.REQUEST['page'])
    except KeyError:
        number_page = 1
    
    try:
        limit = request.REQUEST['limit']
    except KeyError:
        limit = 2
    
    def check(foo):
        if foo:
            return foo.imagen.url
        else:
            return None

    def check_url(foo):
        if foo:
            return foo.url
        else:
            return None
            
    def bar_comments(foo):
        """obtener comentariuos"""
        k = []
        for i in foo:
            if i.user:
                k.append({
                    'imagen': check(i.user.get_profile().get_imagen()),
                    'name': i.user.first_name,
                    'date': i.date.strftime("%d de %B de %Y a las %H:%M"),
                    'comment': i.comment,
                    'id': i.id,
                    'raiting': i.get_raitings(),
                    'on_like': i.on_like(request.user.id),
                })
            else:
                k.append({
                    'imagen': None,
                    'name': None,
                    'date': i.date.strftime("%d de %B de %Y a las %H:%M"),
                    'comment': i.comment,
                    'id': i.id,
                    'raiting': i.get_raitings(),
                    'on_like': i.on_like(request.user.id),
                })

        return k

    def bar(foo):
        """obtener colecciones"""
        s = []
        for i in foo:
            s.append({
                'name': i.name,
                'visits': i.get_visits(),
                'body': i.page.body,
                'video': i.page.video,
                'urlaudio': check_url(i.page.urlaudio),
                'urlvideo': check_url(i.page.urlvideo),
                'id': i.id,
                'author': i.user.first_name,
                'foto': i.page.foto,
                'comment': i.comment,
                'on_like': i.on_like(request.user.id),
                'number_likes': i.get_number_likes(),
                'number_nolikes': i.get_number_nolikes(),
                'main_comments': {'objecto': bar_comments(i.get_main_comments()[0]), 'value': i.get_main_comments()[1], 'url': i.get_main_comments()[2]}
            })
        
        return s
    
    def set_filter(ejec, value):
        try:
            rj_type_music = "&type_music=" + request.REQUEST['type_music']
        except KeyError:
            rj_type_music = ""
        
        try:
            rj_by_collection = "&by_collection=" + request.REQUEST['by_collection']
        except KeyError:
            rj_by_collection = ""

        if ejec:
            if value:
                return "/home/super/api/" + user + "/?page=" + str(number_page + 1) + "&limit="  + limit + rj_type_music + rj_by_collection
            else:
                return None
        else:
            if value:
                return "/home/super/api/" + user + "/?page=" + str(number_page - 1) + "&limit="  + limit  + rj_type_music + rj_by_collection
            else:
                return None

    if by_collection:
        matches = NameCollection.objects.get(pk=by_collection)
        
        p = Paginator(matches.get_collection(), limit)
        
        page = p.page(number_page)
        
        send = bar(page.object_list)


            
        
    else:
        if user == "none":
            matches = User.objects.all()
        else:
            follows = Follow.objects.filter(user=user).values_list('follow_to', flat=True).order_by('follow_to')
            
            value = User.objects.filter(pk=user)
            value2 = User.objects.filter(id__in=follows)
            value3 = User.objects.exclude(id__in=follows).exclude(id=user).order_by("-last_login")
            
            list2d = [value, value2, value3]
            
            matches = [item for sublist in list2d for item in sublist]
            #matches = list(itertools.chain.from_iterable(list2d))
        
        send = []
        
        p = Paginator(matches, limit)
        
        page = p.page(number_page)
        

        try:
            type_music = request.REQUEST['type_music']
        except KeyError:
            for x in page.object_list:
                send.append({
                    'api' : x.get_profile().api,
                    'on_follow': x.get_profile().on_follow(request.user.id),
                    'number_follows': x.get_profile().get_my_follows(),
                    'user': x.first_name + " " + x.last_name ,
                    'last_login': x.last_login.strftime("%X %x"),
                    'id': x.id,
                    'imagen': check(x.get_profile().get_imagen()),
                    'feed_collection': bar(x.get_profile().get_collections_feed())
            })
        else:
            for x in page.object_list:
                send.append({
                    'api' : x.get_profile().api,
                    'on_follow': x.get_profile().on_follow(request.user.id),
                    'number_follows': x.get_profile().get_my_follows(),
                    'user': x.first_name,
                    'last_login': x.last_login.strftime("%X %x"),
                    'id': x.id,
                    'imagen': check(x.get_profile().get_imagen()),
                    'feed_collection': bar(x.get_profile().get_collections_feed(type_music))
            })
    
    
    try:
        request.REQUEST['by_collection']
    except KeyError:
        rj_by_collection = "feed"
    else:
        rj_by_collection = "collection"
        
    meta = {
        "next": set_filter(True, page.has_next()),
        "previous": set_filter(False, page.has_previous()),
        "total_count": p.count,
        "pages": p.num_pages,
        "limit": int(limit),
        "type": rj_by_collection,
    }
    
    send = simplejson.dumps({"meta": meta, "objects": send})
    
    return HttpResponse(send, "text/json")


class MyCollection(DetailView):
    """Esta se muestra tod la informacion de una
    
    collecion.
    
    """
    template_name = "collection.html"
    model = Collection
    context_object_name = "collection"
    
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(MyCollection, self).get_context_data(**kwargs)
        collection_d = Collection.objects.get(pk=self.kwargs['pk'])
        if(self.request.user.is_authenticated()):
            visit = VisitCollection(ip=self.request.META['REMOTE_ADDR'], collection=collection_d, user=self.request.user)
        else:
            visit = VisitCollection(ip=self.request.META['REMOTE_ADDR'], collection=collection_d)
        visit.save()
        
        #paginacion de a cuatro    
        comments = Comment.objects.filter(collection__id=self.kwargs['pk'])
        paginator = Paginator(comments, 8)
        
        #envio de anterior y siguiente pagina
        try:
            collection_before = Collection.objects.get(pk=int(self.kwargs['pk']) + 1)
        except Collection.DoesNotExist:
            pass
        else:
            context['before'] = collection_before
            
        try:
            collection_after = Collection.objects.get(pk=int(self.kwargs['pk']) - 1)
        except Collection.DoesNotExist:
            pass
        else:
            context['after'] = collection_after
        
        context['messagebar'] = MessageBar.objects.all()[:10]
        context['comments'] = paginator.page(1)

        return context
        

class show_images(DetailView):
    """vista para mostrar las imagenes de un usuario"""
    template_name = "personal/show_images.html"
    model = User
    context_object_name = "usuario"


def myupload_file(request, pk):
    m = request.FILES['miimagen']
    #handle_uploaded_file(m)
    user = User.objects.get(pk=pk)
    user_profile = user.get_profile()
    if user_profile.get_imagen():
        value = False
    else:
        value = True
    imagen = Imagen(user=user, imagen=m, main=value)
    imagen.save()
    send = {"url": imagen.imagen.url, "id": imagen.id}

    json = simplejson.dumps(send)
    return HttpResponse(json, "text/json")

    
def mystreamviewe(request):
    path = "/home/crispander/Escritorio/k.mp3"
    wrapper = FileWrapper(open(path, 'rb'))
    content_type = mimetypes.guess_type(path)[0]
    response = HttpResponse(wrapper, content_type=content_type)
    response['Content-Length'] = os.path.getsize(path)
    response['Accept-Ranges'] = 'bytes'

    return response
    
    
def handle_uploaded_file(f):
    with open("/crispander/media/" + f.name, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)

def mystreamview(request):
    stream_file = File(io.open("/home/crispander/Escritorio/k.mp3", "rb"))
    response = HttpResponse(stream_file.chunks(), content_type="video/mpeg")
    return response
        

def get_thumbnail(request, pk):
    """Selecciona  una imagen pequena recortada de una ya existente
    o thumbnail"""
    
    id = Imagen.objects.get(pk=request.GET["id"])
    im = Image.open(id.imagen.path)
    v = (int(request.GET["x1"]),int(request.GET["y1"]),int(request.GET["x2"]),int(request.GET["y2"]))
    new = im.crop(v)
    
    thumb_io = StringIO.StringIO()
    new.save(thumb_io, format='JPEG')
    
    thumb_file = InMemoryUploadedFile(thumb_io, None, 'foo.jpg', 'image/jpeg', thumb_io.len, None)

    Imagen.objects.create(imagen=thumb_file, main=True, user=request.user)
    
    return HttpResponse("s", "text/plain")
    
