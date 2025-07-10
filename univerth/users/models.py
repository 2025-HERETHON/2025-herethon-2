from django.db import models
from django.contrib.auth.models import AbstractUser

class Univ(models.Model):
    univ_name=models.CharField(max_length=20)
    rank=models.IntegerField(default=435)
    email_domain=models.CharField(max_length=20)
    univ_point = models.IntegerField(default=0)

    def __str__(self):
        return self.univ_name

class User(AbstractUser):
    email=models.EmailField(max_length=30, unique=True, null=False, blank=False)
    nickname=models.CharField(max_length=20, unique=True)
    is_verified=models.BooleanField(default=False)
    univ=models.ForeignKey(to=Univ, on_delete=models.CASCADE, related_name="students", null=True, blank=True)
    user_point=models.IntegerField(default=0)
    

    #def __str__(self):
    #    return f"{self.nickname} ({self.univ.univ_name})"

class EmailVerification(models.Model):  #이메일 인증 확인용
    email = models.EmailField(unique=True)
    token = models.CharField(max_length=128)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)