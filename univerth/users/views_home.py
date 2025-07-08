from django.shortcuts import render
from django.http import JsonResponse
from .models import *
from quiz.models import *
from datetime import date

# 상위 세개 대학 랭킹
def univ_rankings():
    top_univs = Univ.objects.order_by('-univ_point')[:3]
    ranking_data = []
    for idx, univ in enumerate(top_univs, start=1):
        ranking_data.append({
            "univ_name": univ.univ_name,
            "point": univ.univ_point,
            "ranking": idx
        })
    return ranking_data

# 내 대학 랭킹
def my_ranking(user):
    if not user.is_authenticated or not user.univ:
        return None
    univs = Univ.objects.order_by('-univ_point').values_list('id', flat=True)
    ranking_list = list(univs)
    my_rank = ranking_list.index(user.univ.id) + 1

    return {
        "univ_name": user.univ.univ_name,
        "point": user.univ.univ_point,
        "ranking": my_rank
    }

def home(request):
    ranking = univ_rankings()
    my_rank = my_ranking(request.user)

    today = date.today()
    month = today.month
    year = today.year
    
    answered_quiz = get_answered_quiz(year, month, request.user)
    return render(request, "home.html", {
        'ranking': ranking,
        'my_ranking': my_rank,
        'answered_quiz': answered_quiz
    })


def home_detail_quiz(request):
    year = request.GET.get('year')
    month = request.GET.get('month')
    day = request.GET.get('day')

    try:
        quiz_date = date(int(year), int(month), int(day))
    except:
        return JsonResponse({'error': '유효한 날짜를 입력하세요'})
    
    quiz = Quiz.objects.filter(date=quiz_date).first()

    if not quiz:
        return JsonResponse({'error':'해당 날짜의 퀴즈가 없습니다.'})
    
    weekday = quiz_date.weekday()
    if weekday == 0:
        type = '소비 습관'
    elif weekday == 1:
        type = '식생활'
    elif weekday == 2:
        type = '이동 수단'
    elif weekday == 3:
        type = '캠퍼스 생활'
    elif weekday == 4:
        type = '디지털 습관'
    elif weekday == 5:
        type = '재사용/재활용'
    elif weekday == 6:
        type = '사회적 인식 및 트렌드'

    return JsonResponse({
        'type': type,
        'question' : quiz.question,
        'answer': quiz.answer,
        'mission' : quiz.mission
    })

def calendar(request):  
    year = int(request.GET.get('year'))
    month = int(request.GET.get('month'))

    answered_quiz = get_answered_quiz(year, month, request.user)
    return JsonResponse({'answered_quiz':answered_quiz})

def get_answered_quiz(year, month, user):  # 특정 달의 퀴즈 참여 현황 가져오기
    monthly_quizzes = UserQuiz.objects.filter(quiz__date__year=year, quiz__date__month=month, user=user).order_by('quiz__date')
    
    
    correct = []
    wrong = []
    for m in monthly_quizzes:
        if m.is_answered:
            if m.is_correct:
                correct.append(m.quiz.date)
            else:
                wrong.append(m.quiz.date)
    
    answered_quiz = {
        'correct' : correct,
        'wrong' : wrong
    }
    
    return answered_quiz

def auth(request):
    return render(request, "auth.html")