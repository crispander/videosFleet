from django.conf.urls import patterns, include, url
from views import *

urlpatterns = patterns('',
    url(r'^edit_user/(?P<pk>\w+)/$', edit_user),
	url(r'^edit_password/(?P<pk>\w+)/$', set_password),
)
