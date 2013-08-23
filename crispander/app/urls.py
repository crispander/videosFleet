from django.conf.urls import patterns, include, url
from views import *

urlpatterns = patterns('',
    #crear cuentas de usuario
    url(r'^register/$', set_users),
    url(r'^register_face/$', create_users_face),
    #creacion de paginas
    url(r'^createpage/$', createpage),
    url(r'^logout/$', logout_view),
    url(r'^login_form/$', PageLogin.as_view()),
    url(r'^login_backend/$', login_backend),
    #api casera de obtencionde paginas
    url(r'^api/pages/$', get_results_page),
    #upload youtube or api
    url(r'^uploadbyauthor/$', uploadbyauthor),
    #get or create views
    url(r'^getorcreate/$', get_or_create_view),
)
