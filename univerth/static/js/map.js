import { loadNavbar } from "./main.js";

const imageSrc = "../static/images/map/custom_marker.png";
const imageSize = new kakao.maps.Size(44, 54);
const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

window.addEventListener("DOMContentLoaded", async () => {
  loadNavbar(".map-container");

  const mapContainer = document.getElementById("map");
  const places = new kakao.maps.services.Places();

  // 대학 이름 → 위치 좌표 변환
  places.keywordSearch(userUniv, async (result, status) => {
    if (status !== kakao.maps.services.Status.OK) {
      console.error("학교 키워드 검색 실패:", userUniv);
      return;
    }

    const lat = result[0].y;
    const lng = result[0].x;
    const center = new kakao.maps.LatLng(lat, lng);

    const mapOption = {
      center: center,
      level: 5,
    };
    const map = new kakao.maps.Map(mapContainer, mapOption);
    // 초기 카카오맵 띄워질 위치 = 나의 대학 -> 대학 마커로 표시
    const univMarker = new kakao.maps.Marker({
      position: center,
      map: map,
      title: "내 대학",
      image: new kakao.maps.MarkerImage(
        "../static/images/home/ranking_myUniv.png",
        new kakao.maps.Size(40, 30)
      )
    });
    // 마커 찍기 위한 장소데이터 요청
    try {
      const response = await fetch("/map/store/list/");
      const data = await response.json();
      const storeList = data.stores;

      storeList.forEach((store) => {
        if (store.latitude == null || store.longitude == null) return;

        const coords = new kakao.maps.LatLng(store.longitude, store.latitude);

        const marker = new kakao.maps.Marker({
          map: map,
          position: coords,
          image: markerImage,
        });

        //마커 클릭시 상세 정보 요청
        kakao.maps.event.addListener(marker, "click", async () => {
          try {
            const detailRes = await fetch(`/map/store/${store.id}/`);
            const detail = await detailRes.json();
            if (detail.success) {
              showStoreInfo(detail);
              map.panTo(coords);
            }
          } catch (err) {
            console.error("상세 정보 에러:", err);
          }
        });
      });
    } catch (error) {
      console.error("가게 리스트 요청 에러:", error);
    }

    //모달에 상세 정보 표시
    function showStoreInfo(store) {
      const wrap = document.querySelector(".map_wrap");
      const infoBox = document.getElementById("map_info");

      infoBox.querySelector(".name").textContent = store.name;
      infoBox.querySelector(".address").textContent = store.address;
      infoBox.querySelector(".tags").innerHTML = store.tags
        .map((tag) => `<span class="tag">#${tag}</span>`)
        .join(" ");

      wrap.style.display = "block";
      wrap.classList.add("active");
    }

    // 모달 닫기
    document.querySelector(".close-btn").addEventListener("click", () => {
      document.querySelector(".map_wrap").classList.remove("active");
    });

    // 장소 추가 버튼
    document.querySelector(".map_add").addEventListener("click", function () {
      window.location.href = addUrl;
    });
  });
});
