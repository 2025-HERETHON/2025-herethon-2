// 입력값이 있을 시 입력칸 색상 변화
const user = document.querySelector('.user');
const id = document.querySelector('.id');
const password1 = document.querySelector('.password1');
const password2 = document.querySelector('.password2');
const certify_btn = document.querySelector('.certify_btn');
const info1 = document.querySelector('.info1');
const info2 = document.querySelector('.info2');

// 닉네임 입력칸
if (user) {
    user.addEventListener('input', function () {
        if (user.value.trim() !== "") {
            user.style.border = "1.5px solid #2CD7A6";
            if (user.value.trim().length == 1) {
                user.style.border = "1.5px solid #FD7565";
                info1.textContent = '*2자 이상 입력해주세요.';
                info1.style.color = '#FD7565';
            } else {
                info1.textContent = '*2자 이상';
                info1.style.color = '';
            }
        } else {
            user.style.border = "";
            info1.textContent = '*2자 이상';
            info1.style.color = '';
        }
    });
}

// 아이디 입력칸
if (id) {
    id.addEventListener('input', function () {
        if (id.value.trim() !== "") {
            id.style.border = "1px solid #2CD7A6";
        } else {
            id.style.border = "";
        }
    });
}

// 비밀번호1 입력칸
if (password1) {
    password1.addEventListener('input', function () {
        const value = password1.value.trim();
        const hasEnglish = /[a-zA-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-\\[\];'/+=~`]/.test(value);
        const isLongEnough = value.length >= 8;

        if (value !== "") {
            if (!(hasEnglish && hasNumber && hasSpecial && isLongEnough)) {
                password1.style.border = "1.5px solid #FD7565";
                info2.textContent = '*영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.';
                info2.style.color = '#FD7565';
            } else {
                password1.style.border = "1.5px solid #2CD7A6";
                info2.textContent = '*영문, 숫자, 특수문자 포함 8자 이상';
                info2.style.color = '';
            }
        } else {
            password1.style.border = "";
            info2.textContent = '*영문, 숫자, 특수문자 포함 8자 이상';
            info2.style.color = '';
        }
    });
}

// 비밀번호2 입력칸
const info3 = document.querySelector('.info3');
if (password2) {
    password2.addEventListener('input', function () {
        if (password2.value.trim() !== "") {
            password2.style.border = "1px solid #2CD7A6";
            if (password1.value !== password2.value) {
                password2.style.border = "1.5px solid #FD7565";
                info3.textContent = "*비밀번호가 일치하지 않습니다.";
                info3.style.color = '#FD7565';
                info3.style.padding = '0px 5px';
                info3.style.position = 'absolute';
            } else {
                info3.textContent = " ";
                info3.style.color = '';
            }
        } else {
            password2.style.border = "";
            info3.textContent = "";
            info3.style.color = '';
        }
    });
}



// 닉네임, 아이디, 비밀번호, 비밀번호 확인 입력 시 회원가입 완료 버튼 색상 변화
const step_btn = document.querySelector('.step_btn');
function checkInputs() {
    if (
        user.value.trim() !== '' &&
        id.value.trim() !== '' &&
        password1.value.trim() !== '' &&
        password2.value.trim() !== ''
    ) {
        step_btn.style.backgroundColor = "#2CD7A6";
    } else {
        step_btn.style.backgroundColor = "";
    }
}
[user, id, password1, password2].forEach(input => {
    input.addEventListener('input', checkInputs);
});

// 팝업 처리
const popup = document.querySelector('.popup');
const popup1 = document.querySelector('.popup1');
const popup2 = document.querySelector('.popup2');
if (popup1 && popup1.querySelector('button')) {
    popup1.querySelector('button').onclick = () => {
        popup.style.display = 'none';
        popup1.style.display = 'none';
    };
}
if (popup2 && popup2.querySelector('button')) {
    popup2.querySelector('button').onclick = () => {
        popup.style.display = 'none';
        popup2.style.display = 'none';
    };
}

// CSRF 토큰 가져오기 함수
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// 아이디 중복 확인 (GET 방식, /signup/username/)
certify_btn.addEventListener('click', function (e) {
    e.preventDefault();
    const username = id.value.trim();
    if (!username) {
        alert('아이디를 입력하세요.');
        return;
    }
    fetch(`/signup/username/?username=${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('서버 응답 오류');
        }
        return res.json();
    })
    .then(data => {
        popup.style.display = 'block';
        if (data.error) {
            popup2.style.display = 'flex';
        } else if (data.message) {
            popup1.style.display = 'flex';
        } else {
            alert('서버 응답 오류');
        }
    })
    .catch((err) => {
        alert('서버 오류가 발생했습니다.');
        console.error(err);
    });
});

// 회원가입 완료
step_btn.addEventListener('click', function () {
    const nickname = user.value.trim();
    const username = id.value.trim();
    const password1Val = password1.value;
    const password2Val = password2.value;

    // 프론트 1차 유효성 검사
    if (!nickname || nickname.length < 2) {
        alert('닉네임을 2자 이상 입력하세요.');
        return;
    }
    if (!username) {
        alert('아이디를 입력하세요.');
        return;
    }
    if (!password1Val || !password2Val) {
        alert('비밀번호를 입력하세요.');
        return;
    }
    if (password1Val !== password2Val) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    fetch(window.location.pathname, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: `nickname=${encodeURIComponent(nickname)}&username=${encodeURIComponent(username)}&password1=${encodeURIComponent(password1Val)}&password2=${encodeURIComponent(password2Val)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.signup_success) {
            alert('회원가입이 완료되었습니다!');
            window.location.href = '/login/';
        } else if (data.errors) {
            let msg = '';
            for (const field in data.errors) {
                msg += `${data.errors[field]}\n`;
            }
            alert(msg);
        }
    })
    .catch(() => {
        alert('서버 오류가 발생했습니다.');
    });
});
