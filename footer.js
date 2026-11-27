(function () {
  'use strict';

  var FOOTER_HTML =
    '<nav class="uft-row" aria-label="页脚导航">' +
      '<a href="/about/">关于本站</a>' +
      '<a href="/privacy/">隐私政策</a>' +
      '<a href="https://go.openaa.com/feedback/?site=numbermobi" target="_blank" rel="noopener">联系与反馈</a>' +
      '<button type="button" class="uft-install" data-install hidden>添加到桌面</button>' +
    '</nav>' +
    '<nav class="uft-row" aria-label="OpenAA 生态">' +
      '<a href="https://openaa.com/" target="_blank" rel="noopener">OpenAA · 主站</a>' +
      '<a href="https://dmv.openaa.com/" target="_blank" rel="noopener">DMV题库</a>' +
      '<a href="https://tools.openaa.com/" target="_blank" rel="noopener">Tools工具</a>' +
      '<a href="https://en.openaa.com/" target="_blank" rel="noopener">EN英语</a>' +
      '<a href="https://go.openaa.com/" target="_blank" rel="noopener">Go导航</a>' +
      '<span class="uft-self" aria-current="true">NumberMobi · 手机靓号</span>' +
    '</nav>' +
    '<p class="uft-copy">© 2026 OpenAA · NumberMobi · 美国手机靓号</p>';

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

    footer.className = 'nm-footer';
    footer.setAttribute('aria-label', 'NumberMobi 全站页脚');
    footer.innerHTML = FOOTER_HTML;
    if (window.nmRevealInstall) window.nmRevealInstall();
    initBackToTop();

    if (!document.getElementById('nm-site-footer-styles')) {
      var style = document.createElement('style');
      style.id = 'nm-site-footer-styles';
      style.textContent =
        '.nm-back-to-top{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:calc(88px + env(safe-area-inset-bottom));z-index:9999;display:flex;align-items:center;justify-content:center;width:44px;height:44px;padding:0;border:1px solid #e2e8f0;border-radius:50%;background:#fffffff2;color:#334155;box-shadow:0 8px 18px #0f172a1a;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;pointer-events:auto;opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity .2s ease,transform .2s ease,visibility .2s ease}' +
        '.nm-back-to-top.is-visible{opacity:1;visibility:visible;transform:translateY(0)}' +
        '.nm-back-to-top:hover{background:#f8fafc;color:#2563eb}' +
        '.nm-back-to-top:focus-visible{outline:3px solid #2563eb;outline-offset:3px}' +
        '@media(min-width:768px){.nm-back-to-top{right:max(24px,calc((100vw - 1100px)/2 + 24px));bottom:24px}}' +
        '@media(prefers-reduced-motion:reduce){.nm-back-to-top{transition:none}}';
      document.head.appendChild(style);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNumberMobiFooter, { once: true });
  } else {
    initNumberMobiFooter();
  }
})();
