import { loadNavbar } from "./main.js";
const before = document.referrer;

window.addEventListener("DOMContentLoaded", async () => {
    // navbar 불러오기
    loadNavbar(".challenge-container");
});

document.addEventListener('DOMContentLoaded', () => {
  const backBtn = document.querySelector('.back');
  // 뒤로 가기 버튼 클릭 시
  backBtn.addEventListener('click', () => {
    // Django 프로젝트의 URL에 맞게 수정해주세요.
    // 예: window.location.href = '/map/';
        window.location.href = '/challenges/popular'; 
  });
});

const textarea1 = document.getElementById("name");
textarea1.addEventListener("input", () => {
    if (textarea1.value.trim() !== "") {
    textarea1.classList.add("active");
    } else {
    textarea1.classList.remove("active");
    }
});

// const textarea2 = document.getElementById("creater_name");
// textarea2.addEventListener("input", () => {
//     if (textarea2.value.trim() !== "") {
//     textarea2.classList.add("active");
//     } else {
//     textarea2.classList.remove("active");
//     }
// });

const textarea3 = document.getElementById("challenge_detail");
textarea3.addEventListener("input", () => {
    if (textarea3.value.trim() !== "") {
    textarea3.classList.add("active");
    } else {
    textarea3.classList.remove("active");
    }
});

const inputs = [
    document.getElementById("name"),
    //document.getElementById("creater_name"),
    document.getElementById("challenge_detail")
];
const addGroupbtn = document.getElementById("add_group");

function checkInputs() {
    const allFilled = inputs.every(input => input.value.trim() !== "");
    addGroupbtn.disabled = !allFilled;

    if (allFilled) {
    addGroupbtn.classList.add("enabled");
    addGroupbtn.classList.remove("disabled");
    } else {
    addGroupbtn.classList.add("disabled");
    addGroupbtn.classList.remove("enabled");
    }
}

inputs.forEach(input => {
    input.addEventListener("input", () => {
        checkInputs();
    });
});