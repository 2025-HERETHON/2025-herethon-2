from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from .forms import SignupForm
from .models import Univ, User, EmailVerification
from .emails import email_verify, email_validation
from django.views.decorators.csrf import csrf_exempt
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
import hashlib
import base64
from django.contrib.auth import authenticate, login as auth_login

@csrf_exempt
def signup_step1(request):
    if request.method == "POST":
        univ_id = request.POST.get('univ')
        univ = Univ.objects.get(id=univ_id)
        if not univ_id or not univ_id.isdigit():
            return JsonResponse({ "errors": "잘못된 입력입니다." })
        try: 
            univ = Univ.objects.get(id=univ_id)
        except:
            return JsonResponse({"errors": "존재하지 않는 학교입니다."})
        
        univ_id = int(univ_id)
        request.session['univ_id'] = univ_id

        return redirect("signup_step2")
    else:
        return render(request, "account01.html")

@csrf_exempt
def signup_step2(request):
    if request.method == "POST":
        email = request.POST.get('email')
        if email is None:
            return JsonResponse({'error': '이메일 주소는 필수 항목입니다.'}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': '이미 사용 중인 이메일입니다.'}, status=400)
        
        if email_validation(email, request):
            request.session['email'] = email
            email_verify(email, request)
            return JsonResponse({'message': '인증 메일을 발송하였습니다.'})
        else:
            return JsonResponse({'error': '선택한 학교의 메일이 아닙니다. 다시 입력해주세요.'})
    else:
        return render(request, "account02.html")

@csrf_exempt
def signup_step3(request):
    email = request.session.get('email')
    try:
        email_verification = EmailVerification.objects.get(email=email).is_verified
    except:
        return HttpResponse("이메일 인증이 필요합니다.", status=403)
    
    if request.method == "POST":
        form = SignupForm(request.POST)

        univ_id = request.session.get('univ_id')
        email = request.session.get('email')

        try: 
            univ = Univ.objects.get(id=univ_id)
        except:
            return JsonResponse({
                "signup_success": False,
                "errors": {"univ": ["존재하지 않는 학교입니다."]}
            })
            
        if form.is_valid():
            user = form.save(commit=False)
            user.univ = univ
            user.email = email
            user.is_verified = email_verification
            user.save()

            request.session.pop('univ_id', None)
            request.session.pop('email', None)

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
        return render(request, "account03.html", {'form':form})

def univ_search(request):
    query = request.GET.get('q', '')

    if not query:
        return JsonResponse([], safe=False)
    
    universities = Univ.objects.filter(univ_name__contains=query)[:10]

    data = []
    for univ in universities:
        data.append({"id" : univ.id, "name": univ.univ_name})
    
    return JsonResponse(data, safe=False)


def activate_email(request, token, email):
    decoded_email = force_str(urlsafe_base64_decode(email))
    generated_token = base64.urlsafe_b64encode(hashlib.sha256(decoded_email.encode()).digest()).decode()

    try:
        email_verification = EmailVerification.objects.get(email=decoded_email)
    except:
        return JsonResponse({'error': '이메일 인증 객체가 존재하지 않습니다.'})

    if token == generated_token and not User.objects.filter(email=decoded_email).exists():
        email_verification.is_verified = True
        email_verification.save()
        return JsonResponse({'message': '이메일이 성공적으로 인증되었습니다. 회원가입을 계속 진행해주세요.'})
    else:
        return JsonResponse({'error': '유효하지 않은 인증 요청입니다.'}, status=400)
    

def check_verification(request):
    email = request.session.get('email')
    email_verification = EmailVerification.objects.get(email=email).is_verified
    if email_verification:
        return JsonResponse({'message': '이메일 인증 완료', 'redirect_url': '/signup/step3/'})
    else:
        return JsonResponse({'error': '이메일 인증을 완료하세요.'})

@csrf_exempt
def login(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            #return redirect("home")
            return render(request, "home.html")
        else:
            return JsonResponse({'error': '잘못된 아이디 혹은 비밀번호입니다.'})
    else:
        return render(request, "login.html")
    
def check_username(request):
    username = request.GET.get('username')

    if User.objects.filter(username=username).exists():
        return JsonResponse({'error': '이미 존재하는 아이디입니다.'})
    else:
        return JsonResponse({'message': '사용 가능한 아이디입니다.'})
