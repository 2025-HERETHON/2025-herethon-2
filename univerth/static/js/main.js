/*----공통------*/

//상단/하단 nav-bar
export async function loadNavbar(containerSelector = ".home-container") {
  try {
    const res = await fetch("../templates/navbar.html");
    const html = await res.text();
    document.querySelector(containerSelector).insertAdjacentHTML("afterbegin", html);
  } catch (err) {
    console.error("Navbar 로드 실패:", err);
  }
}


