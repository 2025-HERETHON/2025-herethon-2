from django.contrib import admin
from django.urls import path
from .views import *

app_name = 'map'

urlpatterns = [
    path('', map_main, name='map_main'), 
    path('add/', new_store, name='new_store'),
    path('', map_main, name="map_main"),
    path('store/<int:id>/', show_store, name="show_store"),
    path('store/list/', get_stores, name='get_stores'),
]