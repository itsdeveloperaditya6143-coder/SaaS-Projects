from flask import Flask, send_from_directory, jsonify
import os

# frontend/ lives next to backend/: CodeSnap/frontend
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
    return jsonify(status="ok", service="codesnap-backend")


# Serve frontend static files (style.css, app.js, manifest.json, sw.js, icons/...)
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
