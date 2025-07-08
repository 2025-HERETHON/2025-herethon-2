from django.db import models
from users.models import *


class Quiz(models.Model):
    date = models.DateField()
    question = models.TextField()
    answer = models.TextField()
    description = models.TextField(null=True)
    mission=models.TextField()

    def __str__(self):
        return f'문제 {self.id} - {self.question}'
    
class Option(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="options")
    text = models.CharField(max_length=255)

    def __str__(self):
        return f'문제 {self.quiz.id} - {self.text}'

class UserQuiz(models.Model):
    is_correct = models.BooleanField(null=True)
    is_answered = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_quiz")
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="user_quiz")
    selected_option=models.ForeignKey(Option, on_delete=models.CASCADE, related_name="user_quiz", null=True)
    


