/**
 * Gilbert B Hammer Photography — gallery lightbox
 * Wires up click-to-enlarge for every real photo inside a .stagger-grid
 * section. Placeholder tiles (no <img>) are ignored automatically.
 */
(function () {
  var imgs = Array.from(document.querySelectorAll('.stagger-grid img'));
  if (!imgs.length) return;

  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCount = document.getElementById('lightboxCount');
  var closeBtn = document.getElementById('lightboxClose');
  var prevBtn = document.getElementById('lightboxPrev');
  var nextBtn = document.getElementById('lightboxNext');
  var current = 0;

  function show() {
    var img = imgs[current];
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    lightboxCount.textContent = (current + 1) + ' / ' + imgs.length;
  }

  function open(index) {
    current = index;
    show();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function next() { current = (current + 1) % imgs.length; show(); }
  function prev() { current = (current - 1 + imgs.length) % imgs.length; show(); }

  imgs.forEach(function (img, i) {
    img.addEventListener('click', function () { open(i); });
  });

  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // Clicking the enlarged photo itself (not the nav arrows) closes the lightbox.
  lightboxImg.addEventListener('click', function (e) {
    e.stopPropagation();
    close();
  });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  if (imgs.length < 2) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }
})();
