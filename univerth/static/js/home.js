//--------------------------- 캘린더 불러오기------------------------------------
window.addEventListener("DOMContentLoaded", async () => {

    //-----------------header-nav-bar 불러오기------------------------
    const navRes = await fetch("../templates/navbar.html");
    const navHtml = await navRes.text();
    document.querySelector(".home-container").insertAdjacentHTML("afterbegin", navHtml);    //-----------------bottom-nav-bar 불러오기------------------------
    //----------------bottom-nav-bar 불러오기-----------------------
    document.querySelector(".home-container").insertAdjacentHTML("beforeend", navHtml);

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

        // 지난달의 마지막 날짜
        let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

        let liTag = "";

        // 지난달 날짜 채우기
        for (let i = firstDayofMonth; i > 0; i--) {
            liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
        }

        // 이번 달 날짜 채우기
        for (let i = 1; i <= lastDateofMonth; i++) {
            const today = new Date();
            const dateKey = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

            let isToday =
                i === today.getDate() &&
                    currMonth === today.getMonth() &&
                    currYear === today.getFullYear()
                    ? "active"
                    : "";

            let iconType = dayIconStatus[dateKey] || "default";

            let iconPath = {
                correct: "../static/images/home/day_correct.png",
                wrong: "../static/images/home/day_wrong.png",
                default: "../static/images/home/day_default.png"
            }[iconType];

            liTag += `
      <li class="${isToday}">
        ${i}
        <img src="${iconPath}" alt="${iconType}" class="calendar-icon" />
      </li>`;
        }

        // 다음달 날짜로 나머지 칸 채우기 (총 42칸으로 맞추기)
        let totalFilled = firstDayofMonth + lastDateofMonth;
        let nextDays = 42 - totalFilled;
        for (let i = 1; i <= nextDays; i++) {
            liTag += `<li class="inactive">${i}</li>`;
        }

        // 상단 현재 연/월 텍스트 표시
        currentDate.innerText = `${currYear}년 ${months[currMonth]}월`;

        // 캘린더에 날짜 삽입
        daysTag.innerHTML = liTag;
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
//캘린더 아이콘 표시를 위한 더미 데이터
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
