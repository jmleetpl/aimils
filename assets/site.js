(function () {
  var doc = document.documentElement;

  // Language: English by default, Korean on request (remembered).
  function setLang(lang) {
    doc.setAttribute('data-lang', lang);
    doc.lang = lang;
    try { localStorage.setItem('aimils-lang', lang); } catch (e) {}
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === lang));
    });
  }
  document.querySelectorAll('[data-set-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-set-lang')); });
  });
  setLang(doc.getAttribute('data-lang') || 'en');

  // Phone menu
  var nav = document.getElementById('access');
  var toggle = nav && nav.querySelector('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('#menu a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); });
    });
  }

  // Hero slider
  var slider = document.querySelector('.slider');
  if (slider) {
    var slides = slider.querySelectorAll('.slide');
    var dots = slider.querySelectorAll('.dot');
    var i = 0, timer;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', String(k !== i)); });
      dots.forEach(function (d, k) { d.classList.toggle('is-active', k === i); });
    }
    function play() { if (reduce) return; clearInterval(timer); timer = setInterval(function () { show(i + 1); }, 6000); }
    slider.querySelector('.slider-prev').addEventListener('click', function () { show(i - 1); play(); });
    slider.querySelector('.slider-next').addEventListener('click', function () { show(i + 1); play(); });
    dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k); play(); }); });
    slider.addEventListener('mouseenter', function () { clearInterval(timer); });
    slider.addEventListener('mouseleave', play);
    play();
  }
})();

// Publications filter (theme or member); ?m=<Korean name> preselects a member.
(function () {
  var list = document.querySelector('.pub-list');
  if (!list) return;
  var btns = Array.prototype.slice.call(document.querySelectorAll('.chip-btn'));
  function apply(f) {
    btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-f') === f)); });
    Array.prototype.forEach.call(list.children, function (li) {
      var ok = !f || (f.indexOf('t:') === 0 ? li.getAttribute('data-t') === f.slice(2) : ('|' + li.getAttribute('data-m') + '|').indexOf('|' + f.slice(2) + '|') > -1);
      li.hidden = !ok;
    });
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-f')); }); });
  var m = new URLSearchParams(location.search).get('m');
  if (m) apply('m:' + m);
})();
