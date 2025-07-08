const challenges = [
    {
        "challenge_name": "캠퍼스 내 플로깅",
        "participant_num": 200,
        "description": "'캠퍼스 내 플로깅'은 학교 건물을 중심으로 바닥에 떨어진 쓰레기를 주워버리는 활동입니다. 학우들과 함께 즐기면서 환경을 지켜보아요!"
    },
];

function renderChallenges(data) {
    const container = document.getElementById("challenges");
    container.innerHTML = "";

data.forEach(challenge => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <div class="card-top">
            <h3 class="card-title">${challenge.challenge_name}</h3>
            <div class="pn">
                <div><img class="img1" src="../static/images/challenges/img1.svg" /></div>
                <div class="card-pn">${challenge.participant_num}</div>
            </div>
        </div>
        <div class="dsc">
            <p class="card-dsc">${challenge.description}</p>
        </div>
    `;

    container.appendChild(card);
    });
}

renderChallenges(challenges);

//모달 제어
function openModal() {
    document.getElementById('chjoinmodal').style.display = 'block';
}

function closeModal() {
    document.getElementById('chjoinmodal').style.display = 'none';
}

//가입하기 버튼 클릭 시 글쓰기 버튼으로 전환
function convertWrite() {
    closeModal();

    const btnText = document.getElementById("jointext");
    btnText.innerText = "글쓰기";

    const actionBtn = document.getElementById("joinbtn");
    actionBtn.onclick = function() {
        location.href = 'univerth/templates/create_feed.html';
    };
}

