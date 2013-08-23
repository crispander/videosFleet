from django.conf.urls import patterns, include, url
from views import *

urlpatterns = patterns('',
    url(r'^upload/(?P<pk>\w+)/$', myupload_file),
    url(r'^configuration/(?P<pk>\w+)/$', MyConfiguration.as_view()),
	url(r'^configuration/(?P<pk>\w+)/croping/$', get_thumbnail),
    url(r'^account/(?P<pk>\w+)/$', MyPerfil.as_view()),
    url(r'^collection/(?P<pk>\w+)/$', ViewCollection.as_view()),
    url(r'^desc_collection/(?P<pk>\w+)/$', MyCollection.as_view()),
    url(r'^feed/(?P<user>\w+)/$', MyFeed.as_view()),
    url(r'^super/api/(?P<user>\w+)/$', get_results_feed),
    url(r'^stream/$', mystreamview),
    url(r'^showimages/(?P<pk>\w+)/$', show_images.as_view()),
    url(r'^showimages/(?P<pk>\w+)/croping/$', get_thumbnail),
)
