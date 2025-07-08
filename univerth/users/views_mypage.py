from django.shortcuts import render
from django.http import JsonResponse
from .models import *
from quiz.models import *
from challenges.models import *
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def mypage(request):
    if request.method == "POST":
        user = request.user
        nickname = request.POST.get('nickname')

        if nickname:
            if User.objects.filter(nickname=nickname).exists():
                return JsonResponse({'error':'이미 존재하는 닉네임입니다.'})
            user.nickname = nickname

        user.save()
        
        return JsonResponse({'message':'회원 정보가 수정되었습니다.'})
    else:
        user = request.user
        quiz_num = UserQuiz.objects.filter(user=user).count()
        feed_num = Feed.objects.filter(writer=user).count()
        data = { 'nickname':user.nickname,
                'username': user.username,
                'quiz_num': quiz_num,
                'feed_num' : feed_num  }
        return render(request, "home.html", {'data':data})
        #return render(request, "mypage.html")    

