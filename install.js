/* NumberMobi: service worker registration + "添加到桌面" button logic.
   The installed icon always opens the homepage: the manifest start_url is "/",
   no matter which page the visitor installs from. */
(function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(function () {});
  }

  var deferredPrompt = null;
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  /* Always visible (user decision 2026-11-27): the button shows on every
     browser; a tap either opens the native install prompt or an instruction
     card. Only hidden when the site is already installed (standalone mode). */
  function reveal() {
    if (standalone) return;
    var btns = document.querySelectorAll("[data-install]");
    for (var i = 0; i < btns.length; i++) btns[i].hidden = false;
  }
  window.nmRevealInstall = reveal;
  reveal();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", reveal);
  }
  if (window.MutationObserver) {
    new MutationObserver(reveal).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
  });

  function showHint() {
    if (document.getElementById("nm-install-hint")) return;
    var card = document.createElement("div");
    card.id = "nm-install-hint";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-label", "添加到桌面");
    card.style.cssText =
      "position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;background:#fff;color:#1f2937;border:1px solid #e5e7eb;border-radius:14px;box-shadow:0 12px 32px rgba(15,23,42,.18);padding:16px 18px;font-size:14px;line-height:1.7;max-width:430px;margin:0 auto;";
    var text = isIOS
      ? "点浏览器底部的「分享」按钮，再选「添加到主屏幕」，桌面图标会打开 NumberMobi 首页。"
      : "在浏览器菜单里选「添加到主屏幕 / 安装应用」，桌面图标会打开 NumberMobi 首页。";
    card.innerHTML =
      "<strong style='display:block;font-size:15px;margin-bottom:4px;'>添加到桌面</strong>" +
      text +
      "<button type='button' style='display:block;margin-top:10px;background:#2563eb;color:#fff;border:none;border-radius:8px;padding:8px 18px;font-size:14px;cursor:pointer;'>知道了</button>";
    card.querySelector("button").addEventListener("click", function () {
      card.remove();
    });
    document.body.appendChild(card);
  }

  document.addEventListener("click", function (ev) {
    var t = ev.target;
    var btn = t && t.closest ? t.closest("[data-install]") : null;
    if (!btn) return;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () {
        deferredPrompt = null;
      });
    } else {
      showHint();
    }
  });
})();
