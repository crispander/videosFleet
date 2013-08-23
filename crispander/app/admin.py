from crispander.app.models import *
from crispander.personal.models import *
from accounts.models import *
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.contrib import admin

class UserProfileInline(admin.StackedInline):
    model = UsersProfile
    can_delete = False
    verbose_name_plural = 'profile'

class UserAdmin(UserAdmin):
    inlines = (UserProfileInline, )
    
class PageAdmin(admin.ModelAdmin):
    exclude = ["path", "keywords"]

class VisitAdmin(admin.ModelAdmin):
    fields = ['page', 'ip']

#unregistrar el usuario actual y registrar el nuevo.
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Page, PageAdmin)
admin.site.register(MessageBar)
admin.site.register(VisitPage)
admin.site.register(UsersProfile)

admin.site.register(NameCollection)
admin.site.register(Collection)
admin.site.register(Follow)
admin.site.register(QualifyCollection)
admin.site.register(VisitCollection)
admin.site.register(GenMusic)
admin.site.register(GenMusicUser)

admin.site.register(Imagen)
admin.site.register(Comment)
admin.site.register(CommentQualify)

