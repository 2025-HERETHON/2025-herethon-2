// 입력값이 있을 시 입력칸 색상 변화
const user=document.querySelector('.user');
const id=document.querySelector('.id');
const password1=document.querySelector('.password1');
const password2=document.querySelector('.password2');
const certify_btn=document.querySelector('.certify_btn');
const info1 = document.querySelector('.info1');
const info2 = document.querySelector('.info2');

//닉네임 입력칸
if(user){
    user.addEventListener('input',function(){
        if(user.value.trim() !== ""){
            user.style.border = "1.5px solid #2CD7A6";
            if(user.value.trim().length == 1){
                user.style.border = "1.5px solid #FD7565";
                info1.textContent='*2자 이상 입력해주세요.'
                info1.style.color='#FD7565'
            }
            else{
                info1.textContent='*2자 이상'
                info1.style.color=''
            }
        }
        else{
            user.style.border="";
            info1.textContent='*2자 이상'
            info1.style.color=''
        }
    });
}

//아이디 입력칸
if(id) { 
  id.addEventListener('input', function() {
    if(id.value.trim() !== "") {
      id.style.border = "1px solid #2CD7A6";
      certify_btn.addEventListener('click',function(){
      certify_btn.style.color="#2CD7A6";
    });
    } else {
      id.style.border = "";
      certify_btn.addEventListener('click',function(){
        certify_btn.style.color="";
      })
    }
  });
}

//비밀번호1 입력칸
if(password1){
    password1.addEventListener('input', function(){
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

//비밀번호2 입력칸
const info3=document.querySelector('.info3')
if(password2){
    password2.addEventListener('input',function(){
        if(password2.value.trim() !== ""){
            password2.style.border = "1px solid #2CD7A6";
            if(password1.value !== password2.value){
                password2.style.border = "1.5px solid #FD7565";
                info3.textContent="*비밀번호가 일치하지 않습니다."
                info3.style.color = '#FD7565';
                info3.style.padding = '0px 5px';
                info3.style.position='absolute';
            }
            else{
                info3.textContent=" "   
            }
        }
        else{
            password2.style.border="";
        }
    });
}

//닉네임, 아이디, 비밀번호, 비밀번호 확인 입력 시 회원가입 완료 버튼 색상 변화
const step_btn=document.querySelector('.step_btn');
function checkInputs() {
    if(user.value.trim() !=='' && 
    id.value.trim() !=='' &&
    password1.value.trim() !=='' &&
    password2.value.trim() !==''){
        step_btn.style.backgroundColor = "#2CD7A6";
    }
    else{
        step_btn.style.backgroundColor = "";
    }
}

[user, id, password1, password2].forEach(input => {
    input.addEventListener('input', checkInputs);
});
