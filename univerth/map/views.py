from django.shortcuts import render
from .models import *
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@csrf_exempt
def new_store(request):
    if request.method == "POST":
        name = request.POST.get('name')
        address = request.POST.get('address')

        stores = GreenStore.objects.filter(address=address)

        if stores.exists():
            for s in stores:
                if name.replace(" ","") == s.name.replace(" ", ""):
                    return JsonResponse({'error':'이미 추가된 가게입니다.'})
        
        tag_list = request.POST.getlist('tags')
        if not tag_list:
            return JsonResponse({'error':'태그를 하나 이상 선택해야합니다.'})
        
        long_lat = get_long_lat(address)
        longitude = long_lat.get('long')
        latitude = long_lat.get('lat')

        store = GreenStore.objects.create(
            name = name,
            address = address,
            longitude = longitude,
            latitude = latitude
        )

        for t in tag_list:
            try:
                tag = GreenTag.objects.get(id=t)
                store.tags.add(tag)
            except GreenTag.DoesNotExist:
                return JsonResponse({'error':'존재하지 않는 태그입니다.'})
            
        return JsonResponse({'message':'정상적으로 추가되었습니다.'})
            
    else:
        return render(request, "home.html")
        #return render(request, "map_add.html")

def get_long_lat(address):
    return {'long':123.12, 'lat':123.12}