from django.db import models
from django.contrib.auth.models import AbstractUser

class Univ(models.Model):
    univ_name=models.CharField(max_length=20)
    point=models.IntegerField(default=0)
    rank=models.IntegerField(default=417)

class User(AbstractUser):
    email=models.CharField(max_length=30, unique=True, null=False, blank=False)
    nickname=models.CharField(max_length=20, unique=True)
    is_verified=models.BooleanField(default=False)
    univ=models.ForeignKey(to=Univ, on_delete=models.CASCADE, related_name="students", null=True, blank=True)

    #def __str__(self):
    #    return f"{self.nickname} ({self.univ.univ_name})"
