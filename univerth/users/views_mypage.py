from django.shortcuts import render
from django.http import JsonResponse
from .models import *
from quiz.models import *
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def mypage(request):
    if request.method == "POST":
        user = request.user
        nickname = request.POST.get('nickname')
        password = request.POST.get('password')

        if nickname:
            if User.objects.filter(nickname=nickname).exists():
                return JsonResponse({'error':'이미 존재하는 닉네임입니다.'})
            user.nickname = nickname
        if password:
            user.set_password(password)

        user.save()
        
        return JsonResponse({'message':'회원 정보가 수정되었습니다.'})
    else:
        return render(request, "home.html")
        #return render(request, "mypage.html")    

