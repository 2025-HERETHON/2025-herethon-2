import { loadNavbar } from "./main.js"; //화면 공통 요소
let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();
// 월 이름 배열
const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

// 캘린더 DOM 요소 전역으로 정의
const daysTag = document.querySelector(".days");
const currentDate = document.querySelector(".current-date");
const prevNextIcon = document.querySelectorAll(".icons button");

function renderCalendar() {
    // 이번 달의 시작 요일 (월요일 시작 기준으로 조정)
    let firstDayofMonth = (new Date(currYear, currMonth, 1).getDay() + 6) % 7;

    // 이번 달의 마지막 날짜
    let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();

    let totalDays = firstDayofMonth + lastDateofMonth;
    let rows = Math.ceil(totalDays / 7); // 필요한 주 수 계산

    let liTag = "";

    // 지난달 날짜
    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${new Date(currYear, currMonth, -i + 1).getDate()}</li>`;
    }

    // 이번 달 날짜 채우기
    for (let i = 1; i <= lastDateofMonth; i++) {
        const dateKey = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

        let isToday = (i === new Date().getDate() &&
            currMonth === new Date().getMonth() &&
            currYear === new Date().getFullYear()) ? "active" : "";

        let iconType = dayIconStatus[dateKey] || "default";

        let iconPath = {
            correct: "../static/images/home/day_correct.png",
            wrong: "../static/images/home/day_wrong.png",
            default: "../static/images/home/day_default.png"
        }[iconType];

        liTag += `
                 <li class="${isToday}" data-date="${dateKey}">
                     ${i}
                     <img src="${iconPath}" class="calendar-icon"/>
                  </li>`;
    }

    // 다음달 날짜 채우기 (필요한 칸만큼만)
    let nextDays = (rows * 7) - totalDays;
    for (let i = 1; i <= nextDays; i++) {
        liTag += `<li class="inactive">${i}</li>`;
    }

    daysTag.innerHTML = liTag;
    currentDate.innerText = `${currYear}년 ${months[currMonth]}월`;

    //날짜 클릭시에 모달 열기
    document.querySelectorAll(".days li").forEach(li => {
        li.addEventListener("click", () => {
            const clickDate = li.dataset.date;
            if (!clickDate) return;
            openQuizModal(clickDate);
        })
    })

};
/*//캘린더 아이콘 표시를 위한 더미 데이터---------------------------
const quizStatusByDate = {
    "2025-07-12": {
        isAnswered: true,
        isCorrect: false,
        quizId: 1
    },
    "2025-07-14": {
        isAnswered: true,
        isCorrect: true,
        quizId: 2
    },
    "2025-07-16": {
        isAnswered: false,
        quizId: 3
    }
}

//일별 모달창 불러오기를 위한 더미데이터
const quizHistory = [
    {
        date: "2025-07-06",
        question: "다음 중 실제로는 재활용이 어렵지만...",
        is_correct: true, //문제 맞았는지/틀렸는지
        description: "우유팩은 특수 코팅이 되어 있어...",
        recommend_activity: "불필요한 이메일 삭제하기",
    },
    {
        date: "2025-07-05",
        question: "다 쓴 건전지를 버리는 올바른 방법은?",
        answer: "전용 수거함",
        is_correct: false,
        description: "건전지는 일반 쓰레기가 아니라...",
        recommend_activity: "불필요한 이메일 삭제하기",
    }
];
*/
const dayIconStatus = {};

//--------------------------- 캘린더 불러오기------------------------------------
window.addEventListener("DOMContentLoaded", async () => {

    //-----------------top/bottom nav-bar 불러오기------------------------
    loadNavbar(".home-container");

    // 데이터에 따른 아이콘 구별
    homeData.answered_quiz.correct.forEach(date => {
        dayIconStatus[date] = "correct";
    });

    homeData.answered_quiz.wrong.forEach(date => {
        dayIconStatus[date] = "wrong";
    });

    renderCalendar();

    // 이전/다음 버튼 클릭 시 달 변경
    prevNextIcon.forEach((icon) => {
        icon.addEventListener("click", async () => {
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

            if (currMonth < 0 || currMonth > 11) {
                date = new Date(currYear, currMonth, new Date().getDate());
                currYear = date.getFullYear();
                currMonth = date.getMonth();
            } else {
                date = new Date(); // 현재 날짜 유지
            }

            await updateAnsweredQuiz(currYear, currMonth + 1);
        });
    });

    //-------------------랭킹 불러오기------------------------
    renderRanking();

});

//---------------------------날짜별로 모달창 띄위기-------------------------

// -----------------------------랭킹 불러오기-------------------------------

/* <<랭킹 순위 매기는 Rule>>
1) 점수 높은 순으로 정렬하되, 동점이면 같은 순위
2) 동점자가 많아도 각 등수에서 최대 3명까지만 표시(단, 가나다순 기준으로 3명 중 추림)
3) 내 학교가 top3 안에 있으면, 따로 내 학교 카드 안 보여주고, 대신 1~3등 아이콘 중에서 내 학교에만 priorityIcons[4] 사용
예시) 등수는 1등: 1팀, 2등: 4팀 중 가나다순 2팀만 표시*/

//랭킹 더미 데이터
/*const dummyRankingData = [
    { rank: 1, name: "성신여자대학교", score: 10345 },
    { rank: 2, name: "경기대학교 서울캠퍼스", score: 8386 },
    { rank: 3, name: "한국외국어대학교", score: 7034 },
    { rank: 4, name: "세종대학교", score: 5800 },
    { rank: 10, name: "동덕여자대학교", score: 957 }
];*/

//랭킹 아이콘 이미지 경로
const priorityIcons = {
    1: "../static/images/home/ranking_1th.png",
    2: "../static/images/home/ranking_2th.png",
    3: "../static/images/home/ranking_3th.png",
    4: "../static/images/home/ranking_myUniv.png",
}

function renderRanking() {
    //랭킹 위치 요소 가져오기
    const topContainer = document.querySelector(".top-rankings");
    const myContainer = document.querySelector(".my-univ-ranking");
    topContainer.innerHTML = "";
    myContainer.innerHTML = "";

    const rankingData = homeData.ranking;
    const myRankingData = homeData.my_ranking;
    const myUniversity = homeData.my_ranking?.univ_name || "내 학교";// 사용자 학교명

    //1. 데이터 정리
    //1.1  점수 내림차순 정렬 : 이름 오른차순(가나다순)
    const sorted = [...rankingData].sort((a, b) => {
        if (b.point !== a.point) return b.point - a.point;
        return a.univ_name.localeCompare(b.univ_name);
    });

    //1.2 등수 매기기(동점자 처리- 동점자도 가나순에서 다시 순위 매김)
    let rank = 1;
    let lastScore = null;
    sorted.forEach((item, idx) => {
        if (item.point !== lastScore) {
            rank = idx + 1;
        }
        item.rank = rank;
        lastScore = item.point;
    });

    //1.3 등수별 그룹 만들기
    const grouped = {};
    sorted.forEach(item => {
        if (!grouped[item.rank]) grouped[item.rank] = [];
        grouped[item.rank].push(item);
    });

    // 1.4 top3 만들기 (3명까지, 동점 허용, 가나다 정렬 유지)
    const topList = [];
    for (let rank = 1; rank <= Object.keys(grouped).length && topList.length < 3; rank++) {
        if (!grouped[rank]) continue;
        const group = grouped[rank];

        // 남은 자리에 맞춰 필요한 만큼만 추가
        const remainingSlots = 3 - topList.length;
        const toAdd = group.slice(0, remainingSlots);

        topList.push(...toAdd);
    }

    // 2. 내 대학교가 top3에 포함되어 있는지 체크
    const isMyUnivInTop = topList.some(item => item.univ_name === myUniversity);

    // 3. top3 카드 렌더링
    topList.forEach(item => {
        const isMyUniv = item.univ_name === myUniversity;
        const icon = priorityIcons[item.rank]; // 기본 아이콘

        const card = document.createElement("div");
        card.className = `ranking-card rank-bg-${item.rank <= 3 ? item.rank : 'etc'}`;
        card.innerHTML = `
    <div class="prior-icon">
      <img src="${icon}" class="priority-icon" alt="${item.rank}위">
      ${isMyUniv ? `<img src="${priorityIcons[4]}" class="my-univ-overlay-icon" alt="내 학교">` : ""}
    </div>
    <span class="ranking-univ-name">${item.univ_name}</span>
    <span class="ranking-point">${item.point.toLocaleString()}그루</span>
  `;
        topContainer.appendChild(card);
    });


    // 4. 내 대학교가 top3에 없으면 따로 표시
    if (!isMyUnivInTop && myRankingData) {
        myContainer.innerHTML = `
  <div class="ranking-item my-rank">
    <div class="prior-icon">
      <img src="${priorityIcons[4]}" class="priority-icon" alt="내 대학">
      <div class="my-univ-ranking-round">
        <span class="my-univ-ranking-num">${myRankingData.ranking}</span>
      </div>
    </div>
    <span class="ranking-univ-name">${myRankingData.univ_name}</span>
    <span class="ranking-point">${myRankingData.point.toLocaleString()}그루</span>
  </div>
`;

    }
}

// 모달 외부 클릭 시 닫기
document.querySelector(".modal-overlay").addEventListener("click", (e) => {
    const modal = document.querySelector(".modal");
    if (!modal.contains(e.target)) {
        closeModal();
    }
});

//일별 클릭시 퀴즈 현황 모달창을 위한 데이터 불러들이기
async function openQuizModal(dateStr) {
    const overlay = document.querySelector(".modal-overlay");
    const modal = document.querySelector(".modal");

    const [year, month, day] = dateStr.split("-");

    try {
        const res = await fetch(`/home/quiz/?year=${year}&month=${month}&day=${day}`);
        const data = await res.json();

        if (data.error) {
            modal.innerHTML = `
        <div class="modal-question"><p>${dateStr}에는 퀴즈 기록이 없습니다.</p></div>
        <div class="modal-buttons">
          <button class="cancel-btn">닫기</button>
        </div>`;
        } else {
            const d = new Date(dateStr);
            const formatted = `${d.getMonth() + 1}월 ${d.getDate()}일`;
            const weekday = d.getDay();
            const categoryMap = [
                "사회인식/트렌드", "소비습관", "식생활", "이동 수단",
                "캠퍼스 생활", "디지털 습관", "재사용/재활용"
            ];

            modal.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">
            <p>${formatted}<br>유니버스 퀴즈</p>
          </div>
          <div class="modal-title-right">
            <div class="modal-buttons">
              <button class="cancel-btn">X</button>
            </div>
            <div class="category-round">
              <p class="quiz-days-category">${categoryMap[weekday]}</p>
            </div>
          </div>
        </div>
        <div class="modal-question"><p>Q. ${data.question}</p></div>
        <div class="modal-answer"><p>A. ${data.answer}</p></div>
        <div class="description-line"></div>
        <div class="recommend-activity-icon">
          <img src="../static/images/quiz/recommend-icon.png" class="priority-icon" alt="추천활동" />
        </div>
        <div class="recommend-activity"><p>${data.mission}</p></div>
      `;
        }

        overlay.classList.remove("hidden");
        modal.classList.remove("hidden");
        modal.querySelector(".cancel-btn").addEventListener("click", closeModal);
    } catch (err) {
        console.error("모달 데이터 불러오기 실패:", err);
    }
}

//다른 달로 이동하면 퀴즈 현황 갱신
async function updateAnsweredQuiz(year, month) {
    try {
        const res = await fetch(`/home/calendar/?year=${year}&month=${month}`);
        const data = await res.json();

        // 아이콘 상태 초기화 후 갱신
        Object.keys(dayIconStatus).forEach(key => delete dayIconStatus[key]);

        data.answered_quiz.correct.forEach(date => {
            dayIconStatus[date] = "correct";
        });
        data.answered_quiz.wrong.forEach(date => {
            dayIconStatus[date] = "wrong";
        });

        renderCalendar(); // 새로 그리기
    } catch (err) {
        console.error("달 변경 시 퀴즈 현황 불러오기 실패:", err);
    }
}


// 닫기 함수
function closeModal() {
    document.querySelector(".modal-overlay").classList.add("hidden"); //모달창 이외 공간 클릭시 닫기
    document.querySelector(".modal").classList.add("hidden"); //모달창 숨기기
}
