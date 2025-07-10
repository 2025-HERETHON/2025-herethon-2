import { loadNavbar } from "./main.js"; // 공통 UI 불러오기

let quizId = null;  // 저장
let userId = null;  // 서버에서 제공하면 저장

window.addEventListener("DOMContentLoaded", async () => {
    // navbar 불러오기
    loadNavbar(".quiz-container");

    userId = 1; //임시지정

    // html에서 불러옴-> window.quizData 사용
    console.log("문제 로드 - quizData:", quizData);

    quizId = quizData.quiz_id;
    console.log("quizId:", quizId);
    userId = document.body.dataset.userId; // 백엔드에서 넘긴 유저 ID 사용

    // 날짜 및 카테고리 표시
    //const todayText = document.querySelector(".today-date p");
    const categoryText = document.querySelector(".quiz-days-category");
    const dateISO = document.getElementById("quiz-date").dataset.date;

    const today = new Date(dateISO);
    //const month = today.getMonth() + 1;
    //const day = today.getDate();
    const weekday = today.getDay();
    //const weekdayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const categoryMap = [
        "사회인식/트렌드", "소비습관", "식생활", "이동 수단", "캠퍼스 생활", "디지털 습관", "재사용/재활용"
    ];

    //todayText.innerText = `${month}월 ${day}일 ${weekdayNames[weekday]}`;
    categoryText.textContent = categoryMap[weekday];

    // 선택지 버튼 이벤트 처리
    const options = document.querySelectorAll(".quiz-option");
    let selectedOptionId = null;

    options.forEach((btn) => {
        btn.addEventListener("click", () => {
            options.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedOptionId = btn.dataset.id;
        });
    });

    // 제출 처리
    const form = document.getElementById("quiz-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!selectedOptionId) {
            alert("답변을 선택해주세요.");
            return;
        }

        const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;
        console.log("제출 데이터:");
        console.log("quiz_id:", quizId);
        console.log("user_id:", userId);
        console.log("selected_option_id:", selectedOptionId);


        const res = await fetch("/quiz/check/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-CSRFToken": csrfToken
            },
            body: new URLSearchParams({
                selected_option_id: selectedOptionId,
                quiz_id: quizId,
                user_id: userId
            })
        });

        const data = await res.json();
        console.log("서버 응답:", data);

        if (data.error) {
            alert("오류 발생: " + data.error);
            return;
        }

        // 정답/오답 표시
        options.forEach((btn) => {
            const btnText = btn.innerText.split(". ")[1];
            btn.disabled = true;

            if (btnText === data.answer) {
                btn.classList.add("correct");
            }

            if (btn.classList.contains("selected") && btnText !== data.answer) {
                btn.classList.remove("selected");
                btn.classList.add("wrong");
            }
        });

        // 해설 및 미션 표시
        const container = document.createElement("div");
        container.className = "description-container";
        container.innerHTML = `
      <div class="quiz-description">
        <div class="description-icon"><p>해설</p></div>
        <div class="description-text"><p>${data.description}</p></div>
        <div class="description-line"></div>
        <div class="recommend-activity-icon">
          <img src="/static/images/quiz/recommend-icon.png" class="priority-icon" alt="추천활동">
        </div>
        <div class="recommend-activity"><p>${data.mission}</p></div>
      </div>
    `;
        document.querySelector(".quiz-container").appendChild(container);

        // 제출 버튼 제거
        document.querySelector(".submit-btn")?.remove();

        // 나무 심기 알림
        showToast("나무 1그루를 심었어요!");
    });

    // 토스트 메시지 함수
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast-message";
        toast.innerText = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("hide");
            setTimeout(() => toast.remove(), 800);
        }, 1000);
    }
});
