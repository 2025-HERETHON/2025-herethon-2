from django.contrib import admin
from django.urls import path
from .views import *
from .views_list import *

app_name = "challenges"

urlpatterns = [
    path('challenge-detail/<int:id>/', challenge_detail, name='challenge_detail'),
    path('join-challenge/<int:challenge_id>/', join_challenge, name='join_challenge'),
    path('exit-challenge/<int:challenge_id>/', exit_challenge, name='exit_challenge'),
    path('create-feed/', create_feed, name='create_feed'),
    path('update-feed/<int:id>/', update_feed, name='update_feed'),
    path('delete-feed/<int:id>/', delete_feed, name='delete_feed'),
    path('feeds/<int:feed_id>/add-like/', add_like, name='add_like'),
    path('feeds/<int:feed_id>/remove-like/', remove_like, name='remove_like'),
    path('my/', challenge_list_my, name="challenge_list_my"),
    path('popular/', challenge_list_popular, name="challenge_list_popular"),
    path('new/', create_challenge, name='create_challenge'),
]