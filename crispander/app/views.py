# -*- coding: utf-8 -*- 
from django.http import HttpResponse
from django.views.generic import *
from crispander.app.models import *

from datetime import datetime
from django.utils import simplejson
from django.shortcuts import redirect, render

from django_markup.markup import formatter
import random
import vimeo
import soundcloud

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from resources.mail import MyEmail

from django.core.files import File
from crispander.app.forms import *

from gdata.youtube.service import YouTubeService
from django.core import serializers
from crispander.personal.models import *

from crispander.personal.views import myupload_file

def GetAndPrintUserUploads(uri):
    yt_service = YouTubeService()
    
    #PrintVideoFeed(yt_service.GetYouTubeVideoFeed(uri))
    try:
        return yt_service.GetYouTubeVideoFeed(uri)
    except:
        return False


class Index(TemplateView):
    """Vista principal donde aparecenran un listado con todas las opciones
    
    lo unico que lleva es el modelo de PAges
    
    """
    template_name = "index.html"
    
    def get_context_data(self, **kwargs):
        context = super(Index, self).get_context_data(**kwargs)

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
        
        context['top'] = Page.objects.filter(top_select=True)

        return context


def get_results_page(request):
    """api de busquedas de paginas"""
    try:
        by_search = request.REQUEST['search']
    except KeyError:
        by_search = None
    
    try:
        by_search_you = request.REQUEST['search_you']
    except KeyError:
        by_search_you = None

    try:
        by_search_vi = request.REQUEST['search_vi']
    except KeyError:
        by_search_vi = None

    try:
        by_search_soundcl = request.REQUEST['search_soundcl']
    except KeyError:
        by_search_soundcl = None
        
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
            return foo.url
        else:
            return None

    def bar(foo):
        """obtener colecciones"""
        s = []
        for i in foo:
            s.append({
                'name': i.name,
                'visits': i.get_visits(),
                'body': i.body,
                'video': i.video,
                'id': i.id,
                'foto': i.foto,
                'path': i.path,
                'like': i.get_number_likes(),
                'nolike': i.get_number_nolikes(),
                'type': "current",
            })
        
        return s
    
    def set_filter(ejec, value):
        try:
            rj_type_search = "&search=" + request.REQUEST['search']
        except KeyError:
            rj_type_search = ""
        
        try:
            rj_type_search_you = "&search_you=" + request.REQUEST['search']
        except KeyError:
            rj_type_search_you = "&search_you=electro house trance"

        if ejec:
            if value:
                return "/process/api/pages/?page=" + str(number_page + 1) + "&limit="  + str(limit) + rj_type_search
            else:
                #return "/process/api/pages/?limit=8&start_index=1" + rj_type_search_you
                return None
        else:
            if value:
                return "/process/api/pages/?page=" + str(number_page - 1) + "&limit="  + str(limit)  + rj_type_search
            else:
                #return "/process/api/pages/?limit=8&start_index=1" + rj_type_search_you
                return None

    if by_search:
        m = by_search.split()
        list2d = []
        list2d.append(Page.objects.filter(name__icontains=by_search))
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
        
        p = Paginator(new_list, limit)
        
        page = p.page(number_page)
        
        send = bar(page.object_list)


    elif by_search_you:
        #searchs relations
        try:
            start_index = request.REQUEST['start_index']
        except KeyError:
            start_index = 1
        send = []
        uri = "http://gdata.youtube.com/feeds/api/videos?q=" + by_search_you + "&start-index=" + str(start_index) + "&max-results=" + str(limit) + "&v=2"
        videos = GetAndPrintUserUploads(uri)
        for i in videos.entry:
            send.append({
                'name': i.media.title.text,
                'visits': "0",
                'body': "cero",
                'video': i.media.player.url ,
                'id': "cero",
                'foto': i.media.thumbnail[3].url,
                'path': "cero",
                'like': "0",
                'nolike': "0",
                'type': "youtube",
                'urlplayer': i.media.player.url,
                
            })

        meta = {
            "next": "/process/api/pages/?limit=8&start_index=" + str(int(start_index) + 10) + "&search_you=" + by_search_you,
            "total_count": "0",
            'next_you': videos.link[4].href,
        }
    elif by_search_vi:
        send = []
        client = vimeo.Client(key='6a01aee5ad59757f7bc8138a5f7ec762ae86d414', secret='758e18407bd68f114cb72ef3bbdcace9c909ec5c', callback='http://fleet2001.herokuapp.com')
        videos = client.get('vimeo.videos.search', query=by_search_vi, page=number_page, per_page=limit)
        videos = videos.encode('ascii','ignore')
        videos = simplejson.loads(videos)
        for i in videos['videos']['video']:
            send.append({
                'name': i['title'],
                'visits': "0",
                'body': "cero",
                'video': i['id'] ,
                'id': "cero",
                'foto': i['thumbnails']['thumbnail'][0]['_content'],
                'path': "cero",
                'like': i['number_of_likes'],
                'nolike': "0",
                'type': "vimeo",            
            })
            
        meta = {
            "next": "/process/api/pages/?limit=8&page="+ str(number_page + 1) +"&search_vi=" + by_search_vi,
            "total_count": "0",
        }
    elif by_search_soundcl:
        try:
            start_index = request.REQUEST['start_index']
        except KeyError:
            start_index = 1
        send = []
        client = soundcloud.Client(client_id='f7e19128ac2ebf5679f6310167a1fcd2',
                                   client_secret='f24e173f7cc5d925171650b9436add7c',
                                   redirect_uri='http://fleet2001.herokuapp.com')
        tracks = client.get('/tracks', q=by_search_soundcl, license='cc-by-sa', limit=limit, offset=start_index)
        for i in tracks:
            obk = i.__dict__['obj']
            send.append({
                'name': obk['title'],
                'visits': "0",
                'body': "cero",
                'video': obk['uri'],
                'id': "cero",
                'foto': obk['artwork_url'],
                'path': "cero",
                'like': "0",
                'nolike': "0",
                'type': "soundcloud",            
            })
        meta = {
            "next": "/process/api/pages/?limit=8&start_index="+ str(int(start_index) + 8) +"&search_soundcl=" + by_search_soundcl,
            "total_count": "0",
        }
    else:
        matches = Page.objects.all()
        p = Paginator(matches, limit)
        
        page = p.page(number_page)
        send = bar(page.object_list)

    
    try:
        meta = meta
    except UnboundLocalError:
        meta = {
            "next": set_filter(True, page.has_next()),
            "previous": set_filter(False, page.has_previous()),
            "total_count": p.count,
            "pages": p.num_pages,
            "limit": int(limit),
        }
    
    send = simplejson.dumps({"meta": meta, "objects": send})
    
    return HttpResponse(send, "text/json")
    

