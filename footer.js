(function () {
  'use strict';

  var FOOTER_HTML =
    '<nav aria-label="NumberMobi 全站导航">' +
      '<a href="/">NumberMobi 首页</a>' +
      '<a href="/guides/">选号指南</a>' +
      '<a href="/purchase-guide/">购买说明</a>' +
      '<a href="https://openaa.com/" target="_blank" rel="noopener noreferrer">OpenAA</a>' +
    '</nav>' +
    '<p>© 2026 NumberMobi · 美国手机靓号</p>';

  function initBackToTop() {
    var button = document.querySelector('.nm-back-to-top');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'nm-back-to-top';
      button.setAttribute('aria-label', '回到顶部');
      button.setAttribute('title', '回到顶部');
      button.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 7-7 7 7M12 5v14"></path></svg>';
      document.body.appendChild(button);
    }
    if (button.getAttribute('data-nm-back-top-ready') === 'true') return;
    button.setAttribute('data-nm-back-top-ready', 'true');

    function updateVisibility() {
      button.classList.toggle('is-visible', (window.scrollY || document.documentElement.scrollTop || 0) > 900);
    }

    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('pageshow', updateVisibility);
    updateVisibility();

    button.addEventListener('click', function () {
      var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  function initNumberMobiFooter() {
    var footer = document.querySelector('footer');
    if (!footer) {
      var host = document.querySelector('.shell') || document.body;
      footer = document.createElement('footer');
      host.appendChild(footer);
    }

    footer.className = 'nm-site-footer';
    footer.setAttribute('aria-label', 'NumberMobi 全站页脚');
    footer.innerHTML = FOOTER_HTML;
    initBackToTop();

    if (!document.getElementById('nm-site-footer-styles')) {
      var style = document.createElement('style');
      style.id = 'nm-site-footer-styles';
      style.textContent =
        '.nm-site-footer{margin:28px auto 0;padding:18px 16px 16px;border-top:1px solid #dbe3ee;background:#fff;color:#64748b;text-align:center;font-size:13px;line-height:1.6}' +
        '.nm-site-footer nav{display:flex;align-items:center;justify-content:center;gap:clamp(12px,3vw,24px);flex-wrap:wrap;margin:0 0 10px}' +
        '.nm-site-footer nav a{color:#475569;font-size:14px;font-weight:600;text-decoration:none;white-space:nowrap}' +
        '.nm-site-footer nav a:hover,.nm-site-footer nav a:focus-visible{color:#2563eb}' +
        '.nm-site-footer p{margin:0;color:#64748b;font-size:12px}' +
        '@media(max-width:380px){.nm-site-footer{padding:16px 10px}.nm-site-footer nav{column-gap:12px;row-gap:8px}.nm-site-footer nav a{font-size:13px}}' +
        '.nm-back-to-top{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:calc(20px + env(safe-area-inset-bottom));z-index:95;display:flex;align-items:center;justify-content:center;width:44px;height:44px;padding:0;border:1px solid #e2e8f0;border-radius:50%;background:#fffffff2;color:#334155;box-shadow:0 8px 18px #0f172a1a;backdrop-filter:blur(8px);cursor:pointer;opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity .2s ease,transform .2s ease,visibility .2s ease}' +
        '.nm-back-to-top.is-visible{opacity:1;visibility:visible;transform:translateY(0)}' +
        '.nm-back-to-top:hover{background:#f8fafc;color:#2563eb}' +
        '.nm-back-to-top:focus-visible{outline:3px solid #2563eb;outline-offset:3px}' +
        '@media(min-width:768px){.nm-back-to-top{right:max(24px,calc((100vw - 1100px)/2 + 24px));bottom:24px}}' +
        '@media(prefers-reduced-motion:reduce){.nm-back-to-top{transition:none}}' +
        '@media print{.nm-back-to-top{display:none!important}}';
      document.head.appendChild(style);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNumberMobiFooter, { once: true });
  } else {
    initNumberMobiFooter();
  }
})();
