/**
 * Gilbert B Hammer Photography — mobile nav toggle
 * Shows/hides the nav-links panel behind the hamburger button below the
 * 760px breakpoint. No-ops harmlessly if the markup isn't present.
 */
(function () {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  function closeMenu() {
    links.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    links.classList.add('is-open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', function () {
    if (links.classList.contains('is-open')) closeMenu();
    else openMenu();
  });

  Array.from(links.querySelectorAll('a')).forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 760) closeMenu();
  });
})();
