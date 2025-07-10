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
    participant_num = models.IntegerField(default=1)
    creator = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="challenge_creator")
    description = models.TextField()
    participants = models.ManyToManyField(to=User, related_name="challenge_participants")

    def __str__(self):
        return self.challenge_name
    
class Feed(models.Model):
    content=models.TextField()
    challenge=models.ForeignKey(to=Challenge, on_delete=models.CASCADE, related_name="challenge_feeds")
    writer=models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="feeds_author")
    created_at=models.DateTimeField(auto_now_add=True)
    like=models.ManyToManyField(to=User, related_name="like_feeds")

    def __str__(self):
        return self.content[:10]  #콘텐트 앞 10글자 리턴

class Comment(models.Model):
    feed=models.ForeignKey(to=Feed, on_delete=models.CASCADE, related_name="comments")
    content=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)
    writer=models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="comments_author")

    def __str__(self):
        return f'[{self.writer.nickname}] - {self.content}'
    
class FeedImage(models.Model):
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to=upload_filepath)