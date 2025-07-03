from django.db import models
from users.models import *

class Quiz(models.Model):
    date = models.DateField()
    question = models.TextField()
    answer = models.TextField()
    description = models.TextField(null=True)

class UserQuiz(models.Model):
    is_correct = models.BooleanField(null=True)
    is_answered = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_quiz")
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="user_quiz")