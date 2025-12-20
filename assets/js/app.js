(function () {
  'use strict';

  var docEl = document.documentElement;
  docEl.classList.remove('no-js');

  var navToggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = document.querySelectorAll('[data-reveal]');

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  var copyButtons = document.querySelectorAll('[data-copy-link]');
  copyButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var originalLabel = button.textContent;
      var target = button.getAttribute('data-copy-link');
      if (!target) return;

      function onSuccess() {
        button.textContent = 'Copied!';
        button.classList.add('is-success');
        setTimeout(function () {
          button.textContent = originalLabel;
          button.classList.remove('is-success');
        }, 2000);
      }

      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(target).then(onSuccess).catch(function () {});
      } else {
        var tempInput = document.createElement('input');
        tempInput.value = target;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          document.execCommand('copy');
          onSuccess();
        } catch (err) {
          console.warn('Copy failed', err);
        }
        document.body.removeChild(tempInput);
      }
    });
  });
})();
