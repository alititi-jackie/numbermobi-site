from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
NUMBERS = ROOT / "numbers.json"

text = INDEX.read_text(encoding="utf-8")

# 1) Add a visible SEO guides entry to the existing sticky category navigation.
nav_anchor = '              <a class="nm-cat-chip" href="#other">精品好记号</a>\n'
nav_guides = '              <a class="nm-cat-chip" href="/guides/">选号指南</a>\n'
if nav_guides not in text:
    if nav_anchor not in text:
        raise SystemExit("Could not find NumberMobi category navigation anchor")
    text = text.replace(nav_anchor, nav_anchor + nav_guides, 1)

# 2) Add a compact guide hub on the homepage, before purchase instructions.
guide_marker = '<article class="template-card nm-guide-home" id="guides">'
if guide_marker not in text:
    buy_anchor = '        <article class="template-card" id="buy-note">\n'
    if buy_anchor not in text:
        raise SystemExit("Could not find purchase-note insertion point")
    guide_block = '''        <article class="template-card nm-guide-home" id="guides">
          <h2>选号指南</h2>
          <p>第一次买美国手机靓号？这里整理了价格、纽约区号、三连号/四连号、转入套餐和购买注意事项。</p>
          <div class="mini-grid">
            <a class="mini-card" href="/guides/buy-us-phone-number/"><strong>美国靓号怎么买？</strong><span>选号、付款、交付与转入流程</span></a>
            <a class="mini-card" href="/guides/us-phone-number-price/"><strong>美国靓号多少钱？</strong><span>号码费用与手机套餐费用区别</span></a>
            <a class="mini-card" href="/guides/new-york-phone-number/"><strong>纽约区号怎么选？</strong><span>917、718、347、646、929 指南</span></a>
            <a class="mini-card" href="/guides/triple-quad-number/"><strong>三连号、四连号</strong><span>重复尾号与好记号码怎么选</span></a>
          </div>
          <p style="margin-top:12px"><a href="/guides/" style="color:#2563eb;font-weight:800">查看全部选号指南 →</a></p>
        </article>

'''
    text = text.replace(buy_anchor, guide_block + buy_anchor, 1)

# 3) Pre-render numbers from the single source of truth (numbers.json).
#    Existing JS still refreshes the same grids in the browser, so functionality stays unchanged.
data = json.loads(NUMBERS.read_text(encoding="utf-8"))

def format_number(raw):
    digits = re.sub(r"\D", "", str(raw or ""))
    if len(digits) == 11 and digits.startswith("1"):
        digits = digits[1:]
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    return str(raw or "")

def card(item):
    formatted = format_number(item.get("number"))
    sold = bool(item.get("sold"))
    classes = "nm-number-card is-sold" if sold else "nm-number-card"
    if sold:
        badge = '<span class="nm-badge sold">已售</span>'
        price = "已售出"
        click = "showNmToast('此号码已售出')"
    else:
        badge = '<span class="nm-badge">热卖</span>' if item.get("hot") else ""
        price = f"${item['price']}" if "price" in item else "请咨询"
        safe_js = formatted.replace("\\", "\\\\").replace("'", "\\'")
        click = f"openNmContact('{safe_js}')"
    return (
        f'<button class="{classes}" type="button" onclick="{html.escape(click, quote=True)}" '
        f'aria-label="{html.escape(formatted, quote=True)}">{badge}'
        f'<span class="nm-number">{html.escape(formatted)}</span>'
        f'<span class="nm-price">{html.escape(price)}</span></button>'
    )

for key in ("triple", "quad", "other"):
    items = data.get(key) if isinstance(data.get(key), list) else []
    cards = "".join(card(item) for item in items)

    # The source grid contains a nested .nm-loading div. Match the COMPLETE
    # outer grid so the original outer closing </div> is not left behind.
    grid_pattern = re.compile(
        rf'<div class="nm-number-grid" id="{key}Grid">\s*'
        rf'<div class="nm-loading">.*?</div>\s*</div>',
        re.DOTALL,
    )
    replacement = f'<div class="nm-number-grid" id="{key}Grid">{cards}</div>'
    text, n = grid_pattern.subn(replacement, text, count=1)
    if n != 1:
        raise SystemExit(f"Could not pre-render {key} grid")

    count_pattern = re.compile(rf'(<span class="nm-count" id="{key}Count">).*?(</span>)')
    text, n = count_pattern.subn(rf'\g<1>{len(items)} 个\g<2>', text, count=1)
    if n != 1:
        raise SystemExit(f"Could not update {key} count")

INDEX.write_text(text, encoding="utf-8")
print("Homepage prepared: guides added and numbers pre-rendered with valid grid markup")
