import { loadNavbar } from "./main.js";

window.addEventListener("DOMContentLoaded", async () => {
    // navbar 불러오기
    loadNavbar(".challenge-container");
});

let selectedId = null; 

function openModal(btnElement, challengeId) {
    const card = btnElement.closest('.card');
    selectedId = challengeId;
    const selectedName = card.dataset.name;
    document.getElementById('choutmodal').style.display = 'block';
    document.getElementById("modal-challenge-name").textContent = selectedName;
    const buttons = document.querySelectorAll(".btn_add");
    buttons.forEach(btn => {
        btn.disabled = true;
    });
    const btn = document.getElementById("confirmExitBtn");
    btn.onclick = function() {
        window.location.href = `/challenges/exit-challenge/${selectedId}/`;
    };
}

function closeModal() {
    document.getElementById('choutmodal').style.display = 'none';

    const buttons = document.querySelectorAll(".btn_add");
    buttons.forEach(btn => {
        btn.disabled = false
    });
}

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        const id = card.dataset.id;
        window.location.href = `/challenges/challenge-detail/${id}/`;
    });
})

// "탈퇴하기" 버튼 클릭 시 카드 클릭 이벤트 막기
document.querySelectorAll('.outbtntext').forEach(btn => {
    btn.addEventListener('click', (event) => {
        event.stopPropagation();
        const challengeId = btn.closest('.card').dataset.id;
        openModal(challengeId);
    });
});

// const joining_challenges = [
// 	{
// 		"name" : "캠퍼스 내 플로깅",
// 		"participant_num": 100,
// 		"creator_name" : "솜솜이"
// 	},
// 	{
// 		"name" : "하루 만 보 걷기",
// 		"participant_num": 200,
// 		"creator_name" : "수정이"
// 	}
// ];

// function renderCards(data) {
//     const container = document.getElementById("joining_challenges");
//     container.innerHTML = "";

// data.forEach(challenge => {
//     const card = document.createElement("div");
//     card.className = "card";

//     card.innerHTML = `
//         <div class="card-top">
//             <h3 class="card-title">${challenge.name}</h3>
//             <div class="pn">
//                 <div><img class="img1" src="/static/images/challenges/img1.svg" /></div>
//                 <div class="card-pn">${challenge.participant_num}</div>
//             </div>
//         </div>
//         <div class="cn">
//             <div><img class="img2" src="/static/images/challenges/img2.svg" /></div>
//             <p class="card-cn">${challenge.creator_name}</p>
//         </div>
//         <div class="outbtn">
//             <div class="outbtntext" id="outbtntext" onClick="openModal()">탈퇴하기</div>
//         </div>
//     `;

//     container.appendChild(card);
//     });

//     document.getElementById("card-count").textContent = `그룹 ${data.length}개`;
// }

// renderCards(joining_challenges);
