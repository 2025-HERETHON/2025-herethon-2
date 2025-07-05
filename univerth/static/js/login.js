//입력값 있을 시 입력칸 색상 변화
const id = document.querySelector('.id');
const password = document.querySelector('.password');

if(id){
    id.addEventListener('input',function(){
        if(id.value.trim() !== ""){
            id.style.border = "1px solid #2CD7A6";
        }
        else{
            id.style.border="";
        }
    });
}

if(password){
    password.addEventListener('input',function(){
        if(password.value.trim() !== ""){
            password.style.border = "1px solid #2CD7A6";
        }
        else{
            password.style.border="";
        }
    });
}

//아이디, 비밀번호 입력칸에 입력값 있을 시에 로그인 버튼 색상 변화
const login_btn=document.querySelector('.login_btn');
function checkInputs() {
    if(id.value.trim() !=='' && password.value.trim() !==''){
        login_btn.style.backgroundColor = "#2CD7A6";
    }
    else{
        login_btn.style.backgroundColor = "";
    }
}

[id, password].forEach(input => {
    input.addEventListener('input', checkInputs);
});