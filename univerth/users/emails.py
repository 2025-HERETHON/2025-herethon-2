from django.core.mail import send_mail
from django.http import JsonResponse
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
import hashlib
import base64
from .models import User, Univ, EmailVerification

def email_verify(email, request):

    token = base64.urlsafe_b64encode(hashlib.sha256(email.encode()).digest()).decode()

    EmailVerification.objects.update_or_create(email=email, defaults={'token': token, 'is_verified': False})
    
    # 이메일 인증 링크
    activation_link = request.build_absolute_uri(
        reverse('activate_email', kwargs={'token': token, 'email': urlsafe_base64_encode(force_bytes(email))}))

    send_mail(
        '[Univerth] 이메일 인증을 완료해주세요',
        f'다음 링크를 클릭하여 이메일 인증을 완료해주세요: {activation_link}',
        'univerthhere@gmail.com',
        [email],
        fail_silently=False,
        )


# 학교 이메일인지 확인
def email_validation(email, request):
    univ_id = request.session.get('univ_id')
    try: 
        univ = Univ.objects.get(id=univ_id)
    except:
        return False

    univ_email_domain = univ.email_domain
    email = email.strip()

    if email.endswith(univ_email_domain):
        return True
    else:
        return False
