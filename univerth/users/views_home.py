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

    return render(request, "home.html", {
        'ranking': ranking,
        'my_ranking': my_rank
    })

def home_quiz(request):
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