class MyPage(DetailView):
    """Esta es la vista principal se muestra la descripcion de cada
    
    pagina.
    
    lleva los datos de la mayoria de los modelos
    
    """
    template_name = "page.html"
    model = Page
    context_object_name = "page"
    
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(MyPage, self).get_context_data(**kwargs)
        page_d = Page.objects.get(pk=self.kwargs['pk'])
        if(self.request.user.is_authenticated()):
            visit = VisitPage(page=page_d, ip=self.request.META['REMOTE_ADDR'], user=self.request.user)
        else:
            visit = VisitPage(page=page_d, ip=self.request.META['REMOTE_ADDR'])
        visit.save()
        
        #paginacion de a cuatro    
        comments = Comment.objects.filter(page__id=self.kwargs['pk'])
        paginator = Paginator(comments, 6)
        page  = paginator.page(1)
        
        if page.has_next:
            url = "/api/v1/comments/?page=" + str(self.kwargs['pk']) + "&offset=6&limit=6"
        else:
            url = ""
        
        #envio de anterior y suguiente pagina
        try:
            page_before = Page.objects.get(pk=int(self.kwargs['pk']) - 1)
        except Page.DoesNotExist:
            pass
        else:
            context['before'] = page_before
            
        try:
            page_after = Page.objects.get(pk=int(self.kwargs['pk']) + 1)
        except Page.DoesNotExist:
            pass
        else:
            context['after'] = page_after
        
        context['messagebar'] = MessageBar.objects.all()[:10]
        context['comments'] = (page.object_list, page.has_next(), url)

        return context

class PageLogin(TemplateView):
    """Cuenta personal de cada usuario"""

    template_name = "process/login.html"


