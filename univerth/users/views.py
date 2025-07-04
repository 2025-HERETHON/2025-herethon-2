from django.shortcuts import render, redirect
from django.http import JsonResponse
from .forms import SignupForm
#from django.views.decorators.csrf import csrf_exempt
#@csrf_exempt

def signup(request):
    if request.method == "POST":
        form = SignupForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({
                "signup_success": True,
                "message": "회원가입이 완료되었습니다"
            })
        else:
            return JsonResponse({
                "signup_success": False,
                "errors": form.errors
            })
    else:
        form = SignupForm()
        return render(request, "signup.html", {form:'form'})
