from django.shortcuts import render, get_object_or_404
from .models import *
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from geopy.exc import GeocoderTimedOut


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

#피그마 보니 화면을 새로 렌더링할 필요는 없는 거 같아 데이터만 전송합니다!
def show_store(request, id):
    try:
        store = GreenStore.objects.get(id=id)
    except GreenStore.DoesNotExist:
        return JsonResponse({'success': False, 'error': '가게를 찾을 수 없습니다.'}, status=404)
    
    store_detail = {
        "success": True,
        "name": store.name,
        "address": store.address,
        "tags": list(store.tags.values_list("tag", flat=True))  
    }
    return JsonResponse(store_detail)

#메인 지도 함수
def map_main(request):
    return render(request, 'map_main.html')