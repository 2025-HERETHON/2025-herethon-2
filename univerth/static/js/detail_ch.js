/*
document.addEventListener('DOMContentLoaded', function () {
    // 가입 모달 열기/닫기
    function openModal() {
        document.getElementById('chjoinmodal').style.display = 'block';
    }
    function closeModal() {
        document.getElementById('chjoinmodal').style.display = 'none';
    }

    // 가입 후 버튼 텍스트 변경 및 클릭 이벤트 변경
    function convertWrite() {
        closeModal();

        const btnText = document.getElementById("jointext");
        btnText.innerText = "글쓰기";

        const actionBtn = document.getElementById("joinbtn");
        actionBtn.onclick = function () {
            location.href = 'univerth/templates/create_feed.html';
        };
    }

    // 댓글 모달 열기/닫기
    function openCommentModal() {
        document.getElementById("commentModal").style.display = "block";
        document.body.style.overflow = "hidden";
    }
    function closeCommentModal() {
        document.getElementById("commentModal").style.display = "none";
        document.body.style.overflow = "auto";
    }

    // 슬라이드 기능
    function showSlide(index) {
        const slides = document.querySelectorAll('.carousel-img');
        const dots = document.querySelectorAll('.dot');

        slides.forEach((img, i) => {
            img.classList.remove('active');
            dots[i].classList.remove('dotactive');
        });

        slides[index].classList.add('active');
        dots[index].classList.add('dotactive');
    }

    // 댓글 입력창 활성화 스타일
    const commentInput = document.getElementById('c-input');
    if (commentInput) {
        commentInput.addEventListener('input', () => {
            if (commentInput.value.trim() !== "") {
                commentInput.classList.add('active');
            } else {
                commentInput.classList.remove('active');
            }
        });
    }

    // 댓글 모달 외부 클릭 시 닫기
    window.addEventListener('click', function (e) {
        const commentModal = document.getElementById("commentModal");
        if (e.target === commentModal) {
            closeCommentModal();
        }
    });

    // 수정/삭제 모달 열기
    const editDeleteModal = document.getElementById('delete');
    document.addEventListener('click', function (e) {
        const dot = e.target.closest('.c-dot');
        if (dot) {
            e.stopPropagation();

            const commentCard = dot.closest('.commentcard');
            if (!commentCard) return;

            const rect = commentCard.getBoundingClientRect();
            editDeleteModal.style.position = 'absolute'; // 꼭 설정 필요
            editDeleteModal.style.top = `${rect.bottom + window.scrollY + 5}px`;
            editDeleteModal.style.left = `${rect.left + window.scrollX}px`;

            editDeleteModal.classList.remove('hidden');
        } else {
            if (!editDeleteModal.contains(e.target)) {
                editDeleteModal.classList.add('hidden');
            }
        }
    });



    // 삭제 확인 모달 제어
    const confirmModal = document.getElementById('confirmModal');
    const deleteBtn = document.getElementById('delete-btn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            editDeleteModal.classList.add('hidden');
            confirmModal.classList.remove('hidden');
            console.log('delete button clicked');
        });
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            confirmModal.classList.add('hidden');
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            confirmModal.classList.add('hidden');
            alert('삭제 완료!'); // 실제 삭제 로직 여기에 추가
        });
    }

    // 전역 함수 등록 (템플릿 내 onclick에서 호출용)
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.convertWrite = convertWrite;
    window.openCommentModal = openCommentModal;
    window.closeCommentModal = closeCommentModal;
    window.showSlide = showSlide;
    window.openConfirmModal = () => {
        editDeleteModal.classList.add('hidden');
        confirmModal.classList.remove('hidden');
    };
    window.confirmDelete = () => {
        confirmModal.classList.add('hidden');
    };
    window.cancelDelete = () => {
        confirmModal.classList.add('hidden');
    };
});
*/

import { loadNavbar } from "./main.js";

