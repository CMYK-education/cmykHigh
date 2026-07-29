# CMYK High

A single static marketing/landing page for **CMYK High**, an independent high school in Lehi, Utah. Deployed via GitHub Pages (see `CNAME` → `cmykhigh.com`).

## Cursor Cloud specific instructions

- This repo is a **single self-contained static site**: `index.html` (inline `<style>` + inline `<script>`) plus `CNAME`. There is **no** package manager, build step, bundler, linter, or test suite — nothing to install or compile.
- **Run it (dev):** serve the repo root with any static server, e.g. `python3 -m http.server 8000` (Python 3 is available), then open `http://localhost:8000/`. There is no hot reload — after editing `index.html`, just refresh the browser.
- **Runtime external calls** (both degrade gracefully, so the page works offline/local):
  - Fonts load from Google Fonts CDN; system-font fallbacks are defined.
  - The founding-waitlist form POSTs to a **production Google Apps Script endpoint** (`ENDPOINT` in the inline `<script>`) that writes to the school's live waitlist sheet and emails the owner. Submissions also persist to `localStorage`, and the success UI shows regardless of the network result. **When testing the form, do NOT submit against the real endpoint** — it pollutes production data and emails a real person. Instead serve a copy with `ENDPOINT` set to `''` (empty string), which takes the local-only success branch and still exercises validation, `localStorage`, spot-number, and success UI.
