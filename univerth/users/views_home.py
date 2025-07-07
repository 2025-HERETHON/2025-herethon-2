from django.shortcuts import render
from django.http import JsonResponse
from .models import *

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

# 상위 랭킹 + 내 랭킹 JsonResponse로 넘겨주는 함수
def ranks(request):
    ranking = univ_rankings()
    my_rank = my_ranking(request.user)

    return JsonResponse({
        'ranking': ranking,
        'my_ranking': my_rank
    })