document.addEventListener('DOMContentLoaded', function () {
    // navbar 불러오기
    loadNavbar(".challenge-container");
    // 가입 모달 열기/닫기
    function openModal() {
        document.getElementById('chjoinmodal').style.display = 'block';
    }
    function closeModal() {
        document.getElementById('chjoinmodal').style.display = 'none';
    }

    // 가입 후 버튼 텍스트 변경 및 클릭 이벤트 변경
    function convertWrite() {
        closeModal();

        const btnText = document.getElementById("jointext");
        btnText.innerText = "글쓰기";

        const actionBtn = document.getElementById("joinbtn");
        actionBtn.onclick = function () {
            location.href = 'univerth/templates/create_feed.html';
        };
    }

    // 댓글 모달 열기/닫기
    function openCommentModal() {
        document.getElementById("commentModal").style.display = "block";
        document.body.style.overflow = "hidden";  // 스크롤 막기
    }
    function closeCommentModal() {
        document.getElementById("commentModal").style.display = "none";
        document.body.style.overflow = "auto";    // 스크롤 허용
    }

    // 슬라이드 기능 (이미지, 점)
    function showSlide(index) {
        const slides = document.querySelectorAll('.carousel-img');
        const dots = document.querySelectorAll('.dot');

        slides.forEach((img, i) => {
            img.classList.remove('active');
            dots[i].classList.remove('dotactive');
        });

        slides[index].classList.add('active');
        dots[index].classList.add('dotactive');
    }

    // 댓글 입력창 활성화 스타일 토글
    const commentInput = document.getElementById('c-input');
    if (commentInput) {
        commentInput.addEventListener('input', () => {
            if (commentInput.value.trim() !== "") {
                commentInput.classList.add('active');
            } else {
                commentInput.classList.remove('active');
            }
        });
    }

    // 댓글 모달 외부 클릭 시 닫기
    window.addEventListener('click', function (e) {
        const commentModal = document.getElementById("commentModal");
        if (e.target === commentModal) {
            closeCommentModal();
        }
    });

    // 수정/삭제 모달 제어
    const editDeleteModal = document.getElementById('delete');
    const confirmModal = document.getElementById('confirmModal');

    // 댓글 우측 점 클릭 시 수정/삭제 모달 위치 및 노출
    document.addEventListener('click', function (e) {
        const dot = e.target.closest('.c-dot');
        if (dot) {
            e.stopPropagation();

            const commentCard = dot.closest('.commentcard');
            if (!commentCard) return;

            const rect = commentCard.getBoundingClientRect();
            editDeleteModal.style.position = 'absolute';
            editDeleteModal.style.top = `${rect.bottom + window.scrollY + 5}px`;
            editDeleteModal.style.left = `${rect.left + window.scrollX}px`;

            editDeleteModal.classList.remove('hidden');
        } else {
            // .c-dot 아닌 곳 클릭하면 모달 숨기기
            if (!editDeleteModal.contains(e.target)) {
                editDeleteModal.classList.add('hidden');
            }
        }
    });

    // 삭제 버튼 클릭 시 삭제 확인 모달 열기
    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            editDeleteModal.classList.add('hidden');  // 수정/삭제 모달 숨기기
            confirmModal.classList.remove('hidden');  // 삭제 확인 모달 열기
        });
    }

    // 삭제 확인 모달 내 취소 버튼
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            confirmModal.classList.add('hidden');
        });
    }

    // 삭제 확인 모달 내 확인 버튼
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            confirmModal.classList.add('hidden');
            alert('댓글이 삭제되었습니다.');
            // 실제 삭제 로직(서버 요청 등)은 여기서 추가하세요.
        });
    }

    // 전역 함수로 등록 (HTML onclick 속성에서 호출 가능하도록)
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.convertWrite = convertWrite;
    window.openCommentModal = openCommentModal;
    window.closeCommentModal = closeCommentModal;
    window.showSlide = showSlide;
    window.openConfirmModal = function () {
        editDeleteModal.classList.add('hidden'); // 수정/삭제 모달 숨기기
        confirmModal.classList.remove('hidden'); // 삭제 확인 모달 보이기
        confirmModal.style.display = 'flex';
    };
    window.cancelDelete = function () {
    confirmModal.style.display = 'none';     // display 다시 none으로
    };

    window.openConfirmModal = function () {
    console.log('openConfirmModal called'); // 함수 호출 여부 체크
    const editDeleteModal = document.getElementById('delete');
    const confirmModal = document.getElementById('confirmModal');
    console.log('editDeleteModal:', editDeleteModal);
    console.log('confirmModal:', confirmModal);

    if(editDeleteModal) editDeleteModal.classList.add('hidden');
    if(confirmModal) confirmModal.classList.remove('hidden');
};
});

    // 필요 시 추가로  confirmDelete, cancelDelete를 전역으로 등록할 수도 있으나
    // 위 addEventListener로 처리되므로 HTML onclick 속성 대신 이벤트리스너 사용 권장