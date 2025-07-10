const container = document.getElementById('map_info');

const shop = {
  name: "치코커피",
  address: "서울 성북구 장월로1라길 13",
  tags: ["#다회용기 포장", "비건"]
};

container.innerHTML = `
  <div id="map_info">
    <div class="name">${shop.name}</div>
    <div class="address">${shop.address}</div>
    <div class="tags">
      ${shop.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ')}
    </div>
  </div>
`;

const map_add=document.querySelector('.map_add')
map_add.addEventListener('click',function(){
  window.location.href="map_add.html"
})