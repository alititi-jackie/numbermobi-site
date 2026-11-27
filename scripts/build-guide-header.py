from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
GUIDES = ROOT / "guides"
SCRIPT_TAG = '<script src="/guides/search-ui.js" defer></script>'
FOOTER_HTML = """<footer class="nm-footer">
  <nav class="uft-row" aria-label="页脚导航">
    <a href="/about/">关于本站</a>
    <a href="/privacy/">隐私政策</a>
    <a href="https://go.openaa.com/feedback/?site=numbermobi" target="_blank" rel="noopener">联系与反馈</a>
    <button type="button" class="uft-install" data-install hidden>添加到桌面</button>
  </nav>
  <nav class="uft-row" aria-label="OpenAA 生态">
    <a href="https://openaa.com/" target="_blank" rel="noopener">OpenAA · 主站</a>
    <a href="https://dmv.openaa.com/" target="_blank" rel="noopener">DMV题库</a>
    <a href="https://tools.openaa.com/" target="_blank" rel="noopener">Tools工具</a>
    <a href="https://en.openaa.com/" target="_blank" rel="noopener">EN英语</a>
    <a href="https://go.openaa.com/" target="_blank" rel="noopener">Go导航</a>
    <span class="uft-self" aria-current="true">NumberMobi · 手机靓号</span>
  </nav>
  <p class="uft-copy">© 2026 OpenAA · NumberMobi · 美国手机靓号</p>
</footer>"""

updated_scripts = 0
updated_footers = 0
for page in sorted(GUIDES.rglob("*.html")):
    text = page.read_text(encoding="utf-8")

    # Ensure the shared guide header/search script is present.
    if SCRIPT_TAG not in text:
        if "</body>" not in text:
            print(f"Skip (no body close): {page.relative_to(ROOT)}")
            continue
        text = text.replace("</body>", f"{SCRIPT_TAG}</body>", 1)
        updated_scripts += 1

    # Render footer links in the static HTML, not only through JavaScript.
    if re.search(r"<footer\b[^>]*>.*?</footer>", text, flags=re.I | re.S):
        new_text, count = re.subn(
            r"<footer\b[^>]*>.*?</footer>",
            FOOTER_HTML,
            text,
            count=1,
            flags=re.I | re.S,
        )
        if count and new_text != text:
            text = new_text
            updated_footers += 1
    else:
        # Add a footer before the shell closes when a page has no footer element.
        shell_close = text.rfind("</div>")
        body_close = text.lower().rfind("</body>")
        insert_at = shell_close if shell_close >= 0 and (body_close < 0 or shell_close < body_close) else body_close
        if insert_at >= 0:
            text = text[:insert_at] + FOOTER_HTML + text[insert_at:]
            updated_footers += 1

    page.write_text(text, encoding="utf-8")

print(f"NumberMobi guide pages prepared: {updated_scripts} script tag(s) added; {updated_footers} static footer(s) normalized")
