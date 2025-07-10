import { loadNavbar } from "./main.js"; // 공통 네비게이션 로딩

const imageSrc = "../static/images/map/custom_marker.png";
const imageSize = new kakao.maps.Size(44, 54);
const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

window.addEventListener("DOMContentLoaded", async () => {
  await loadNavbar(".map-container");

  const rawData = document.getElementById("store-data")?.textContent.trim();
  let storeData = [];

  if (rawData) {
    try {
      storeData = JSON.parse(rawData);
    } catch (err) {
      console.error("JSON 파싱 에러:", err);
    }
  } else {
    console.warn("store-data 스크립트가 비어 있습니다.");
  }

  const mapContainer = document.getElementById("map");
  const mapOption = {
    center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울시청 중심
    level: 5,
  };
  const map = new kakao.maps.Map(mapContainer, mapOption);
  const geocoder = new kakao.maps.services.Geocoder();

  storeData.forEach((store) => {
    if (!store.address) return;

    geocoder.addressSearch(store.address, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        const marker = new kakao.maps.Marker({
          map: map,
          position: coords,
          image: markerImage,
        });

        kakao.maps.event.addListener(marker, "click", () => {
          showStoreInfo(store);
          map.panTo(coords);
        });
      } else {
        console.warn(`주소 변환 실패: ${store.name} - ${store.address}`);
      }
    });
  });

  function showStoreInfo(store) {
    const wrap = document.querySelector(".map_wrap");
    const infoBox = document.getElementById("map_info");

    infoBox.querySelector(".name").textContent = store.name;
    infoBox.querySelector(".address").textContent = store.address;
    infoBox.querySelector(".tags").innerHTML = store.tags
      .map((tag) => `<span class="tag">#${tag}</span>`)
      .join(" ");

    wrap.classList.add("active");
  }

  document.querySelector(".close-btn").addEventListener("click", () => {
    document.querySelector(".map_wrap").classList.remove("active");
  });
});


function showStoreInfo(store) {
  const wrap = document.querySelector(".map_wrap");
  const infoBox = document.getElementById("map_info");

  infoBox.querySelector(".name").textContent = store.name;
  infoBox.querySelector(".address").textContent = store.address;
  infoBox.querySelector(".tags").innerHTML = store.tags
    .map((tag) => `<span class="tag"># ${tag}</span>`)
    .join(" ");

  wrap.style.display = "block"; // 혹시 display:none 걸려있으면 복구
  wrap.classList.add("active");
}


const map_add=document.querySelector('.map_add')
map_add.addEventListener('click',function(){
  window.location.href= "map_add.html"
})