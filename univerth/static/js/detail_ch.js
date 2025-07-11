import { loadNavbar } from "./main.js"; //html에 추가

function getCSRFToken() {
    const tokenInput = document.querySelector('input[name=csrfmiddlewaretoken]');
    return tokenInput ? tokenInput.value : '';
}

let editingCommentId = null;  

document.addEventListener('DOMContentLoaded', function () {
    loadNavbar(".challenge-container");

    // 가입 모달 열기/닫기
    function openModal() {
        document.getElementById('chjoinmodal').style.display = 'block';
    }
    function closeModal() {
        document.getElementById('chjoinmodal').style.display = 'none';
    }

    // 가입 후 버튼 텍스트 변경 및 클릭 이벤트 변경
    function convertWrite(challengeId) {
        closeModal();

        fetch(`/challenges/join-challenge/${challengeId}/`, {
            method: 'POST'
        })
            .then(response => response.json().then(data => ({ ok: response.ok, data })))
            .then(({ ok, data }) => {
                if (!ok || data.error) {
                    alert('알 수 없는 오류가 발생했습니다.')
                    return;
                }
                const btnText = document.getElementById("jointext");
                btnText.innerText = "글쓰기";

                const actionBtn = document.getElementById("joinbtn");
                actionBtn.onclick = function () {
                    location.href = `/challenges/create-feed/${challengeId}/`;
                };
            });
    }


    // 댓글 모달 열기/닫기
    function openCommentModal(feedId) {
        const modal = document.getElementById(`commentModal-${feedId}`);
        if (modal) {
            modal.style.display = "block";
            document.body.style.overflow = "hidden";  // 스크롤 막기
        }
    }
    function closeCommentModal(modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";    // 스크롤 허용
    }

    // 슬라이드 기능 (이미지, 점)
    function showSlide(feedId, index) {
        // const slides = document.querySelectorAll('.carousel-img');
        // const dots = document.querySelectorAll('.dot');
        const images = document.querySelectorAll(`.carousel-img.feed-${feedId}`);
        const dots = document.querySelectorAll(`#carousel-${feedId} .dot`);

        // slides.forEach((img, i) => {
        //     img.classList.remove('active');
        //     dots[i].classList.remove('dotactive');
        // });

        // slides[index].classList.add('active');
        // dots[index].classList.add('dotactive');
        images.forEach((img, i) => {
            img.classList.toggle("active", i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("dotactive", i === index);
        });
    }

    // 댓글 입력창 활성화 스타일 토글
    // const commentInput = document.getElementsByClassName('c-input');
    // if (commentInput) {
    //     commentInput.addEventListener('input', () => {
    //         if (commentInput.value.trim() !== "") {
    //             commentInput.classList.add('active');
    //         } else {
    //             commentInput.classList.remove('active');
    //         }
    //     });
    // }
    document.querySelectorAll('.c-input').forEach(input =>
        input.addEventListener('input', () => {
            if (input.value.trim() !== "") {
                input.classList.add('active');
            } else {
                input.classList.remove('active');
            }
        })
    )

    // 댓글 추가
    function addComment(challengeId, feedId) {
    const input = document.getElementById(`c-input-${feedId}`);
    const content = input.value.trim();
    if (!content) return;

    if (editingCommentId) {
        // 수정 API 호출
        const formData = new FormData();
        formData.append('content', content);
console.log('feedId:', feedId, 'editingCommentId:', editingCommentId);
        fetch(`/challenges/feeds/${feedId}/update-comment/${editingCommentId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
            },
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert('수정 오류가 발생했습니다.');
                return;
            }
        alert('댓글이 수정되었습니다.');
        window.location.reload();
        editingCommentId = null; // 수정 완료 후 초기화
    });
    } else {
        // 새 댓글 추가 API 호출 (기존 addComment 코드)
        const formData = new FormData();
        formData.append('content', content);

        fetch(`/challenges/feeds/${feedId}/create-comment/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken(),
            },
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
            alert('댓글 추가 오류가 발생했습니다.');
            return;
            }
            alert('댓글이 등록되었습니다.');
            window.location.reload();
        });
        }
    }
    /*
    function addComment(challengeId, feedId) {
    const input = document.getElementById(`c-input-${feedId}`);
    const content = input.value.trim();
    if (!content) return;

    const url = editingCommentId
        ? `/challenges/update-comment/${editingCommentId}/`
        : `/challenges/feeds/${feedId}/create-comment/`;

    const formData = new FormData();
    formData.append('content', content);

    fetch(`/challenges/feeds/${feedId}/update-comment/${commentId}/`, {
    method: 'POST',
    body: formData,
    })
    .then(response => response.json().then(data => ({ ok: response.ok, data })))
    .then(({ ok, data }) => {
        if (!ok || data.error) {
            alert('알 수 없는 오류가 발생했습니다.');
            return;
        }
        alert(editingCommentId ? '댓글이 수정되었습니다.' : '댓글이 등록되었습니다.');
        editingCommentId = null;  // 수정 모드 종료
        input.value = '';
        input.classList.remove('active');
        window.location.reload();
    });
}
    
    function addComment(challengeId, feedId) {
        const input = document.getElementById(`c-input-${feedId}`)
        console.log(input.value);
        if (input) {
            const formData = new FormData();
            formData.append('content', input.value.trim());
            fetch(`/challenges/feeds/${feedId}/create-comment/`, {
                method: 'POST',
                body: formData
            })
                .then(response => response.json().then(data => ({ ok: response.ok, data })))
                .then(({ ok, data }) => {
                    if (!ok || data.error) {
                        alert('알 수 없는 오류가 발생했습니다.');
                        return;
                    }
                    else {
                        alert('댓글이 등록되었습니다.');
                        window.location.reload();
                    }
                })
        }
    }
    */

    function addLike(feedId) {
        fetch(`/challenges/feeds/${feedId}/toggle-like/`, {
            method: 'POST'
        })
            .then(response => response.json().then(data => ({ ok: response.ok, data })))
            .then(({ ok, data }) => {
                if (!ok || data.error) {
                    alert('알 수 없는 오류가 발생했습니다.');
                    return;
                }
                else {
                    //alert('좋아요가 등록되었습니다.');
                    //window.location.href = `/challenges/challenge-detail/${challengeId}/`;
                    window.location.reload();
                }
            })
    }

    // 댓글 모달 외부 클릭 시 닫기
    window.addEventListener('click', function (e) {
        this.document.querySelectorAll('.modal-overlay').forEach(modal => {
            if (e.target === modal) {
                closeCommentModal(modal);
            }
        })
        // const commentModal = document.getElementById("commentModal");
        // if (e.target === commentModal) {
        //     closeCommentModal();
        // }
    });

    // 수정/삭제 모달 제어
    const editDeleteModal = document.getElementById('delete');
    const confirmModal = document.getElementById('confirmModal');

    // 댓글 우측 점 클릭 시 수정/삭제 모달 위치 및 노출
    document.addEventListener('click', function (e) {
    const dot = e.target.closest('.c-dot');

    if (dot) {
        e.stopPropagation();

    // 클릭한 c-dot에 달린 댓글 id 가져오기
        const commentId = dot.dataset.commentId;
        if (!commentId) return;

    // 댓글 카드 찾기
        const commentCard = dot.closest('.commentcard');
        if (!commentCard) return;

    // 해당 댓글의 모달 찾기 (id가 delete-<commentId> 인 모달)
        const modal = document.getElementById(`delete-${commentId}`);
        if (!modal) return;

    // 모든 모달 닫기 (중복 노출 방지)
        document.querySelectorAll('.delete').forEach(el => el.classList.add('hidden'));

    // 클릭한 dot 위치 계산해서 모달 위치 잡기
        const rect = dot.getBoundingClientRect();
        
        modal.style.position = 'absolute';
        modal.style.top = `${rect.bottom + window.scrollY - 50 }px`;
        modal.style.left = `${rect.left + window.scrollX - 70}px`;
        

    // 모달 보이기
        modal.classList.remove('hidden');

    } else {
    // c-dot 아닌 곳 클릭 시, 모든 모달 닫기
        document.querySelectorAll('.delete').forEach(modal => {
            if (modal && !modal.contains(e.target)) {
                modal.classList.add('hidden');
            }
        });
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

    // 댓글 수정 버튼 클릭 시 입력창
    window.editComment = function(commentId) {
    
    const commentContent = document.getElementById(`comment-content-${commentId}`).innerText.trim();
    // 해당 댓글이 포함된 feedId 찾기
    const commentCard = document.querySelector(`.commentcard[data-comment-id="${commentId}"]`);
    const feedModal = commentCard.closest('.modal-overlay');
    const feedId = feedModal?.id?.split('-')[1];

    if (!feedId) {
        console.error('feedId를 찾을 수 없습니다.');
        return;
    }

    // 해당 피드의 입력창에 댓글 내용 삽입
    const input = document.getElementById(`c-input-${feedId}`);
    input.value = commentContent;
    input.focus();
    input.classList.add('active');

    editingCommentId = commentId;

    // 기존 수정/삭제 모달은 닫기
    const modal = document.getElementById(`delete-${commentId}`);
    if (modal) modal.classList.add('hidden');
};

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
    window.addComment = addComment;
    window.addLike = addLike;
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

        if (editDeleteModal) editDeleteModal.classList.add('hidden');
        if (confirmModal) confirmModal.classList.remove('hidden');
    };
});

// 필요 시 추가로  confirmDelete, cancelDelete를 전역으로 등록할 수도 있으나
// 위 addEventListener로 처리되므로 HTML onclick 속성 대신 이벤트리스너 사용 권장