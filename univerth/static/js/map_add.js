import { loadNavbar} from "./main.js";

window.addEventListener("DOMContentLoaded", async () => {
    loadNavbar(".map-container2");
});

document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 선택
    const nameInput = document.querySelector('.name');
    const addressInput = document.querySelector('.address');
    const tagsInput = document.querySelector('.tags'); // UI용
    const addBtn = document.querySelector('.add_btn');
    const tagBox = document.querySelector('.tag_box');
    const cancelBtn = document.querySelector('.cancel'); // HTML 클래스명과 일치
    const checkBtn = document.querySelector('.check');
    const backBtn = document.querySelector('.back');
    const addForm = document.getElementById('addForm'); // 폼 요소
    const selectedTagsContainer = document.getElementById('selected-tags'); // 선택된 태그의 hidden input들을 담을 곳

    // 입력 필드 Border 스타일 업데이트 함수
    function updateInputBorder(input) {
        if (input.value.trim() !== "") {
            input.style.border = "1px solid #2CD7A6";
        } else {
            input.style.border = "";
        }
    }

    // '장소 추가' 버튼 활성화/비활성화 검사 함수
    function checkInputs() {
        if (
            nameInput.value.trim() !== '' &&
            addressInput.value.trim() !== '' &&
            selectedTagsContainer.querySelectorAll('input[name="tags"]').length > 0
        ) {
            addBtn.style.backgroundColor = "#2CD7A6";
            addBtn.disabled = false; // 버튼 활성화
        } else {
            addBtn.style.backgroundColor = ""; // 기본색으로 돌아감
            addBtn.disabled = true; // 버튼 비활성화
        }
    }

    // 이름, 주소 입력 필드 변경 감지
    [nameInput, addressInput].forEach(input => {
        input.addEventListener('input', () => {
            updateInputBorder(input);
            checkInputs();
        });
    });

    // 태그 입력 필드 포커스/클릭 시 태그 박스 표시
    tagsInput.addEventListener('focus', () => {
        tagBox.style.display = 'block';
    });

    tagsInput.addEventListener('click', () => {
        tagBox.style.display = 'block';
    });

    // 취소 버튼 클릭 시
    cancelBtn.addEventListener('click', () => {
        tagBox.style.display = 'none'; // 태그 박스 숨김
        tagsInput.value = ''; // UI용 태그 input 값 초기화
        updateInputBorder(tagsInput); // 태그 input border 초기화
        
        // 모든 태그 버튼의 'active' 클래스 제거
        document.querySelectorAll('.tag_box button[data-id]').forEach(button => {
            button.classList.remove('active');
        });

        // 숨겨진 태그 hidden input들 모두 제거
        selectedTagsContainer.querySelectorAll('input[name="tags"]').forEach(input => {
            input.remove();
        });
        
        checkInputs(); // '장소 추가' 버튼 상태 다시 검사
    });

    // 태그 선택 버튼들
    const tagButtons = document.querySelectorAll('.tag_box button[data-id]');

    tagButtons.forEach(button => {
        button.addEventListener('click', e => {
            e.preventDefault(); // 버튼 기본 동작 (폼 제출 방지)

            const tagText = button.textContent.trim().replace(/^#\s*/, ''); // # 제거
            const tagId = button.dataset.id;
            // 현재 tagsInput에 표시된 태그들을 배열로 변환
            let currentTags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t.length > 0);
            
            // 버튼의 활성화 상태 토글
            if (button.classList.contains('active')) {
                // 활성화 -> 비활성화: UI에서 태그 텍스트 제거, hidden input 제거
                button.classList.remove('active');
                const textIndex = currentTags.indexOf(tagText);
                if (textIndex > -1) currentTags.splice(textIndex, 1);
                selectedTagsContainer.querySelector(`input[value="${tagId}"]`)?.remove();
            } else {
                // 비활성화 -> 활성화: UI에 태그 텍스트 추가, hidden input 추가
                button.classList.add('active');
                currentTags.push(tagText);
                // 중복 추가 방지를 위해 hidden input이 없는 경우에만 생성
                if (!selectedTagsContainer.querySelector(`input[value="${tagId}"]`)) {
                    const hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = 'tags'; // Django에서 request.POST.getlist('tags')로 받음
                    hiddenInput.value = tagId;
                    selectedTagsContainer.appendChild(hiddenInput);
                }
            }

            // UI용 tagsInput 업데이트 및 관련 함수 호출
            tagsInput.value = currentTags.join(', ');
            updateInputBorder(tagsInput);
            checkInputs();
        });
    });

    // 확인 버튼 클릭 시
    checkBtn.addEventListener('click', () => {
        tagBox.style.display = 'none'; // 태그 박스 숨김
    });

    // 뒤로 가기 버튼 클릭 시
    backBtn.addEventListener('click', () => {
        // Django 프로젝트의 URL에 맞게 수정해주세요.
        // 예: window.location.href = '/map/';
        window.location.href = '/map/'; 
    });

    // === 폼 제출 AJAX 로직 추가 ===
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // 폼의 기본 제출 동작 방지

        const formData = new FormData(addForm); // 폼 데이터 객체 생성

        try {
            const response = await fetch(addForm.action, { // 폼의 action URL로 POST 요청
                method: 'POST',
                body: formData,
                // Django CSRF 토큰을 헤더에 추가 (필수!)
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            });

            const result = await response.json(); // JSON 응답 파싱

            if (response.ok) { // HTTP 상태 코드가 2xx (성공)일 경우
                alert(result.message); // 성공 메시지 표시
                // 성공 후 원하는 페이지로 리다이렉트
                // 예: window.location.href = '/map/'; // 'map' 페이지의 실제 URL로 변경
                window.location.href = '/map/'; // 예시, Django URL로 변경 권장
            } else { // HTTP 상태 코드가 4xx, 5xx (에러)일 경우
                // 서버에서 반환한 에러 메시지 표시
                alert(`오류: ${result.error || '알 수 없는 오류가 발생했습니다.'}`);
            }
        } catch (error) {
            console.error('폼 제출 중 오류 발생:', error);
            alert('서버와 통신 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
        }
    });

    // 페이지 로드 시 초기 상태 설정
    updateInputBorder(nameInput);
    updateInputBorder(addressInput);
    updateInputBorder(tagsInput);
    checkInputs(); // '장소 추가' 버튼의 초기 활성화 여부 설정
});
