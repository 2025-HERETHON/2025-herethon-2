from django.db import models

class GreenTag(models.Model):
    tag = models.CharField(max_length=20)

    def __str__(self):
        return self.tag

class GreenStore(models.Model):
    name=models.CharField(max_length=20)
    address=models.CharField(max_length=30)
    longitude = models.FloatField()
    latitude = models.FloatField()
    tags = models.ManyToManyField(to=GreenTag, related_name="stores")

    def __str__(self):
        return self.name