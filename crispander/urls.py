from django.conf.urls import patterns, include, url

from django.contrib import admin
from crispander.app.views import *

from crispander.app.api import *
from tastypie.api import Api

from django.conf import settings

from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView

resources_api = Api(api_name='v1')
resources_api.register(MessageBarResource())
resources_api.register(UserResource())
resources_api.register(PageResource())
resources_api.register(NameCollectionResource())
resources_api.register(CollectionResource())
resources_api.register(VisitCollectionResource())
resources_api.register(UserProfileResource())
resources_api.register(FollowResource())
resources_api.register(QualifyResource())
resources_api.register(QualifyPageResource())
resources_api.register(CommentResource())
resources_api.register(QualifyCommentsResource())
resources_api.register(ImagenResource())

admin.autodiscover()
urlpatterns = patterns('',
    #index y paginas
    url(r'^$', csrf_exempt(Index.as_view())),
    url(r'^page/(?P<pk>\w+)/(?P<page>\w+)/$', MyPage.as_view()),
    url(r'^save_comment/$', tool_comment),
    url(r'^save_information/$', save_information),
    url(r'^get_count/$', count),
    #process crear cuentas, paginas
    url(r'^process/', include("crispander.app.urls")),
    #perfil de usuario
    url(r'^home/', include("crispander.personal.urls")),
    #vistas de cuentas
    url(r'^account/', include("accounts.urls")),
    #paginacion de comentarios
    url(r'^pagination/$', comments_paginate),
    #redireccion de paginas aleatorias, next y anterior
    url(r'^redirection/$', page_redirect),
    #api
    url(r'^api/', include(resources_api.urls)),
    #others
	url(r'^loader/$', TemplateView.as_view(template_name="loader.html"), name='loader'),
    url(r'^robots.txt/$', Robot.as_view(), name='robot'),
    #management
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
)

if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT,
        }),
   )
