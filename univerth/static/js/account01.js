document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.querySelector('.search_btn');
    const univInput = document.querySelector('.univ');
    const stepBtn = document.querySelector('.step_btn');
    let dropdown = null;
    let selectedUnivId = null;

    function showDropdown(univList) {
        if (dropdown) dropdown.remove();

        dropdown = document.createElement('div');
        dropdown.className = 'univ_dropdown';
        dropdown.style.position = 'absolute';
        dropdown.style.background = '#fff';
        dropdown.style.width = univInput.offsetWidth + 'px';
        dropdown.style.maxHeight = '200px';
        dropdown.style.overflowY = 'auto';
        dropdown.style.outline = 'none';
        dropdown.style.zIndex = 1000;
        dropdown.style.scrollbarWidth = 'none';
        dropdown.style.msOverflowStyle = 'none';

        if (!Array.isArray(univList)) univList = [];

        if (univList.length === 0) {
            const noneDiv = document.createElement('div');
            noneDiv.textContent = '검색 결과가 없습니다.';
            noneDiv.style.padding = '10px';
            dropdown.appendChild(noneDiv);
        } else {
            univList.forEach(item => {
                const option = document.createElement('div');
                option.textContent = item.name;
                option.dataset.univid = item.id;
                option.style.padding = '10px';
                option.style.cursor = 'pointer';
                option.addEventListener('mousedown', function(e) {
                    univInput.value = item.name;
                    selectedUnivId = item.id;
                    dropdown.remove();
                });
                dropdown.appendChild(option);
            });
        }

        const parent = univInput.parentElement;
        parent.style.position = 'relative';
        dropdown.style.left = univInput.offsetLeft + 'px';
        dropdown.style.top = (univInput.offsetTop + univInput.offsetHeight) + 'px';
        parent.appendChild(dropdown);
    }

    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const keyword = univInput.value.trim();
        if (!keyword) {
            showDropdown([]);
            return;
        }
        fetch(`/univ/?q=${encodeURIComponent(keyword)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('네트워크 오류');
                }
                return response.json();
            })
            .then(data => {
                showDropdown(data);
            })
            .catch(error => {
                showDropdown([]);
                console.error('대학 검색 API 오류:', error);
            });
    });

    univInput.addEventListener('blur', function() {
        setTimeout(() => {
            if (dropdown) dropdown.remove();
        }, 150);
    });

    univInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    // "다음" 버튼 클릭 시
    stepBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // 대학 선택 안 했을 때
        if (!selectedUnivId) {
            alert('대학을 검색해서 선택해주세요.');
            return;
        }
        // POST로 /signup/step1/에 대학 id 전달
        fetch('/signup/step1/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `univ=${encodeURIComponent(selectedUnivId)}`
        })
        .then(response => {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json();
            } else {
                return response.text();
            }
        })
        .then(data => {
            // 에러 응답 (JSON)
            if (typeof data === 'object') {
                if (data.errors) {
                    alert(data.errors); // "잘못된 입력입니다." 또는 "존재하지 않는 학교입니다."
                } else if (data.redirect_url) {
                    window.location.href = data.redirect_url;
                }
                else {
                    alert('알 수 없는 오류가 발생했습니다.');
                }
            } else {
                // 정상 응답 (account02.html 렌더링)
                //document.open();
                //document.write(data);
                //document.close();
                alert('잘못된 응답 형식입니다.')
            }
        })
        .catch(error => {
            alert('서버와 통신 중 오류가 발생했습니다.');
            console.error('대학 선택 POST 오류:', error);
        });
    });
});