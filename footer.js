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

    if (!document.getElementById('nm-site-footer-styles')) {
      var style = document.createElement('style');
      style.id = 'nm-site-footer-styles';
      style.textContent =
        '.nm-site-footer{margin:28px auto 0;padding:18px 16px 16px;border-top:1px solid #dbe3ee;background:#fff;color:#64748b;text-align:center;font-size:13px;line-height:1.6}' +
        '.nm-site-footer nav{display:flex;align-items:center;justify-content:center;gap:clamp(12px,3vw,24px);flex-wrap:wrap;margin:0 0 10px}' +
        '.nm-site-footer nav a{color:#475569;font-size:14px;font-weight:600;text-decoration:none;white-space:nowrap}' +
        '.nm-site-footer nav a:hover,.nm-site-footer nav a:focus-visible{color:#2563eb}' +
        '.nm-site-footer p{margin:0;color:#64748b;font-size:12px}' +
        '@media(max-width:380px){.nm-site-footer{padding:16px 10px}.nm-site-footer nav{column-gap:12px;row-gap:8px}.nm-site-footer nav a{font-size:13px}}';
      document.head.appendChild(style);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNumberMobiFooter, { once: true });
  } else {
    initNumberMobiFooter();
  }
})();
