from django.shortcuts import render, redirect
from django.http import JsonResponse
from .forms import SignupForm
from .models import Univ
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def signup(request):
    if request.method == "POST":
        data = request.POST.copy()
        univ_name = data.get("univ")

        if univ_name and not univ_name.isdigit():
            try:
                univ = Univ.objects.get(univ_name = univ_name)
                data['univ'] = univ.id
            except Univ.DoesNotExist:
                return JsonResponse({
                    "signup_success": False,
                    "errors": {"univ": ["존재하지 않는 학교입니다."]}
                })

        form = SignupForm(data)

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
        return render(request, "signup.html", {'form':form})
