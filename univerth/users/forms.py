from django.contrib.auth.forms import UserCreationForm
from .models import User
from django import forms

class SignupForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['nickname', 'username']

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)
    #     self.fields['univ'].required = True
