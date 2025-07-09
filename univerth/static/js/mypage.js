import { loadNavbar } from "./main.js";

window.addEventListener("DOMContentLoaded", () => {
  // 1. Navbar 로드
  loadNavbar(".mypage-container");

  // 2. 초기 데이터 렌더링
  document.getElementById("user-info-nick").value = myPageData.nickname || "";
  document.getElementById("user-info-id").value = myPageData.username || "";
  document.getElementById("quiz-count").innerText = myPageData.quiz_num || "0";
  document.getElementById("feed-count").innerText = myPageData.feed_num || "0";
    const idShow = document.getElementById("user-info-id").value.trim();

  // 3. 닉네임 수정 이벤트
  document.getElementById("nick-correction").addEventListener("click", async () => {
    const nickname = document.getElementById("user-info-nick").value.trim();
    if (!nickname) return alert("닉네임을 입력해주세요.");

    try {
      const res = await fetch("/mypage/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": getCSRFToken(),
        },
        body: new URLSearchParams({ nickname }),
      });
      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("요청 중 문제가 발생했습니다.");
      console.error(err);
    }
  });
});

// CSRF 토큰 가져오기 함수
function getCSRFToken() {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="));
  return cookieValue ? cookieValue.split("=")[1] : "";
}
