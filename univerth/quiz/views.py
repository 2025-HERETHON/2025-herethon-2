from django.shortcuts import render
from .models import *
from datetime import date
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def quiz_show(request):
    today = date.today()
    quiz = Quiz.objects.filter(date=today).first()
    options = Option.objects.filter(quiz=quiz)

    return render(request, 'quiz.html', {'quiz': quiz, 'options': options})

@csrf_exempt
def check_answer(request):
    if request.method == 'POST':
        selected_option_id = request.POST.get('selected_option_id')

        try:
            selected_option = Option.objects.get(id=selected_option_id)
            quiz = selected_option.quiz
        except Option.DoesNotExist:
            return JsonResponse({'error': '선택지를 찾지 못했습니다.'})

        is_correct = (int(selected_option_id) == int(quiz.answer))

        try:
            answer_option = Option.objects.get(id=quiz.answer)
        except Option.DoesNotExist:
            return JsonResponse({'error':'정답을 불러오지 못했습니다.'})
        
        if UserQuiz.objects.filter(user=request.user, quiz=quiz, is_answered=True).exists():
            return JsonResponse({'error': '이미 참여한 퀴즈입니다.', 'is_answered': True})

        if request.user.is_authenticated:
            request.user.user_point += 1
            request.user.save()

            if request.user.univ:
                request.user.univ.univ_point = sum(
                    student.user_point for student in request.user.univ.students.all()
                )
                request.user.univ.save()
        
        UserQuiz.objects.create(
            user = request.user,
            quiz = quiz,
            is_answered = True,
            is_correct = is_correct,
            selected_option = selected_option
        )
        
        return JsonResponse({
            'is_correct': is_correct,
            'answer': answer_option.text,
            'description': quiz.description,
            'is_answered': True,
            'mission':quiz.mission,
        })

    return JsonResponse({'error': '유효하지 않은 요청입니다.'})