document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach(button => {
    button.addEventListener("click", function () {
      const url = button.dataset.url;
      if (url) {
        window.location.href = url;
      }
    });
  });
});