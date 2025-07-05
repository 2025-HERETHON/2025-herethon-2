// 입력값이 있을 시 이메일 입력칸 색상 변화와 인증 하기 버튼 클릭시 인증 번호 입력칸 생성, 색상 변화
const email = document.querySelector('.email');
const certify_btn=document.querySelector('.certify_btn');

if(email) { 
  email.addEventListener('input', function() {
    if(email.value.trim() !== "") {
      email.style.border = "1px solid #2CD7A6";
      const input_vertification=document.querySelector('.input_vertification');
      certify_btn.addEventListener('click',function(){
      input_vertification.style.display="block";
      certify_btn.style.color="#2CD7A6";
      certify_btn.textContent="재전송";
      certify_btn.style.padding="0 23px";
    });
    } else {
      email.style.border = "";
      certify_btn.addEventListener('click',function(){
        certify_btn.style.color="";
      })
    }
  });
}

const vertifycation_num=document.querySelector('.vertifycation_num')
vertifycation_num.addEventListener("input",function(){
  if(vertifycation_num.value.trim() !== ''){
    vertifycation_num.style.border = "1px solid #2CD7A6";
  }
  else{
    vertifycation_num.style.border = "";
  }
})

//이메일, 인증번호 입력칸에 입력값 있을 시에 인증 완료 버튼 색상 변화
const step_btn=document.querySelector('.step_btn');
function checkInputs() {
    if(email.value.trim() !=='' && vertifycation_num.value.trim() !==''){
        step_btn.style.backgroundColor = "#2CD7A6";
    }
    else{
        step_btn.style.backgroundColor = "";
    }
}

[email, vertifycation_num].forEach(input => {
    input.addEventListener('input', checkInputs);
});

// 이메일과 인증번호 입력 시 인증 완료 버튼 클릭하면 Account03 페이지로 이동
const num=document.querySelector('.num');
step_btn.addEventListener('click', function() {
    if (email.value.trim() !== "" && num.value.trim() !== "") {
        window.location.href = "Account03.html";
    } else {
        alert("이메일과 인증번호를 모두 입력하세요.");
    }
});

//인증 번호 타이머

let time = 150;
const timeDiv = document.querySelector('.time');
timeDiv.textContent = "2:30";

const timer = setInterval(() => {
  const min = Math.floor(time / 60);
  const sec = String(time % 60).padStart(2, "0");
  timeDiv.textContent = `${min}:${sec}`;
  if (--time < 0) {
    clearInterval(timer);
  }
}, 1000);
