from django.db import models
from users.models import *
import os
from uuid import uuid4
from django.utils import timezone

#미디어 파일 경로
def upload_filepath(instance, filename): 
    today_str=timezone.now().strftime("%Y%m%d")
    file_basename=os.path.basename(filename)
    return f'{instance._meta.model_name}/{today_str}/{str(uuid4())}_{file_basename}'

class Challenge(models.Model):
    challenge_name=models.CharField(max_length=50)
    participant_num = models.IntegerField(default=0)
    creator = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="challenge_creator")
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    description = models.TextField()
    participants = models.ManyToManyField(to=User, related_name="challenge_participants")
    # 중간 테이블(챌린지 이용자)는 어차피 필드가 챌린지랑 유저밖에 없어서 따로 안만들고 ManyToMany로 넣었는데 문제 있거나 수정하고싶음 말씀 주세요..!
    def __str__(self):
        return self.challenge_name
    
class Feed(models.Model):
    image=models.ImageField(upload_to=upload_filepath, blank=True)
    content=models.TextField()
    challenge=models.ForeignKey(to=Challenge, on_delete=models.CASCADE, related_name="challenge_feeds")
    author=models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="feeds_author")
    created_at=models.DateField(auto_now_add=True)
    like=models.ManyToManyField(to=User, related_name="like_feeds")

    def __str__(self):
        return self.content[:10] 
    #우선 콘텐트 앞 10글자 리턴하게 했는데 나중에 수정해주셔도 됩니다!

#생각해보니 저희가 댓글 모델을 ERD에 안추가해서 따로 추가했습니다..!
class Comment(models.Model):
    feed=models.ForeignKey(to=Feed, on_delete=models.CASCADE, related_name="comments")
    content=models.TextField()
    created_at=models.DateField(auto_now_add=True)
    author=models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="comments_author")

    def __str__(self):
        return f'[{self.author.nickname}] - {self.content}'

    