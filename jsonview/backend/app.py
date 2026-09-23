from flask import Flask, send_from_directory, jsonify, request
import os
import json

# frontend/ lives next to backend/: jsonview/frontend
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
    return jsonify(status="ok", service="jsonview-backend")


def _sort_deep(v):
    if isinstance(v, dict):
        return {k: _sort_deep(v[k]) for k in sorted(v.keys())}
    if isinstance(v, list):
        return [_sort_deep(x) for x in v]
    return v


def _stats(v):
    keys, depth = 0, 0

    def walk(x, d):
        nonlocal keys, depth
        depth = max(depth, d)
        if isinstance(x, dict):
            keys += len(x)
            for val in x.values():
                walk(val, d + 1)
        elif isinstance(x, list):
            for item in x:
                walk(item, d + 1)

    walk(v, 1)
    return {"keys": keys, "depth": depth}


@app.route("/api/format", methods=["POST", "OPTIONS"])
def api_format():
    if request.method == "OPTIONS":
        return "", 204
    data = request.get_json(force=True, silent=True) or {}
    text = data.get("text", "")
    action = str(data.get("action", "pretty"))  # pretty | minify | sort | validate
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError as e:
        return jsonify(ok=False, error=str(e.msg), line=e.lineno, col=e.colno), 200
    if action == "minify":
        out = json.dumps(parsed, separators=(",", ":"), ensure_ascii=False)
    elif action == "sort":
        out = json.dumps(_sort_deep(parsed), indent=2, ensure_ascii=False)
    elif action == "validate":
        out = ""
    else:
        out = json.dumps(parsed, indent=2, ensure_ascii=False)
    st = _stats(parsed)
    st.update(ok=True, output=out, action=action,
              type="array" if isinstance(parsed, list) else "object" if isinstance(parsed, dict) else type(parsed).__name__)
    return jsonify(st)


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
