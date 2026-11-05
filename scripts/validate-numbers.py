#!/usr/bin/env python3
"""Validate numbers.json before publish.

Runs automatically at the start of scripts/build-homepage.py (which GitHub
Actions executes on every deploy); a failure aborts the build so bad
inventory can never reach the live homepage. Can also be run manually:

    python3 scripts/validate-numbers.py

Checks:
- top level is an object with triple / quad / other lists
- every item has a 10-digit number and a positive price
- no duplicate numbers across all groups
- deliberately NO content rules: what belongs in each group is the
  owner's choice. Number patterns (no digit 4, repeated endings, 8888
  tails) are sourcing criteria for imports, not publish gates.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "numbers.json"
GROUPS = ("triple", "quad", "other")


def digits_of(value):
    return "".join(ch for ch in str(value) if ch.isdigit())


def main():
    try:
        data = json.loads(DATA.read_text(encoding="utf-8"))
    except Exception as exc:  # unreadable file or invalid JSON
        print(f"numbers.json cannot be parsed: {exc}")
        return 1
    if not isinstance(data, dict):
        print("numbers.json top level must be an object")
        return 1

    errors = []
    seen = {}
    for group in GROUPS:
        items = data.get(group)
        if not isinstance(items, list):
            errors.append(f"{group}: missing or not a list")
            continue
        for i, item in enumerate(items):
            where = f"{group}[{i}]"
            if not isinstance(item, dict):
                errors.append(f"{where}: not an object")
                continue
            number = item.get("number")
            d = digits_of(number) if number is not None else ""
            if len(d) != 10:
                errors.append(f"{where}: number {number!r} is not 10 digits")
                continue
            if d in seen:
                errors.append(f"{where}: duplicate number {d} (also in {seen[d]})")
            seen[d] = where
            price = item.get("price")
            if isinstance(price, bool) or not isinstance(price, (int, float)) or price <= 0:
                errors.append(f"{where}: price missing or not a positive number")

    for err in errors:
        print("ERROR:", err)
    if errors:
        print(f"numbers.json validation FAILED: {len(errors)} problem(s)")
        return 1
    total = sum(len(data[g]) for g in GROUPS if isinstance(data.get(g), list))
    print(f"numbers.json OK: {total} numbers validated")
    return 0


if __name__ == "__main__":
    sys.exit(main())
