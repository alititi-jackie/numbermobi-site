(function () {
  'use strict';
  var GO_URL = 'https://go.openaa.com/';
  function initNumberMobiGuideHeader() {
    var header = document.querySelector('.shell > header, .shell header, header');
    if (header && !header.querySelector('.nm-header-inner')) {
      header.innerHTML =
        '<div class="nm-header-inner">' +
          '<a class="nm-brand" href="/" aria-label="NumberMobi 首页"><img src="/logo.png" alt="" width="32" height="32"><span>NumberMobi</span></a>' +
          '<div class="nm-header-actions">' +
            '<a class="nm-icon-button" href="' + GO_URL + '" aria-label="打开导航" title="导航">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>' +
            '</a>' +
            '<button class="nm-icon-button" type="button" data-nm-share aria-label="分享当前页面" title="分享当前页面">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>';
    }
    if (header && !document.querySelector('.nm-guide-search')) {
      var bar = document.createElement('div');
      bar.className = 'nm-guide-search';
      bar.innerHTML = '<form action="/#number-search" method="get" role="search"><input type="search" name="q" aria-label="搜索号码" placeholder="搜索号码、区号或尾号" autocomplete="off"><button type="submit" aria-label="搜索">搜索</button></form>';
      header.insertAdjacentElement('afterend', bar);
    }
    var formInput = document.querySelector('.nm-guide-search input[name="q"]');
    if (formInput) {
      var params = new URLSearchParams(window.location.search);
      if (params.get('q')) formInput.value = params.get('q');
    }
  }
  document.addEventListener('click', async function (event) {
    var button = event.target.closest('[data-nm-share]');
    if (!button) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, text: 'NumberMobi 美国手机靓号', url: window.location.href });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        button.setAttribute('aria-label', '链接已复制');
        button.title = '链接已复制';
      } else {
        window.prompt('复制页面链接：', window.location.href);
      }
    } catch (error) {
      if (!error || error.name !== 'AbortError') window.prompt('复制页面链接：', window.location.href);
    }
  });
  initNumberMobiGuideHeader();
})();