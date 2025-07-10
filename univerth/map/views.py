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

        if longitude is None or latitude is None:
            return JsonResponse({'error': '주소를 찾을 수 없습니다.'})

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
        return render(request, "map_add.html")


def get_long_lat(address):
    geolocator = Nominatim(user_agent="univerth")
    location = geolocator.geocode(address)
    if location:
        return {'long': location.longitude, 'lat': location.latitude}
    else:
        return {'long': None, 'lat': None}

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
    user = request.user
    univ = user.univ.univ_name
    return render(request, 'map.html', {'user_univ': univ})

def get_stores(request):
    stores = []
    store_all = GreenStore.objects.all()
    for s in store_all:
        store = {
            'id': s.id,
            'name': s.name,
            'longitude': s.longitude,
            'latitude': s.latitude
        }
        stores.append(store)
    return JsonResponse({'stores':stores})