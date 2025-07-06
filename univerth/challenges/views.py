from django.shortcuts import render, get_object_or_404, redirect
from .models import *

#챌린지 세부 내용 보여주기 (챌린지 설명+피드 리스트)
def challenge_detail(request, id): 
    challenge=get_object_or_404(Challenge, id=id) 
    feeds = challenge.challenge_feeds.all().order_by('-created_at')
    return render(request, 'challenge_detail.html', {'challenge':challenge, 'feeds':feeds})

#챌린지 참여 함수
def join_challenge(request, challenge_id):
    challenge=get_object_or_404(Challenge, id=challenge_id)
    user=request.user

    if user not in challenge.participants.all():
        challenge.participants.add(user)
        challenge.participant_num+=1
        challenge.save()
        return redirect('challenge_detail', id=challenge.id)
    
#챌린지 나가기 함수 
def exit_challenge(request, challenge_id):
    challenge=get_object_or_404(Challenge, id=challenge_id)
    user=request.user

    if user in challenge.participants.all():
        challenge.participants.remove(user)
        challenge.participant_num-=1
        challenge.save()
        return redirect('challenge_detail', id=challenge.id)
    
#좋아요
def add_like(request, feed_id):
    feed=get_object_or_404(Feed, id=feed_id)
    user=request.user

    if user not in feed.like.all():
        feed.like.add(user) #템플릿에서 개수 불러올 땐 {{feed.like.count}}
    return redirect('feed_detail', feed_id)

#좋아요 취소
def remove_like(request, feed_id):
    feed=get_object_or_404(Feed, id=feed_id)
    user=request.user

    if user in feed.like.all():
        feed.like.remove(user) #템플릿에서 개수 불러올 땐 {{feed.like.count}}
    return redirect('feed_detail', feed_id)

#피드 작성
def create_feed(request, challenge_id):
    challenge = get_object_or_404(Challenge, id=challenge_id)
    if request.method=="POST":
        content=request.POST.get("content")
        image=request.FILES.get("image")

        feed=Feed.objects.create(
            content=content,
            image=image,
            writer=request.user,
            challenge=challenge,
        )

        if request.user.is_authenticated:
            request.user.user_point += 1
            request.user.save()
            
            if request.user.univ:
                request.user.univ.univ_point = sum(
                    student.user_point for student in request.user.univ.students.all()
                )
                request.user.univ.save()

        return redirect('challenge_detail',id=challenge.id)
    return render(request, 'create_feed.html', {'challenge': challenge})

#피드 수정
def update_feed(request, id):
    feed=get_object_or_404(Feed, id=id)

    if request.method=="POST":
        feed.content=request.POST.get('content')
        image=request.FILES.get('image')

        if image:
            if feed.image:
                feed.image.delete()
            feed.image = image
        feed.save()
        return redirect('challenge_detail', id=feed.challenge.id)
    return render(request, 'update.html', {'feed':feed})

#피드 삭제 
def delete_feed(request, id):
    feed=get_object_or_404(Feed, id=id)
    feed.delete()
    return redirect('challenge_detail', id=feed.challenge.id)

