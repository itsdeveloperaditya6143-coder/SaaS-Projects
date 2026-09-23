from flask import Flask, send_from_directory, jsonify, request
import os
import re

# frontend/ lives next to backend/: tweetsplit/frontend
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")


@app.after_request
def add_cors_headers(response):
    # Allow the deployed frontend (Render Static Site) to call /api/*
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


@app.route("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/health")
def health():
    return "ok", 200


@app.route("/api/health")
def api_health():
    return jsonify(status="ok", service="tweetsplit-backend")


NUM_RE = re.compile(r"^\s*\d{1,3}\s*[.)\:\-\]]\s+\S")
NUM_ONLY_RE = re.compile(r"^\s*\d{1,3}\s*[.)\:\-\]]?\s*$")
BUL_RE = re.compile(r"^\s*[-*•▪◦–—>]+\s+\S")


def _is_list_line(line):
    return bool(NUM_RE.match(line) or BUL_RE.match(line) or NUM_ONLY_RE.match(line))


_ABBREV = ["Mr", "Mrs", "Ms", "Dr", "Prof", "Sr", "Jr", "St", "vs",
           "e\\.g", "i\\.e", "etc", "Fig", "No", "Rs"]


def _split_sentences_smart(line):
    """Split a single line on sentence borders. Abbreviations + decimals safe."""
    prot = re.sub(r"\b(" + "|".join(_ABBREV) + r")\.", r"\1<DOT>", line)
    prot = re.sub(r"(\d)\.(\d)", r"\1<DOT>\2", prot)
    parts = re.findall(r"[^.!?]+[.!?]+[\"'”’)\]]*\s*|\s*\S[\s\S]*?(?=$)", prot)
    out = [p.replace("<DOT>", ".").strip() for p in parts]
    out = [p for p in out if p]
    return out or [line.strip()]


def _tokenize_atomic(text, smart=True):
    """Break text into atomic units: [(unit_text, join_after)]. Never splits a list point."""
    units = []
    list_count = 0
    paras = re.split(r"\n\s*\n", text)
    for raw_para in paras:
        lines = [l.rstrip() for l in raw_para.split("\n")]
        while lines and not lines[0].strip():
            lines.pop(0)
        while lines and not lines[-1].strip():
            lines.pop()
        if not lines:
            continue
        has_list = smart and any(_is_list_line(l) for l in lines)
        if has_list:
            cur = None

            def flush(join):
                nonlocal cur, list_count
                if cur is not None:
                    units.append((cur, join))
                    if NUM_RE.match(cur) or BUL_RE.match(cur) or NUM_ONLY_RE.match(cur):
                        list_count += 1
                    cur = None

            for line in lines:
                tr = line.strip()
                if not tr:
                    flush("\n")
                    continue
                if _is_list_line(line):
                    flush("\n")
                    cur = tr
                elif cur is not None:
                    cur = cur + " " + tr  # wrapped continuation of same point
                else:
                    units.append((tr, "\n"))  # header line above the list
            flush("\n\n")
            if units:
                t, _j = units[-1]
                units[-1] = (t, "\n\n")
        else:
            for li, line in enumerate(lines):
                tr = line.strip()
                if not tr:
                    continue
                sents = _split_sentences_smart(tr) if smart else [tr]
                for si, s in enumerate(sents):
                    last_line = (li == len(lines) - 1)
                    last_sent = (si == len(sents) - 1)
                    join = " " if not last_sent else ("\n" if not last_line else "\n\n")
                    units.append((s, join))
    return units, list_count


def _split_long_unit(text, limit):
    """Word-split one oversized unit; follow-up pieces get '↳ ' continuation mark."""
    words = text.split()
    pieces, cur, cont = [], "", False
    for w in words:
        budget = limit - (2 if (cont or pieces) else 0)
        if len(w) > budget:
            # oversize word / URL: hard cut
            if cur:
                pieces.append(cur)
                cur = ""
            start_mark = "↳ " if (cont or pieces) else ""
            b0 = limit - len(start_mark)
            for i in range(0, len(w), b0):
                pre = start_mark if i == 0 else "↳ "
                b = limit - len(pre)
                pieces.append((pre + w[i:i + b]).strip())
            cont = True
            continue
        pre = "" if cur else ("↳ " if (cont or pieces) else "")
        trial = cur + (" " if cur else "") + pre + w
        if len(trial) <= limit:
            cur = trial
        else:
            if cur:
                pieces.append(cur)
            cur = ("↳ " if (pieces or cont) else "") + w
            cont = True
    if cur:
        pieces.append(cur)
    return pieces or [text]


def split_text_smart(text, max_len=280, numbering=True, smart=True):
    """Format-aware splitter. No deps, no AI. Mirrors frontend/app.js v1.1."""
    text = re.sub(r"\n{3,}", "\n\n", (text or "").replace("\r\n", "\n")).strip()
    if not text:
        return [], 0

    def pack(limit):
        units, lc = _tokenize_atomic(text, smart)
        chunks, cur, cur_sep = [], "", ""
        for unit_text, join in units:
            if len(unit_text) > limit:
                if cur.strip():
                    chunks.append(cur.strip())
                    cur, cur_sep = "", ""
                for p in _split_long_unit(unit_text, limit):
                    chunks.append(p.strip())
                continue
            if not cur:
                cur, cur_sep = unit_text, join
                continue
            trial = cur + cur_sep + unit_text
            if len(trial) <= limit:
                cur, cur_sep = trial, join
            else:
                chunks.append(cur.strip())
                cur, cur_sep = unit_text, join
        if cur.strip():
            chunks.append(cur.strip())
        return chunks, lc

    if not numbering:
        chunks, lc = pack(max_len)
        return chunks, lc

    # Two-pass: estimate total to reserve "i/n " prefix space
    guess, lc = pack(max_len)
    total = max(1, len(guess))
    reserve = len("%d/%d " % (total, total))
    chunks, lc = pack(max_len - reserve)
    # If count grew after reserving, re-pack once more (rare)
    if len(chunks) != total:
        total = len(chunks)
        reserve = len("%d/%d " % (total, total))
        chunks, lc = pack(max_len - reserve)
    return chunks, lc


@app.route("/api/split", methods=["POST", "OPTIONS"])
def api_split():
    if request.method == "OPTIONS":
        return "", 204
    data = request.get_json(force=True, silent=True) or {}
    text = data.get("text", "")
    try:
        max_len = int(data.get("max_len", 280))
    except (TypeError, ValueError):
        max_len = 280
    max_len = max(50, min(280, max_len))
    numbering = bool(data.get("numbering", True))
    style = str(data.get("style", "start"))  # start | end | none
    smart = bool(data.get("smart", True))
    chunks, list_count = split_text_smart(text, max_len, numbering if style != "none" else False, smart)
    total = len(chunks)
    tweets = []
    for i, c in enumerate(chunks, 1):
        if style == "none" or not numbering:
            tweets.append(c)
        elif style == "end":
            tweets.append("%s\n\n%d/%d" % (c, i, total))
        else:
            tweets.append("%d/%d %s" % (i, total, c))
    return jsonify(tweets=tweets, count=total, max_len=max_len, list_points=list_count, smart=smart)


# Serve frontend static files (style.css, app.js, manifest.json, sw.js, ...)
@app.route("/<path:path>")
def serve_frontend(path):
    full_path = os.path.join(FRONTEND_DIR, path)
    if os.path.isfile(full_path):
        return send_from_directory(FRONTEND_DIR, path)
    # SPA fallback: unknown routes -> index.html
    return send_from_directory(FRONTEND_DIR, "index.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
