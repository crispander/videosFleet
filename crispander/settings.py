# Django settings for crispander project.
import os 
SETTINGS_HOME = os.path.abspath(os.path.dirname(__file__))
APP_HOME = os.path.split(SETTINGS_HOME)[0]
settings_dir = os.path.dirname(__file__)
PROJECT_ROOT = os.path.abspath(os.path.dirname(settings_dir))

AUTH_PROFILE_MODULE = "accounts.UsersProfile"
DEBUG = True
TEMPLATE_DEBUG = DEBUG

#email settings
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_HOST_USER = "youtufan.web@gmail.com"
EMAIL_SUBJECT_PREFIX = 'something'
EMAIL_USE_TLS = True

ADMINS = (
    ('cristian montoya', 'crispander@gmail.com'),
)

MANAGERS = ADMINS

import dj_database_url

DATABASES = {'default': dj_database_url.config(default=os.environ["HEROKU_POSTGRESQL_BLUE_URL"])}

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers
ALLOWED_HOSTS = ['*']

# DATABASES = {
    # 'default': {
        # 'ENGINE': 'django.db.backends.sqlite3',
        # 'NAME': os.path.join(APP_HOME, 'db/nothing.db'),
    # }
# }

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'America/Bogota'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'es'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = False

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
#if DEBUG:
MEDIA_ROOT = os.path.join(APP_HOME, 'crispander/media/')
#else:
#MEDIA_ROOT = '/home/dotcloud/data/media/'


# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = '/media/'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = 'staticfiles'
#STATIC_ROOT = ''
#STATIC_ROOT = os.path.join(APP_HOME, '/static')

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'


# Additional locations of static files
STATICFILES_DIRS = (
    #os.path.join(APP_HOME, 'crispander/static'),
	os.path.join(PROJECT_ROOT, 'static'),
)
# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = '497w6qcz=!y6*mb1@%g!8!x#z^^v#2lwq_z)o8#mc()zn@t3k4'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'crispander.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'crispander.wsgi.application'

TEMPLATE_DIRS = (
    os.path.join(APP_HOME, 'crispander/templates'),
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.admindocs',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django_markup',
    'tastypie',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
    #apps
    'crispander.app',
    'crispander.personal',
    'accounts',
)


FACEBOOK_APP_ID = '419360901469098'
FACEBOOK_APP_SECRET = '66c1b46fa5f990fa0ca46c3c65cce7a7'
FACEBOOK_REQUEST_PERMISSIONS = 'damon.s.a@hotmail.com'

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}