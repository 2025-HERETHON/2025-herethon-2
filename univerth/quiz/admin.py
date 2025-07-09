from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Quiz)
admin.site.register(UserQuiz)

@admin.register(Option)
class OptionModelAdmin(admin.ModelAdmin):
    list_display = ['id', 'quiz_id', 'text']