from django.shortcuts import render, get_object_or_404, redirect
from .models import *
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

#챌린지 세부 내용 보여주기 (챌린지 설명+피드 리스트)
def challenge_detail(request, id): 
    challenge=get_object_or_404(Challenge, id=id) 
    feeds = challenge.challenge_feeds.all().order_by('-created_at')
    is_joined = challenge.participants.filter(id=request.user.id).exists()
    for feed in feeds:
        feed.is_liked = feed.like.filter(id=request.user.id).exists()
    feed_success = request.session.pop('feed_success', False)
    request.session.modified = True
    return render(request, 'detail_ch.html', {'challenge':challenge, 'feeds':feeds, 'is_joined': is_joined, 'feed_success': feed_success, })

#챌린지 참여 함수
@csrf_exempt
def join_challenge(request, id):
    challenge=get_object_or_404(Challenge, id=id)
    user=request.user

    if user not in challenge.participants.all():
        challenge.participants.add(user)
        challenge.participant_num+=1
        challenge.save()
        #return redirect('challenges:challenge_detail', id=challenge.id)
        return JsonResponse({'message':'가입되었습니다.'})
    return JsonResponse({'error': '이미 가입되었습니다.'})

#챌린지 나가기 함수 
def exit_challenge(request, id):
    challenge=get_object_or_404(Challenge, id=id)
    user=request.user

    if user in challenge.participants.all():
        challenge.participants.remove(user)
        challenge.participant_num-=1
        challenge.save()
        return redirect('challenges:challenge_list_my')
    
#좋아요 & 좋아요 취소 데이터
@csrf_exempt
@require_POST
def toggle_like(request, id):
    feed = get_object_or_404(Feed, id=id)
    user = request.user

    if user in feed.like.all():
        feed.like.remove(user)
        liked = False
    else:
        feed.like.add(user)
        liked = True

    return JsonResponse({
        'liked': liked,
        'like_count': feed.like.count(),
    })

#피드 작성
@csrf_exempt
def create_feed(request, id):
    challenge = get_object_or_404(Challenge, id=id)

    if request.method=="POST":
        content=request.POST.get("content")
        images=request.FILES.getlist("image")

        feed=Feed.objects.create(
            content=content,
            writer=request.user,
            challenge=challenge,
        )

        for image in images:
            FeedImage.objects.create(feed=feed, image=image)

        if request.user.is_authenticated:
            request.user.user_point += 1
            request.user.save()

            if request.user.univ:
                request.user.univ.univ_point = sum(
                    student.user_point for student in request.user.univ.students.all()
                )
                request.user.univ.save()
        request.session['feed_success'] = True
        return redirect(f'/challenges/challenge-detail/{challenge.id}/?success=1')
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
        return redirect('challenges:feed_detail', id=feed.challenge.id)
    return render(request, 'update.html', {'feed':feed})

#피드 삭제 
def delete_feed(request, id):
    feed=get_object_or_404(Feed, id=id)
    feed.delete()
    return redirect('challenges:challenge_detail', id=feed.challenge.id)

#댓글 생성
@csrf_exempt
def create_comment(request, id):
    feed=get_object_or_404(Feed, id=id)
    if request.method=="POST":
        content=request.POST.get('content')

        Comment.objects.create(
            feed=feed,
            content=content,
            writer=request.user
        )
        return JsonResponse({'message':'댓글이 정상 등록되었습니다.'})
    return JsonResponse({'error':'오류가 발생했습니다.'})
    # 댓글 수는 {{feed.comments.count}} 로 가져오기

#댓글 수정
@csrf_exempt
def update_comment(request, id, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)

    if request.method == "POST":
        content = request.POST.get('content')
        if content:
            comment.content = content
            comment.save()
            return JsonResponse({'message': '댓글이 수정되었습니다.'})
        else:
            return JsonResponse({'error': '내용이 없습니다.'}, status=400)
    return JsonResponse({'error': 'POST 요청만 허용'}, status=405)

#댓글 삭제
def delete_comment(request, id):
    comment = get_object_or_404(Comment, id=id)
    comment.delete()
    return redirect('challenges:feed_detail', comment.feed.id)

#피드 상세 조회. JsonResponse로 데이터만 보냄
def feed_data(request, id):
    feed = get_object_or_404(Feed, id=id)

    data = {
        'writer': feed.writer.nickname,
        'content': feed.content,
        'created_at': feed.created_at.strftime('%m/%d %H:%M'),  
        'like_count': feed.like.count(),
        'comment_count': feed.comments.count(),
        'comments': [
            {
                'writer': comment.writer.nickname,
                'content': comment.content,
                'created_at': comment.created_at.strftime('%m/%d %H:%M')
            }
            for comment in feed.comments.all().order_by('created_at')
        ]
    }

    return JsonResponse(data)

# 피드 상세 조회 페이지 html 렌더링
def feed_detail(request, id):
    return render(request, 'feed_detail.html', {'feed_id': id})