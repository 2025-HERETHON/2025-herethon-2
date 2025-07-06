import { loadNavbar } from "./main.js"; //화면 공통 요소

//퀴즈 더미 데이터
const dummyQuiz =
{
    quiz_id: 1,
    date: "2025-07-06",
    question: "다음 중 실제로는 재활용이 어렵지만, 일반적으로는 재활용이 가능하다고 오해받는 품목은?",
    options: ["투명 페트병", "우유 팩", "금속 캔", "유리병"],
    is_answered: false  // 아직 안 풀었으면 false, 풀었으면 true
}
//제출 응답 데이터
const dummyResponse = {
    is_correct: true,   //맞을시... 틀리면 false
    description: "우유팩은 특수 코팅이 되어 있어 별도로 수거하지 않으면 재활용으로 처리하지 않아요.",
    is_answered: true,
    answer: "우유 팩"
}


//요일별 카테고리
const categoryMap = [
    "사회인식/트렌드",
    "소비습관", //일요일
    "식생활",
    "이동 수단",
    "캠퍼스 생활",
    "디지털 습관",
    "재사용/재활용",
];

window.addEventListener("DOMContentLoaded", async () => {

    //-----------------top/bottom nav-bar 불러오기------------------------
    await loadNavbar(".quiz-container");

    // 날짜에 따른 텍스트 설정
    const dateObj = new Date(dummyQuiz.date);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const weekday = dateObj.getDay();
    const weekdayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

    const categoryText = categoryMap[weekday]; //요일텍스트 가져옴

    //퀴즈 요일별 카테고리 가져오기
    document.querySelector('.category-round p').innerText = categoryText;
    //퀴즈 일자 가져오기
    document.querySelector('.today-date p').innerText = `${month}월 ${day}일 ${weekdayNames[weekday]}`

    //질문 가져오기
    document.querySelector(".question-content p").innerText = dummyQuiz.question;

    // 퀴즈 답변 보기 가져오기
    const answerBox = document.querySelector(".answers");
    dummyQuiz.options.forEach((option, idx) => {

        const btn = document.createElement("button");
        btn.className = "quiz-option";

        const labelNumber = idx + 1;
        btn.innerText = `${labelNumber}. ${option}`;

        btn.dataset.index = idx;
        btn.addEventListener("click", () => {
            document.querySelectorAll(".quiz-option").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
        });
        answerBox.appendChild(btn);
    });

    // 제출 버튼 클릭 이벤트
    document.querySelector(".submit-btn").addEventListener("click", () => {
        const selected = document.querySelector(".quiz-option.selected");
        if (!selected) {
            alert("답변을 선택해주세요.");
            return;
        }
        const selectedAnswer = selected.innerText.split(". ")[1];

        // 서버에서 받을 응답 예시
        const response = {
            is_correct: selectedAnswer === dummyResponse.answer,
            ...dummyResponse
        };
        // 답변 상태 처리
        document.querySelectorAll(".quiz-option").forEach(btn => {
            btn.disabled = true;
            const optionText = btn.innerText.split(". ")[1];

            // 정답 표시
            if (optionText === dummyResponse.answer) {
                btn.classList.add("correct");
            }

            // 내가 선택한 게 오답이라면 표시
            if (
                btn.classList.contains("selected") &&
                btn.innerText.split(". ")[1] !== dummyResponse.answer
            ) {
                btn.classList.remove("selected");
                btn.classList.add("wrong");
            }
        });

        const container = document.createElement("div");
        container.className = "description-container";
        // 설명 텍스트 추가
        const descBox = document.createElement("div");
        descBox.className = "quiz-description";
        descBox.innerHTML = `
        <div class = "description-icon"><p>해설</p></div>
        <div class = "description-text">
            <p>${response.description}</p>
        </div>
        <div class = "description-line"></div>
        <div class = "recommend-activity-icon"> 
            <img src="../static/images/quiz/recommend-icon.png" class="priority-icon" alt="추천활동">
        </div>
        <div class = "recommend-activity">
            <p>다 쓴 폐건전지·폐전지를 모아 전용 수거함에 분리배출 해보기!</p>
        </div>
        `
        container.appendChild(descBox);
        document.querySelector(".quiz-container").appendChild(container);

        // 제출 버튼 비활성화 & 삭제
        document.querySelector(".submit-btn").disabled = true;
        const submitBtn = document.querySelector(".submit-btn");
        submitBtn.parentNode.removeChild(submitBtn);

        // 토스트 메시지 표시
        showToast("나무 1그루를 심었어요!");
    });
});

//제출하기 후 Toast
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.innerText = message;
    document.body.appendChild(toast);

    // 1초 후 사라지게
    setTimeout(() => {
        toast.classList.add("hide");
        setTimeout(() => toast.remove(), 500); // 애니메이션 후 완전 제거
    }, 1000);
}
