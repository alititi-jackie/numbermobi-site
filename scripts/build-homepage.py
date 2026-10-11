from pathlib import Path
import re

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

# 2) Add a compact guide hub on the homepage, before the inventory notice.
guide_marker = '<article class="template-card nm-guide-home" id="guides">'
if guide_marker not in text:
    buy_anchor = '        <article class="template-card" id="buy-note">\n'
    if buy_anchor not in text:
        raise SystemExit("Could not find inventory-note insertion point")
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

# 3) Replace the old homepage purchase list with a clear inventory/contact notice.
inventory_block = '''        <article class="template-card" id="buy-note">
          <h2>美国各州更多号码，欢迎咨询</h2>
          <p><strong>网站仅展示部分号码，并非全部库存。</strong>目前美国多个州还有更多号码资源，但部分号码尚未整理上架，网页显示的号码、库存状态及价格可能未及时更新，实际可售情况请以联系确认为准。</p>
          <p>如需指定州、区号、生日号、连号、特殊数字组合或容易记忆的尾号，欢迎直接添加微信或致电查询。网页上没有找到心仪号码，也欢迎咨询，我们会根据您的需求协助查询更多库存及相近选择。</p>
          <div class="notice-box"><strong>想了解更多号码？</strong> 添加微信咨询 。支持微信、Zelle 等付款方式，具体付款方式请联系确认。付款前请确认号码、最终价格及转网要求。</div>
          <p style="margin-top:12px"><a href="/purchase-guide/" style="color:#2563eb;font-weight:800">查看完整购买说明及购买须知 →</a></p>
        </article>'''
text, count = re.subn(
    r'        <article class="template-card" id="buy-note">.*?        </article>',
    inventory_block,
    text,
    count=1,
    flags=re.S,
)
if count != 1:
    raise SystemExit("Could not replace homepage inventory/purchase note")

# 4) Show concise, important purchase terms in the existing number-click modal.
modal_anchor = '''              '<p class="nm-contact-desc">查询号码是否仍在售及购买事宜。</p>' +
              '<div class="nm-contact-number-label">您选择的手机号</div>' +'''
modal_notice = '''              '<p class="nm-contact-desc">查询号码是否仍在售及购买事宜。</p>' +
              '<div class="nm-purchase-notice" id="nmPurchaseNotice">' +
                '<h3>购买须知</h3>' +
                '<p><strong>号码与套餐：</strong>本站仅出售号码，不包含手机套餐。购买成功后提供转网所需账号及密码，需自行办理转网。</p>' +
                '<p><strong>转网与退换：</strong>本站号码均为虚拟网络运营商号码，不保证所有号码均可转入指定运营商。号码售出后，概不退换。若指定运营商无法接收，建议更换为支持转入的运营商；具体规则以适用法律为准。</p>' +
                '<p><strong>转出期限：</strong>请尽量在购买后 20 天内完成转出。</p>' +
                '<p><strong>逾期托管：</strong>超过 20 天仍未转出的号码，按每月 $4 收取托管费用。具体计费规则请在购买前确认。</p>' +
                '<a href="/purchase-guide/" target="_blank" rel="noopener">查看完整购买说明 →</a>' +
              '</div>' +
              '<div class="nm-contact-number-label">您选择的手机号</div>' +'''
if 'id="nmPurchaseNotice"' not in text:
    if modal_anchor not in text:
        raise SystemExit("Could not find number-click modal insertion point")
    text = text.replace(modal_anchor, modal_notice, 1)

# 5) Keep the longer modal readable on mobile and retain existing copy/contact actions.
modal_css = '''
<style id="nm-purchase-notice-styles">
.nm-contact-dialog{max-height:calc(100vh - 28px);overflow-y:auto;text-align:left;overscroll-behavior:contain}
.nm-contact-mark,.nm-contact-dialog h2,.nm-contact-intro,.nm-contact-desc,.nm-contact-number-label,.nm-contact-number,.nm-contact-actions,.nm-copy-status,.nm-contact-tip{text-align:center}
.nm-purchase-notice{margin:0 0 14px;padding:12px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;color:#334155;font-size:12px;line-height:1.55}
.nm-purchase-notice h3{margin:0 0 8px;color:#111827;font-size:15px;font-weight:800}
.nm-purchase-notice p{margin:0 0 7px}
.nm-purchase-notice p:last-of-type{margin-bottom:8px}
.nm-purchase-notice a{color:#2563eb;font-weight:800;text-decoration:none}
@media(max-width:600px){.nm-contact-overlay{align-items:center;padding:12px}.nm-contact-dialog{max-width:440px;max-height:calc(100dvh - 24px);padding:24px 16px 16px}.nm-purchase-notice{font-size:12px;padding:10px}}
</style>
'''
if 'id="nm-purchase-notice-styles"' not in text:
    if '</head>' not in text:
        raise SystemExit("Could not find document head close")
    text = text.replace('</head>', modal_css + '\n</head>', 1)

# Important: do not rewrite number grids during deployment.
# Existing numbers.json + frontend JavaScript rendering is the stable source of truth.
INDEX.write_text(text, encoding="utf-8")
print("Homepage prepared: guides, inventory notice, and number-click purchase notice updated")
