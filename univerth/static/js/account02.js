document.addEventListener('DOMContentLoaded', function() {
    // CSRF 토큰을 쿠키에서 꺼내는 함수
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

    const emailInput = document.querySelector('.email');
    const certifyBtn = document.querySelector('.certify_btn');
    const stepBtn = document.querySelector('.step_btn');
    const errorDiv = document.querySelector('.error');
    const errorMsg = document.querySelector('.error_msg');
    const timeDiv = document.querySelector('.time');

    let timerInterval = null;
    let emailCertified = false; // 인증 메일 발송 성공 여부

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function updateStepBtnState() {
        if (emailInput.value.trim() !== '') {
            stepBtn.disabled = false;
            stepBtn.style.backgroundColor = "#2CD7A6";
            emailInput.style.border = "1.5px solid #2CD7A6";
        } else {
            stepBtn.disabled = true;
            stepBtn.style.backgroundColor = "#9E9E9E";
            emailInput.style.border = "1.5px solid #9E9E9E";
        }
    }

    updateStepBtnState();

    emailInput.addEventListener('input', function() {
        errorDiv.style.display = 'none';
        updateStepBtnState();
        emailCertified = false; // 입력값이 바뀌면 다시 인증 필요
    });

    certifyBtn.addEventListener('click', function() {
        certifyBtn.style.color = '#2CD7A6';
        const email = emailInput.value.trim();
        errorDiv.style.display = 'none';

        if (email === '') {
            showError('이메일 주소는 필수 항목입니다.');
            return;
        }
        if (!isValidEmail(email)) {
            showError('올바른 이메일 형식이 아닙니다.');
            return;
        }

        fetch('/signup/step2/', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: `email=${encodeURIComponent(email)}`
        })
        .then(async response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                if (data.message) {
                    showInfo(data.message); // "인증 메일을 발송하였습니다."
                    startTimer(2, 30);
                    emailCertified = true; // 인증 메일 발송 성공
                } else if (data.error) {
                    showError(data.error);
                    stopTimer();
                    emailCertified = false;
                }
            } else {
                showError('서버에서 올바른 응답을 받지 못했습니다.');
                stopTimer();
                emailCertified = false;
            }
        })
        .catch(() => {
            showError('서버와 통신 중 오류가 발생했습니다.');
            stopTimer();
            emailCertified = false;
        });
    });

    stepBtn.addEventListener('click', function() {
        errorDiv.style.display = 'none';
        const email = emailInput.value.trim();

        if (email === '') {
            showError('이메일 주소를 입력하세요.');
            return;
        }
        if (!isValidEmail(email)) {
            showError('올바른 이메일 형식이 아닙니다.');
            return;
        }
        if (!emailCertified) {
            showError('이메일 인증 메일을 먼저 받아주세요.');
            return;
        }

        fetch('/check-verification/', {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(async response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                if (data.redirect_url) {
                    window.location.href = data.redirect_url;
                } else if (data.error) {
                    errorMsg.textContent = data.error;
                    errorDiv.style.display = 'flex';
                    setTimeout(() => {
                        errorDiv.style.display = 'none';
                    }, 3000);
                } else {
                    errorMsg.textContent = '알 수 없는 응답입니다.';
                    errorDiv.style.display = 'flex';
                    setTimeout(() => {
                        errorDiv.style.display = 'none';
                    }, 3000);
                }
            } else {
                const html = await response.text();
                document.open();
                document.write(html);
                document.close();
            }
        })
        .catch(() => {
            errorMsg.textContent = '서버 오류가 발생했습니다. 다시 시도해주세요.';
            errorDiv.style.display = 'flex';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        });
    });

    // 타이머, showError, showInfo
    function startTimer(min, sec) {
        stopTimer();
        let totalSeconds = min * 60 + sec;
        updateTimeDisplay(totalSeconds);

        timerInterval = setInterval(function() {
            totalSeconds--;
            updateTimeDisplay(totalSeconds);

            if (totalSeconds <= 0) {
                stopTimer();
                timeDiv.textContent = '';
            }
        }, 1000);
    }
    function stopTimer() {
        if (timerInterval) clearInterval(timerInterval);
    }
    function updateTimeDisplay(totalSeconds) {
        let m = Math.floor(totalSeconds / 60);
        let s = totalSeconds % 60;
        timeDiv.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
    }
    function showError(msg) {
        errorDiv.style.display = 'flex';
        errorMsg.textContent = msg;
        errorMsg.style.color = '#FD7565';
    }
    function showInfo(msg) {
        errorDiv.style.display = 'flex';
        errorMsg.textContent = msg;
        errorMsg.style.color = '#2CD7A6';
    }
});
