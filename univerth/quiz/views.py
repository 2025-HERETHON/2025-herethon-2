from django.shortcuts import render
from .models import *
from datetime import date
from django.http import JsonResponse

def quiz_show(request):
    today = date.today()
    quiz = Quiz.objects.filter(date=today).first()
    options = Option.objects.filter(quiz=quiz)

    return render(request, 'quiz.html', {'quiz': quiz, 'options': options})

def check_answer(request):
    if request.method == 'POST':
        selected_option_id = request.POST.get('selected_option_id')

        try:
            selected_option = Option.objects.get(id=selected_option_id)
            quiz = selected_option.quiz  
        except Option.DoesNotExist:
            return JsonResponse({'error': 'Option not found'})

        is_correct = (selected_option.text == quiz.answer)


        return JsonResponse({
            'is_correct': is_correct,
            'answer': quiz.answer,
            'description': quiz.description,
            'is_answered': True,
            'mission':quiz.mission,
        })

    return JsonResponse({'error': 'Invalid request'})