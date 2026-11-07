/* Mobile sidebar navigation: replaces Webflow's dropdown menu below 992px. */
(function () {
  var BREAKPOINT = 991;
  var PHONE = '+918317445439';

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html) n.innerHTML = html;
    return n;
  }

  function build() {
    var overlay = el('div', 'msb-overlay');
    var side = el('aside', 'msb');
    side.id = 'mobile-sidebar';
    side.setAttribute('aria-label', 'Site navigation');
    side.setAttribute('aria-hidden', 'true');
    side.setAttribute('role', 'dialog');
    side.setAttribute('aria-modal', 'true');

    // Header: logo + close
    var head = el('div', 'msb-head');
    var brand = document.querySelector('.w-nav-brand img');
    if (brand) {
      var a = el('a', 'msb-logo');
      a.href = 'index.html';
      var img = brand.cloneNode();
      img.removeAttribute('loading');
      a.appendChild(img);
      head.appendChild(a);
    }
    var close = el('button', 'msb-close', '<span></span><span></span>');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close menu');
    head.appendChild(close);
    side.appendChild(head);

    // Page links from the main nav
    var nav = el('nav', 'msb-nav');
    document.querySelectorAll('.w-nav-menu a').forEach(function (src) {
      var a = el('a', 'msb-link');
      a.href = src.getAttribute('href');
      a.textContent = src.textContent.trim();
      if (src.classList.contains('w--current')) {
        a.classList.add('is-current');
        a.setAttribute('aria-current', 'page');
      }
      nav.appendChild(a);
    });
    side.appendChild(nav);

    // In-page section shortcuts (home page bar under the hero)
    var sections = document.querySelectorAll('.home-two-about-link-wrapper a');
    if (sections.length) {
      side.appendChild(el('div', 'msb-label', 'On this page'));
      var chips = el('div', 'msb-chips');
      sections.forEach(function (src) {
        var a = el('a', 'msb-chip');
        a.href = src.getAttribute('href');
        a.textContent = src.textContent.trim();
        chips.appendChild(a);
      });
      side.appendChild(chips);
    }

    // Contact actions + socials
    var foot = el('div', 'msb-foot');
    foot.innerHTML =
      '<a class="msb-cta msb-cta-call" href="tel:' + PHONE + '">Call +91 83174 45439</a>' +
      '<a class="msb-cta msb-cta-wa" href="https://wa.me/918317445439" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>' +
      '<a class="msb-mail" href="mailto:sales@logitechelevators.com">sales@logitechelevators.com</a>';
    var social = document.querySelector('.footer-social');
    if (social) foot.appendChild(social.cloneNode(true));
    side.appendChild(foot);

    document.body.appendChild(overlay);
    document.body.appendChild(side);

    var lastFocus = null;
    function open() {
      lastFocus = document.activeElement;
      document.documentElement.classList.add('msb-open');
      side.setAttribute('aria-hidden', 'false');
      setTimeout(function () { close.focus(); }, 50);
    }
    function shut() {
      document.documentElement.classList.remove('msb-open');
      side.setAttribute('aria-hidden', 'true');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    // Intercept the Webflow hamburger before Webflow's own handler runs.
    document.addEventListener('click', function (e) {
      if (window.innerWidth > BREAKPOINT) return;
      if (!e.target.closest('.w-nav-button')) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      open();
    }, true);

    overlay.addEventListener('click', shut);
    close.addEventListener('click', shut);
    side.addEventListener('click', function (e) {
      if (e.target.closest('a')) shut();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.documentElement.classList.contains('msb-open')) shut();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > BREAKPOINT) shut();
    });

    // Make the hamburger announce itself properly
    document.querySelectorAll('.responsive-menu-button.w-nav-button').forEach(function (b) {
      b.setAttribute('aria-controls', 'mobile-sidebar');
      b.setAttribute('aria-label', 'Open menu');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
