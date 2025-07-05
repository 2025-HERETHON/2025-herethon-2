from django.contrib import admin
from .models import User, Univ
from django.contrib.sessions.models import Session

# Register your models here.
admin.site.register(User)
admin.site.register(Univ)
admin.site.register(Session)