from django.contrib import admin
from django.urls import path
from .views import *

app_name = 'map'

urlpatterns = [
    path('', map_main, name='map_main'), 
    path('add/', new_store, name='new_store'),
    
]