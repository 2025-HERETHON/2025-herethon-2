// 입력값 있을 시 입력칸 색상 변화
const name = document.querySelector('.name');
const address = document.querySelector('.address');
const tags = document.querySelector('.tags');

if (name) {
    name.addEventListener('input', function () {
        if (name.value.trim() !== "") {
            name.style.border = "1px solid #2CD7A6";
        } else {
            name.style.border = "";
        }
    });
}

if (address) {
    address.addEventListener('input', function () {
        if (address.value.trim() !== "") {
            address.style.border = "1px solid #2CD7A6";
        } else {
            address.style.border = "";
        }
    });
}

if (tags) {
    tags.addEventListener('input', function () {
        if (tags.value.trim() !== "") {
            tags.style.border = "1px solid #2CD7A6";
        } else {
            tags.style.border = "";
        }
    });
}

// 입력값 있을 시에 로그인 버튼 색상 변화
const add_btn = document.querySelector('.add_btn');
function checkInputs() {
    if (
        name.value.trim() !== '' &&
        address.value.trim() !== '' &&
        tags.value.trim() !== ''
    ) {
        add_btn.style.backgroundColor = "#2CD7A6";
    } else {
        add_btn.style.backgroundColor = "";
    }
}

[name, address, tags].forEach(input => {
    input.addEventListener('input', checkInputs);
});

// 태그 인풋 클릭 시 팝업 
const input_tags = document.querySelector('.input_tags');
const tag_box = document.querySelector('.tag_box');
const cencel = document.querySelector('.cencel');

input_tags.addEventListener('click', function () {
    tag_box.style.display = 'block';
});

cencel.addEventListener('click', function () {
    tag_box.style.display = 'none';
    tags.value = '';
    updateTagsBorder(); // ★ 추가: 취소 시 테두리도 초기화
    checkInputs();      // ★ 추가: 버튼 색상도 초기화
});

// 태그 선택 시 인풋값 생성
const tagButtons = document.querySelectorAll('.tag_container button');
const selectedTags = new Set();

function updateTagsBorder() {
    if (tags.value.trim() !== "") {
        tags.style.border = "1px solid #2CD7A6";
    } else {
        tags.style.border = "";
    }
}

tagButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        const tagText = button.textContent.replace(/^#\s*/, '');
        if (button.classList.contains('active')) {
            button.classList.remove('active');
            selectedTags.delete(tagText);
        } else {
            button.classList.add('active');
            selectedTags.add(tagText);
        }
        tags.value = Array.from(selectedTags).join(', ');
        updateTagsBorder(); // ★ 추가: 태그 인풋 테두리 업데이트
        checkInputs();      // ★ 추가: 버튼 색상 업데이트
    });
});

// 태그 팝업 확인 버튼 클릭시
const check = document.querySelector('.check');
check.addEventListener('click', function () {
    tag_box.style.display = 'none';
});

//뒤로가기
const back=document.querySelector('.back')
back.addEventListener('click',function(){
    window.location.href='map.html'
})