from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GUIDES = ROOT / "guides"
SCRIPT_TAG = '<script src="/guides/search-ui.js" defer></script>'

updated = 0
for page in sorted(GUIDES.rglob("*.html")):
    text = page.read_text(encoding="utf-8")
    if SCRIPT_TAG in text:
        continue
    if "</body>" not in text:
        print(f"Skip (no body close): {page.relative_to(ROOT)}")
        continue
    text = text.replace("</body>", f"{SCRIPT_TAG}</body>", 1)
    page.write_text(text, encoding="utf-8")
    updated += 1

print(f"NumberMobi guide header/search prepared: {updated} page(s) updated")
