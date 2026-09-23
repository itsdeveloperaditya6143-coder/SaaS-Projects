# 🧵 TweetSplit

Long text → perfect X thread in 3 seconds. 100% free, no login, unlimited, open source.

Week 3 #buildinpublic by Aditya.

## Rules followed
- NO AI API
- NO paid domain / DB / service
- Ultra-lightweight for Render free (512MB RAM): Flask + vanilla JS only, ~20MB, no DB (localStorage + URL-hash share)

## Run locally
```bash
cd tweetsplit/backend
pip install -r requirements.txt
python app.py
# open http://localhost:5000
```

## Deploy on Render (Blueprint)
- New → Blueprint → repo → Blueprint file: `tweetsplit/render.yaml`
- Creates `tweetsplit-backend` (Python) + `tweetsplit-frontend` (Static)

## API (optional, free)
`POST /api/split` → `{ "text": "...", "max_len": 280, "numbering": true, "style": "start" }`
← `{ "tweets": [...], "count": n }`
