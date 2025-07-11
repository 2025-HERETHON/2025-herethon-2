export function loadNavbar(containerSelector = ".home-container") {
  const homeImg = document.querySelector("#nav-home img");
  const quizImg = document.querySelector("#nav-quiz img");
  const mapImg = document.querySelector("#nav-map img");
  const challengeImg = document.querySelector("#nav-challenge img");
  const logoImg = document.querySelector(".logo-img");

  if (homeImg) homeImg.src = "../static/images/navbar/home_basic.png";
  if (quizImg) quizImg.src = "../static/images/navbar/quiz_basic.png";
  if (mapImg) mapImg.src = "../static/images/navbar/map_basic.png";
  if (challengeImg) challengeImg.src = "../static/images/navbar/challenge_basic.png";

  switch (containerSelector) {
    case ".home-container":
      if (homeImg) homeImg.src = "../static/images/navbar/home_select.png";
      break;

    case ".quiz-container":
      if (quizImg) quizImg.src = "../static/images/navbar/quiz_select.png";
      break;

    case ".map-container":
      if (mapImg) mapImg.src = "../static/images/navbar/map_select.png";
      const header = document.querySelector(".header-nav");
      if (header) header.style.display = "none";
      break;
    case ".map-container2":
      if (mapImg) mapImg.src = "../static/images/navbar/map_select.png";
      break;

    case ".challenge-container":
      if (challengeImg) challengeImg.src = "../static/images/navbar/challenge_select.png";
      break;

    case ".mypage-container":
      if (logoImg) logoImg.style.transform = "translateX(30px)";
      break;
  }

}
