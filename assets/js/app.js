/* ============================================================================
   IMA GROUP -- app.js (vanilla, no-npm)
   image guard · reveal engine · FAQ · nav burger · form WhatsApp
   ============================================================================ */
(function () {
  'use strict';

  /* ---- 1. IMAGE GUARD : aucune image cassee -> placeholder de marque ---- */
  var PLACEHOLDER =
    'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1200" y2="800" gradientUnits="userSpaceOnUse">' +
      '<stop offset="0" stop-color="#11103A"/><stop offset="1" stop-color="#1a1960"/></linearGradient></defs>' +
      '<rect width="1200" height="800" fill="url(#g)"/>' +
      '<rect x="560" y="340" width="80" height="4" fill="#F2A900" opacity="0.8"/>' +
      '<text x="600" y="420" fill="#ffffff" font-family="Inter,Arial" font-size="28" font-weight="700" ' +
      'text-anchor="middle" opacity="0.7">IMA GROUP</text>' +
      '<text x="600" y="450" fill="#F2A900" font-family="Inter,Arial" font-size="13" font-weight="500" ' +
      'text-anchor="middle" opacity="0.6">Cabinet de conseil international</text></svg>'
    );

  function guard(img) {
    if (img.dataset.guarded) return;
    img.dataset.guarded = '1';
    img.addEventListener('error', function () {
      if (img.src !== PLACEHOLDER) img.src = PLACEHOLDER;
    });
    if (img.complete && img.naturalWidth === 0) img.src = PLACEHOLDER;
  }
  document.querySelectorAll('img').forEach(guard);

  /* ---- 2. NAV : burger mobile ---- */
  var burger = document.querySelector('.nav-burger');
  var links  = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      links.classList.toggle('open');
      burger.setAttribute('aria-expanded', links.classList.contains('open') ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* ---- 2b. NAV : menu deroulant "Pages" ---- */
  document.querySelectorAll('.nav-dd-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var dd = btn.closest('.nav-dd');
      var open = dd.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.nav-dd.open').forEach(function (dd) {
      if (!dd.contains(e.target)) {
        dd.classList.remove('open');
        var b = dd.querySelector('.nav-dd-toggle');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---- 3. FAQ accordeon (un seul ouvert a la fois) ---- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---- 4. FORMULAIRE -> WhatsApp pre-rempli + etat succes ---- */
  window.imaSubmit = function (e) {
    e.preventDefault();
    var f    = e.target;
    var name = (f.querySelector('[name="name"]') || {}).value || '';
    var contact = (f.querySelector('[name="contact"]') || {}).value || '';
    var msg  = (f.querySelector('[name="message"]') || {}).value || '';
    name = name.trim(); contact = contact.trim();
    if (!name) return false;
    var wa  = f.getAttribute('data-whatsapp') || '';
    var txt = encodeURIComponent(
      'Bonjour IMA GROUP, je suis ' + name +
      (contact ? ' (' + contact + ')' : '') + '. ' +
      (msg.trim() || 'Je souhaite prendre contact pour un accompagnement.')
    );
    if (wa) { try { window.open('https://wa.me/' + wa + '?text=' + txt, '_blank'); } catch (_) {} }
    f.style.display = 'none';
    var ok = f.parentElement.querySelector('.form-success');
    if (ok) ok.style.display = 'block';
    return false;
  };

  /* ---- 5. MOTEUR REVEAL + PARALLAX hero (progressive enhancement) ---- */
  function run() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!window.gsap || reduce) return;
    var hasST = !!window.ScrollTrigger;
    if (hasST) gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('[data-reveal]').filter(function (el) {
      return !el.closest('.nav');
    }).forEach(function (el) {
      gsap.from(el, {
        opacity: 0, y: 30, duration: .85, ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: hasST ? { trigger: el, start: 'top 92%', once: true } : undefined
      });
    });

    /* parallax subtil sur le fond du hero */
    var heroBg = document.querySelector('.hero-bg');
    if (hasST && heroBg) {
      gsap.fromTo(heroBg, { yPercent: -4 }, {
        yPercent: 4, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    if (hasST) {
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
      ScrollTrigger.refresh();
    }

    /* filet de securite : force l'affichage si opacity reste a 0 */
    setTimeout(function () {
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        if (parseFloat(getComputedStyle(el).opacity) === 0) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
    }, 2500);
  }

  document.readyState !== 'loading' ? run() : document.addEventListener('DOMContentLoaded', run);
})();
