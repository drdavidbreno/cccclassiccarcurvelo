(() => {
  const navbar = document.querySelector(".navbar");

  if (!navbar) {
    return;
  }

  const updateNavbar = () => {
    navbar.classList.toggle("navbar-hidden", window.scrollY > 12);
  };

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });
})();
