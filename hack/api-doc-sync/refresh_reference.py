#!/usr/bin/env python3
"""Re-inline openapi.yaml into the interactive Swagger UI page.

Usage:
    refresh_reference.py [openapi.yaml] [api.html]

Defaults are the two files in docs/platform/api. The page carries the whole spec
inline as `window.__SPEC__ = {...};` so it works without fetching anything, which
means it has to be regenerated after every openapi.yaml edit. Also refreshes the
"N paths / M operations" subtitle.

Requires PyYAML.
"""
import json
import re
import sys
import os

import yaml

VERBS = ("get", "put", "post", "delete", "options", "head", "patch", "trace")
HERE = os.path.dirname(os.path.abspath(__file__))
API_DIR = os.path.join(HERE, "..", "..", "docs", "platform", "api")


def main():
    spec_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(API_DIR, "openapi.yaml")
    html_path = sys.argv[2] if len(sys.argv) > 2 else os.path.join(API_DIR, "reference", "api.html")

    spec = yaml.safe_load(open(spec_path, encoding="utf-8"))
    paths = spec.get("paths", {})
    ops = sum(1 for item in paths.values() for v in item if v in VERBS)

    html = open(html_path, encoding="utf-8").read()
    inline = "window.__SPEC__ = %s;" % json.dumps(spec, separators=(",", ":"))
    html, n = re.subn(r"window\.__SPEC__ = \{.*\};", lambda _: inline, html, count=1)
    if n != 1:
        sys.exit("could not find the window.__SPEC__ assignment in %s" % html_path)
    html, n = re.subn(r"\d+ paths / \d+ operations",
                      "%d paths / %d operations" % (len(paths), ops), html, count=1)
    if n != 1:
        sys.exit("could not find the 'N paths / M operations' subtitle in %s" % html_path)

    open(html_path, "w", encoding="utf-8").write(html)
    print("%s: %d paths / %d operations" % (html_path, len(paths), ops))


if __name__ == "__main__":
    main()
