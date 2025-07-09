/*----공통------*/

//상단/하단 nav-bar
export function loadNavbar(containerSelector = ".home-container") {

  // 모든 탭 아이콘을 기본 이미지로 되돌리기
  document.querySelector("#nav-home img").src = "../static/images/navbar/home_basic.png";
  document.querySelector("#nav-quiz img").src = "../static/images/navbar/quiz_basic.png";
  document.querySelector("#nav-map img").src = "../static/images/navbar/map_basic.png";
  document.querySelector("#nav-challenge img").src = "../static/images/navbar/challenge_basic.png";

  switch (containerSelector) {
    case ".home-container":
      document.querySelector("#nav-home img").src = "../static/images/navbar/home_select.png";
      break;
    case ".quiz-container":
      document.querySelector("#nav-quiz img").src = "../static/images/navbar/quiz_select.png";
      break;
    /*case ".map-container":
      document.querySelector("#nav-map img").src = "../static/images/navbar/map_select.png";
      break;
    case ".challenge-container":
      document.querySelector("#nav-challenge img").src = "../static/images/navbar/challenge_select.png";
      break;*/
    case ".mypage-container":
      document.querySelector(".logo-img").style.transform = "translateX(30px)";
  }
}
