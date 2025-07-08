import { loadNavbar } from "./main.js"; //화면 공통 요소

//캘린더 아이콘 표시를 위한 더미 데이터---------------------------
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

// 데이터에 따른 아이콘 구별
const dayIconStatus = {};
Object.entries(quizStatusByDate).forEach(([date, data]) => {
    if (!data.isAnswered) {
        dayIconStatus[date] = "default";
    } else if (data.isCorrect) {
        dayIconStatus[date] = "correct";
    } else {
        dayIconStatus[date] = "wrong";
    }
});
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

//--------------------------- 캘린더 불러오기------------------------------------
window.addEventListener("DOMContentLoaded", async () => {

    //-----------------top/bottom nav-bar 불러오기------------------------
    await loadNavbar(".home-container");

    //-----------------캘린더 불러오기--------------------------------
    const daysTag = document.querySelector(".days"),
        currentDate = document.querySelector(".current-date"),
        prevNextIcon = document.querySelectorAll(".icons button");

    // 오늘 날짜 기준 초기화
    let date = new Date(),
        currYear = date.getFullYear(),
        currMonth = date.getMonth();

    // 월 이름 배열 (1~12)
    const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

    const renderCalendar = () => {
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
<<<<<<< HEAD
                 <li class="${isToday}">
=======
                 <li class="${isToday}" data-date="${dateKey}">
>>>>>>> e92136952f1b97db34242fb1f42ae62e55c12e2c
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

    renderCalendar();

    // 이전/다음 버튼 클릭 시 달 변경
    prevNextIcon.forEach((icon) => {
        icon.addEventListener("click", () => {
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

            if (currMonth < 0 || currMonth > 11) {
                date = new Date(currYear, currMonth, new Date().getDate());
                currYear = date.getFullYear();
                currMonth = date.getMonth();
            } else {
                date = new Date(); // 현재 날짜 유지
            }

            renderCalendar();
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
const dummyRankingData = [
    { rank: 1, name: "성신여자대학교", score: 10345 },
    { rank: 2, name: "경기대학교 서울캠퍼스", score: 8386 },
    { rank: 3, name: "한국외국어대학교", score: 7034 },
    { rank: 4, name: "세종대학교", score: 5800 },
    { rank: 10, name: "동덕여자대학교", score: 957 }
];

const myUniversity = "동덕여자대학교"; // 사용자 학교명

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

    //1. 데이터 정리
    //1.1  점수 내림차순 정렬 : 이름 오른차순(가나다순)
    const sorted = [...dummyRankingData].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.name.localeCompare(b.name);
    })

    //1.2 등수 매기기(동점자 처리- 동점자도 가나순에서 다시 순위 매김)
    let rank = 1;
    let lastScore = null;
    sorted.forEach((item, idx) => {
        if (item.score !== lastScore) {
            rank = idx + 1;
        }
        item.rank = rank;
        lastScore = item.score;
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
        const toAdd = group.slice(0, 3 - topList.length); // 최대 3명
        topList.push(...toAdd);
    }

    // 2. 내 대학교가 top3에 포함되어 있는지 체크
    const isMyUnivInTop = topList.some(item => item.name === myUniversity);

    // 3. top3 카드 렌더링
    topList.forEach(item => {
        const isMyUniv = item.name === myUniversity;
        const icon = isMyUniv
            ? priorityIcons[4] // 내 대학교이면 별도 아이콘
            : priorityIcons[item.rank];

        const card = document.createElement("div");
        card.className = `ranking-card rank-bg-${item.rank <= 3 ? item.rank : 'etc'}`;
        card.innerHTML = `
      <div class="prior-icon"><img src="${icon}" class="priority-icon" alt="${item.rank}위"></div>
      <span class="ranking-univ-name">${item.name}</span>
      <span class="ranking-point">${item.score.toLocaleString()}그루</span>
    `;
        topContainer.appendChild(card);
    });

    // 4. 내 대학교가 top3에 없으면 따로 표시
    if (!isMyUnivInTop) {
        const myUniv = sorted.find(item => item.name === myUniversity);
        if (myUniv) {
            myContainer.innerHTML = `
        <div class="ranking-item my-rank">
        <div class="prior-icon">
            <img src="${priorityIcons[4]}" class="priority-icon" alt="내 대학">
            <div class="my-univ-ranking-round">
                <span class="my-univ-ranking-num"> ${myUniv.rank}</span>
            </div>
         </div>

          <span class="ranking-univ-name">${myUniv.name}</span>
          <span class="ranking-point">${myUniv.score.toLocaleString()}그루</span>
        </div>
      `;
        }
    }
}

// 모달 외부 클릭 시 닫기
document.querySelector(".modal-overlay").addEventListener("click", (e) => {
    const modal = document.querySelector(".modal");
    if (!modal.contains(e.target)) {
        closeModal();
    }
});

//일별 클릭시 퀴즈 현황 모달창을 위한 함수
function openQuizModal(date) {
    const quiz = quizHistory.find(q => q.date === date);
    const overlay = document.querySelector(".modal-overlay");
    const modal = document.querySelector(".modal");

    if (!quiz) {
        modal.innerHTML = `
      <div class="modal-question"><p>${date}에는 퀴즈 기록이 없습니다.</p></div>
      <div class="modal-buttons">
        <button class="cancel-btn">닫기</button>
      </div>
    `;
        overlay.classList.remove("hidden");
        modal.classList.remove("hidden");
        const cancelBtn = modal.querySelector(".cancel-btn");
        if (cancelBtn) {
            cancelBtn.addEventListener("click", closeModal);
        }

        return;
    }

    const d = new Date(date);
    const formatted = `${d.getMonth() + 1}월 ${d.getDate()}일`;
    const weekday = d.getDay();
    const categoryMap = [
        "사회인식/트렌드", "소비습관", "식생활", "이동 수단", "캠퍼스 생활", "디지털 습관", "재사용/재활용"
    ];

    // 모달 내용 전체 재구성
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
    <div class="modal-question">
      <p>Q. ${quiz.question}</p>
    </div>
    <div class="modal-answer">
      <p>A. ${quiz.description}</p>
    </div>
    <div class="description-line"></div>
    <div class="recommend-activity-icon">
      <img src="../static/images/quiz/recommend-icon.png" class="priority-icon" alt="추천활동" />
    </div>
    <div class="recommend-activity">
      <p>${quiz.recommend_activity}</p>
    </div>
  `;

    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
    modal.querySelector(".cancel-btn").addEventListener("click", closeModal);
}


// 닫기 함수
function closeModal() {
    document.querySelector(".modal-overlay").classList.add("hidden"); //모달창 이외 공간 클릭시 닫기
    document.querySelector(".modal").classList.add("hidden"); //모달창 숨기기
}
