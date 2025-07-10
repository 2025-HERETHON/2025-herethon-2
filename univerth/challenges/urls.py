from django.contrib import admin
from django.urls import path
from .views import *
from .views_list import *

app_name = "challenges"

urlpatterns = [
    path('challenge-detail/<int:id>/', challenge_detail, name='challenge_detail'),
    path('join-challenge/<int:id>/', join_challenge, name='join_challenge'),
    path('exit-challenge/<int:id>/', exit_challenge, name='exit_challenge'),
    path('create-feed/<int:id>/', create_feed, name='create_feed'),
    path('update-feed/<int:id>/', update_feed, name='update_feed'),
    path('delete-feed/<int:id>/', delete_feed, name='delete_feed'),
    path('feeds/<int:id>/toggle-like/', toggle_like, name='toggle_like'),
    path('my/', challenge_list_my, name="challenge_list_my"),
    path('popular/', challenge_list_popular, name="challenge_list_popular"),
    path('new/', create_challenge, name='create_challenge'),
    path('feeds/<int:id>/create-comment/', create_comment, name='create_comment'),
    path('feeds/<int:id>/delete-comment/<int:comment_id>/', delete_comment, name='delete_comment'),
    path('feeds/<int:id>/update-comment/<int:comment_id>/', update_comment, name='update_comment'),
    path('feeds/<int:id>/data/', feed_data, name='feed_data'),
    path('feeds/<int:id>/', feed_detail, name='feed_detail'),
]