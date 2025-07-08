document.addEventListener("DOMContentLoaded", function() {
  const login_btn = document.querySelector(".login_btn");
  if (login_btn) {
    login_btn.addEventListener("click", function() {
      window.location.href = login_btn.dataset.url;
    });
  }

  const account_btn = document.querySelector(".account_btn");
  if (account_btn) {
    account_btn.addEventListener("click", function() {
      window.location.href = account_btn.dataset.url;
    });
  }
});