def tool_comment(request):
    """Almacena los comentarios en la base de datos 
    
    solo devuelve la hora
    
    """
    name_post = request.REQUEST['name']
    comment_post = request.REQUEST['comment']
    page_identifier = request.REQUEST['user_id']
    operation_type = str(request.REQUEST['type'])
    
    try:
        user = User.objects.get(pk=name_post)
    except User.DoesNotExist:
        user = None
    except ValueError:
        user = None

    if(operation_type == "collection"):
        page_d = Collection.objects.get(pk=page_identifier)
        data = Comment(user=user, comment=comment_post, collection=page_d)
    elif(operation_type == "page"):
        page_d = Page.objects.get(pk=page_identifier)
        data = Comment(user=user, comment=comment_post, page=page_d)
    elif(operation_type == "image"):
        page_d = Imagen.objects.get(pk=page_identifier)
        data = Comment(user=user, comment=comment_post, imagen=page_d)
    
    try:
        data.save()
    except:
        response = "error"
    else:
        response = {"date": datetime.now().strftime("%H:%M:%S %p"), "id": data.id, "onlike": data.on_like(name_post)}
        response = simplejson.dumps(response)
    
    return HttpResponse(response, "application/json")


def count(request):
    """Una de las paginas mas concurridas solo devuelve
    
    el numero de visitas de la actual.
    
    """
            
    page = request.REQUEST['id']
    visit = Visit.objects.filter(page__id=page).count()
    fine = FineQualify.objects.filter(page=request.REQUEST['id']).count()
    bad = BadQualify.objects.filter(page=request.REQUEST['id']).count()
    
    response = {"count": visit, "fine": fine, "bad": bad }
    response = simplejson.dumps(response)

    return HttpResponse(response, "application/json")

    
class Robot(TemplateView):
    """Robot de Seo para calificar o restringir el paso de algunos
    
    robots los mas comunes.
    
    """
    template_name = "robots.txt"


def save_information(request):
    """Funcion para manejar los envios de wiki de cada uno sd elos videos 
    
    y paginas y colleciones"""
    
    try:
        type_d = request.REQUEST['type']
    except KeyError:
        type_d = None
        
    try:
        search = request.REQUEST['data_information']
    except KeyError:
        pass
    else:
        if type_d == "collection":
            page_d = Collection.objects.get(pk=request.REQUEST['id'])
            page_d.info = search
            page_d.save()
        elif type_d == "page":
            page_d = Page.objects.get(pk=request.REQUEST['id'])
            page_d.info = search
            page_d.save()
        
    return HttpResponse(formatter(search, filter_name='creole'), "text/plain")
    

def comments_paginate(request):
    """Obtener mas comentarios"""
    comments = Comment.objects.filter(page__id=request.REQUEST['id'])
    paginator = Paginator(comments, 8)
    p = paginator.page(request.REQUEST['page'])
    
    response = []
    for i in p.object_list:
        response.append({'comment': i.comment, 'name': i.name, 'date':i.date.strftime("%c")})
    
    if p.has_next():
        next_page = p.next_page_number()
    else:
        next_page = "nulo"
    send = simplejson.dumps({'next': next_page, 'values': response})

    return HttpResponse(send, "application/json")


def page_redirect(request):
    """Redirecciona la pagina aleatoriamente."""

    try:
        identifier = int(request.REQUEST['number'])
    except KeyError:
        return redirect("/")
    else:
        pages = Page.objects.all()
        page = random.choice(pages)
        return redirect("/page/" + str(page.id) + "/search")

def set_users(request):
    """Creacion de cuentas de usuario."""
    try:
        me = request.REQUEST['id']
    except KeyError:
        if request.method == "POST":
            try:
                name = request.REQUEST['name']
                email = request.REQUEST['email']
                passw = request.REQUEST['password']
            except KeyError:
                value = "error en la consulta"
            else:
                try:
                    value = User.objects.create_user(name, email, passw)
                except:
                    response = {'value': 'su nombre de usuario ya existe porfavor seleccione otro gracias.'}
                else:
                    try:
                        name = request.REQUEST['name']
                    except:
                        pass
                    else:
                        json_imagen = myupload_file(request, value.id)
                    value.is_active = False
                    value.save()

                    m = MyEmail(value.email)
                    m.set_structure(value.password, "<a href='http://videos-cristanmontoya.dotcloud.com/process/register/?id=" + str(value.id) + "&password=" + value.password + "'>confirma su cuenta</a>")
                    m.send_email()
                
                    response = {'value': "Objecto creado exitosamente revise su email para confirmar su cuenta"}

        else:
            response = {'value': "para crear tus paginas necesitas estar inscrito."}
    else:
        passw = request.REQUEST['password']
        value = User.objects.get(pk=me)
        value.first_name = value.username
        value.is_active = True
        value.save()
        
        user_profile = value.get_profile()
        user_profile.api = "crispander"
        user_profile.imagen = "/static/images/sinimagen.png"
        user_profile.save();
        
        response = {'value': "Cuenta activa"}
        
        
    return render(request, "process/register.html", response)


