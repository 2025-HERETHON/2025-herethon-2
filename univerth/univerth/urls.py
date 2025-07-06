"""
URL configuration for univerth project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from users.views import signup_step1, signup_step2, signup_step3, univ_search, activate_email, check_verification
from quiz.views import *
from challenges.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('signup/step1/', signup_step1, name='signup_step1'),
    path('signup/step2/', signup_step2, name='signup_step2'),
    path('signup/step3/', signup_step3, name='signup_step3'),
    path('activate_email/<token>/<email>/', activate_email, name='activate_email'),
    path('check-verification/', check_verification, name='check_verification'),
    path('univ/', univ_search, name='univ_search'),
    path('quiz/', quiz_show, name='quiz_show'),
    path('quiz/check/', check_answer, name='check_answer'),
    path('challenges/challenge-detail/<int:id>/', challenge_detail, name='challenge_detail'),
    path('challenges/join-challenge/<int:challenge_id>/', join_challenge, name='join_challenge'),
    path('challenges/exit-challenge/<int:challenge_id>/', exit_challenge, name='exit_challenge'),
    path('challenges/create-feed/', create_feed, name='create_feed'),
    path('challenges/update-feed/<int:id>/', update_feed, name='update_feed'),
    path('challenges/delete-feed/<int:id>/', delete_feed, name='delete_feed'),
    path('challenges/feeds/<int:feed_id>/add-like/', add_like, name='add_like'),
    path('challenges/feeds/<int:feed_id>/remove-like/', remove_like, name='remove_like'),
]
