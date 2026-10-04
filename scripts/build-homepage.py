from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"

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

# Important: do not rewrite number grids during deployment.
# Existing numbers.json + frontend JavaScript rendering is the stable source of truth.
INDEX.write_text(text, encoding="utf-8")
print("Homepage prepared: guides added; number grids left untouched")