def create_users_face(request):
    """Autentifica un usuario de facebook o lo crea"""
    name = request.REQUEST['name']
    try:
        user = User.objects.get(username=name)
    except User.DoesNotExist:
        email = request.REQUEST['email']
        response = "no"
        user = User.objects.create_user(name, email, "no-password")
        user.first_name = request.REQUEST['first']
        user.last_name = request.REQUEST['last']
        user.save()

        user_profile = user.get_profile()
        user_profile.api = "facebook"
        user_profile.save();
        
        imagen = user_profile.get_profile()
        imagen = Imagen(user=user_profile, imagen="https://graph.facebook.com/" + name  + "/picture", main=True)
        imagen.save()
        
        l_user = authenticate(username=user.username, password="no-password")
        login(request, l_user)
        
    else:
        response = "si"
        l_user = authenticate(username=user.username, password="no-password")
        login(request, l_user)
        
    return HttpResponse(response, "text/plain")
    
    
def createpage(request):
    """crear paginas"""
    if request.user.is_authenticated():
        if request.method == "POST":
            body = request.REQUEST['body']
            if body == "audiofleet" or body == "videofleet":
                try:
                    url = request.FILES['media']
                    name = request.REQUEST['name']
                    video = "none"
                except KeyError:
                    return render(request, "process/createpage.html", {"response": "disculpenos pero su formulario es invalido error 101"})
                else:
                    if body == "audiofleet":
                        page = Page.objects.create(name=name, video=video, author=request.user, body=body, urlaudio=url)
                    else:
                        page = Page.objects.create(name=name, video=video, author=request.user, body=body, urlvideo=url)
                    message = ("ha creado una pagina <a href='/page/" + str(page.id) + "/" + str(page.path) + "'>click si desea verla</a>")
                    return render(request, "process/createpage.html", {"response": message})
            else:
                try:
                    video = request.REQUEST['video']
                    name = request.REQUEST['name']
                except KeyError:
                    return render(request, "process/createpage.html", {"response": "disculpenos pero su formulario es invalido error 102"})
                else:
                    page = Page.objects.create(name=name, video=video, author=request.user, body=body)
                    message = ("ha creado una pagina <a href='/page/" + str(page.id) + "/" + str(page.path) + "'>click si desea verla</a>")
                    return render(request, "process/createpage.html", {"response": message})
    
        else:
            form = UploadFileForm()
            
            return render(request, "process/createpage.html", {"response": ""})
    else:
        return redirect("/process/login_form/")


def login_backend(request):
    """Loguearse en la aplicacion"""
    username = request.REQUEST['username']
    password = request.REQUEST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            return redirect("/")
        else:
            return render(request, "process/login.html", {"message": "su cuenta aun no ha sido confirmada"})
    else:
        return render(request, "process/login.html", {"message": "lo sentimos, su usuario y contraseña son incorrectos"})

def logout_view(request):
    """terminar la sesion"""
    logout(request)
    
    return redirect("/")


def uploadbyauthor(request):
    """Subir videos por nombre de author """
    if request.method == "POST":
        
        uri = 'http://gdata.youtube.com/feeds/api/users/%s/uploads' % request.POST['name']
        videos = GetAndPrintUserUploads(uri)
        if videos:
            send = {"value": videos} 
        else:
            send = {"value": None}
    else:
        send = {"value": None}
    
    return render(request, "api_tube/main.html", send)


def get_or_create_view(request):
    """Funcion de vista para devolver objectos o crear vistas."""
    if request.user.is_authenticated():
        myuser = request.user
    else:
        myuser = User.objects.get(pk=1)
    
    gestor = request.REQUEST['gestor']
    if(gestor == "youtube"):
       obj = Page.objects.get_or_create(name=request.REQUEST['name'], defaults={'author': myuser, 'video': request.REQUEST['url'], 'body': 'youtube'})
    elif(gestor == "vimeo"):
       obj = Page.objects.get_or_create(name=request.REQUEST['name'], defaults={'author': myuser, 'video': request.REQUEST['url'], 'body': 'vimeo'})
    elif(gestor == "soundcloud"):
       obj = Page.objects.get_or_create(name=request.REQUEST['name'], defaults={'author': myuser, 'video': request.REQUEST['url'], 'body': 'soundcloud', 'foto': request.REQUEST['foto']})
    f = obj[0].id
    
    try:
        send_type = request.REQUEST['type']
    except KeyError:
        return redirect("/page/" + str(obj[0].id) + "/search")
    else:
        return HttpResponse(simplejson.dumps({'id': f }), "text/json")
    
