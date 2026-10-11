from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
GUIDES = ROOT / "guides"
SCRIPT_TAG = '<script src="/guides/search-ui.js" defer></script>'
FOOTER_HTML = """<footer class="nm-site-footer" aria-label="NumberMobi 全站页脚">
  <nav aria-label="NumberMobi 全站导航">
    <a href="/">NumberMobi 首页</a>
    <a href="/guides/">选号指南</a>
    <a href="/purchase-guide/">购买说明</a>
    <a href="https://openaa.com/" target="_blank" rel="noopener noreferrer">OpenAA</a>
  </nav>
  <p>© 2026 NumberMobi · 美国手机靓号</p>
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
