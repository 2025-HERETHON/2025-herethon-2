from django.contrib import admin
from django.urls import path, include
from .views import *

app_name = 'map'

urlpatterns = [
    path('add/', new_store, name='new_store'),
]