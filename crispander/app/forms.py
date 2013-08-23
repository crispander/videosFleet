from django import forms
from django.forms import ModelForm
from crispander.app.models import *

class UploadFileForm(ModelForm):
    class Meta:
        model = Page
        fields = ['name', 'video']

