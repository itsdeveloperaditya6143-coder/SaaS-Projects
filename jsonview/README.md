# 🧩 JSONView

Paste JSON → format, validate, explore as a tree, convert to YAML / CSV / Python. 100% free, no login, unlimited, open source.

Week 4 #buildinpublic by Aditya.

## Rules followed
- NO AI API
- NO paid domain / DB / service
- Ultra-lightweight for Render free (512MB RAM): Flask + vanilla JS only, ~20MB, zero dependencies (own YAML/CSV/Python converters, no CDN libs)

## Run locally
```bash
cd jsonview/backend
pip install -r requirements.txt
python app.py
# open http://localhost:5000
```

## Deploy on Render (Blueprint)
- New → Blueprint → repo → Blueprint file: `jsonview/render.yaml`
- Creates `jsonview-backend` (Python) + `jsonview` (Static, clean URL)

## API (optional, free)
`POST /api/format` → `{ "text": "...", "action": "pretty|minify|sort|validate" }`
← `{ "ok": true, "output": "...", "keys": n, "depth": n }` or `{ "ok": false, "error": "...", "line": n, "col": n }`
