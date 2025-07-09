from django.shortcuts import render, redirect
from .models import *
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def challenge_list_my(request):
    user = request.user
    if user.is_authenticated:
        user_challenges = Challenge.objects.filter(participants=user)
        if not user_challenges.exists():
            return render(request, "ch_my.html", {'message':'가입한 챌린지가 없습니다.'})
        else:
            challenge_list = []
            for ch in user_challenges:
                challenge = {
                    'id': ch.id,
                    'name': ch.challenge_name,
                    'creator_name' : ch.creator.nickname,
                    'participant_num' : ch.participant_num
                }
                challenge_list.append(challenge)
            return render(request, "ch_my.html", { "joining_challenges" : challenge_list })
    else:
        return redirect('login')

def challenge_list_popular(request):
    top_challenges = Challenge.objects.order_by('-participant_num')[:10]
    challenge_list = []
    for ch in top_challenges:
        challenge = {
            'name': ch.challenge_name,
            'creator_name' : ch.creator.nickname,
            'participant_num' : ch.participant_num
        }
        challenge_list.append(challenge)
    return render(request, "ch_group.html", {"popular_challenges": challenge_list })

@csrf_exempt
def create_challenge(request):
    if request.method == "POST":
        challenge_name = request.POST.get('name')
        description = request.POST.get('description')
        creator = request.user

        challenge = Challenge.objects.create(
            challenge_name = challenge_name,
            description = description,
            creator = creator,
            participant_num = 1
        )
        
        challenge.participants.add(creator)
        return redirect("challenges:challenge_detail", id=challenge.id)
    else:
        return render(request, "ch_add.html")