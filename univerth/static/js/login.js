//입력값 있을 시 입력칸 색상 변화
const id = document.querySelector('.id');
const password = document.querySelector('.password');

if (id) {
    id.addEventListener('input', function () {
        if (id.value.trim() !== "") {
            id.style.border = "1px solid #2CD7A6";
        }
        else {
            id.style.border = "";
        }
    });
}

if (password) {
    password.addEventListener('input', function () {
        if (password.value.trim() !== "") {
            password.style.border = "1px solid #2CD7A6";
        }
        else {
            password.style.border = "";
        }
    });
}

//아이디, 비밀번호 입력칸에 입력값 있을 시에 로그인 버튼 색상 변화
const login_btn = document.querySelector('.login_btn');
function checkInputs() {
    if (id.value.trim() !== '' && password.value.trim() !== '') {
        login_btn.style.backgroundImage = "linear-gradient(180deg, #2CD7A6 0%, #59D385 100%)";
    }
    else {
        login_btn.style.backgroundColor = "";
    }
}

[id, password].forEach(input => {
    input.addEventListener('input', checkInputs);
});

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const csrfToken = formData.get('csrfmiddlewaretoken');

    try {
        const response = await fetch("/login/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken
            },
            body: formData
        });

        const data = await response.json();

        if (data.error) {
            const errorBox = document.querySelector('.error');
            errorBox.style.display = "flex";

            // 에러 발생 시 input 테두리 빨간색으로 변경
            id.style.border = "1.5px solid #FD7565";
            password.style.border = "1.5px solid #FD7565";
        } else if (data.message === "로그인 성공") {
            window.location.href = "/home/";
        }

    } catch (error) {
        alert("로그인 중 오류가 발생했습니다.");
    }
});