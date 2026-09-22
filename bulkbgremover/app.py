import os
import uuid
import zipfile
import time
import json
from flask import Flask, request, jsonify, send_file, render_template, Response
from flask_cors import CORS
from werkzeug.utils import secure_filename
from remover import remove_background, is_model_ready

app = Flask(__name__)
CORS(app)
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024
app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
app.config["RESULT_FOLDER"] = os.path.join(os.path.dirname(os.path.abspath(__file__)), "results")

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
os.makedirs(app.config["RESULT_FOLDER"], exist_ok=True)

ALLOWED_EXT = {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff", ".tif", ".gif"}


def allowed_file(filename):
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXT


def sse_event(event, data):
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/health")
def health():
    return jsonify({"status": "ok", "engine": "rembg", "model": "u2net", "model_ready": is_model_ready()})


@app.route("/model-status")
def model_status():
    return jsonify({"ready": is_model_ready()})


@app.route("/remove-stream", methods=["POST"])
def remove_stream():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    f = request.files["file"]
    if f.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(f.filename):
        return jsonify({"error": "Unsupported format. Use JPG, PNG, WEBP, BMP, TIFF"}), 400

    if not is_model_ready():
        return jsonify({"error": "Model still loading. Please wait."}), 503

    input_bytes = f.read()
    original_name = secure_filename(f.filename)

    def generate():
        try:
            yield sse_event("progress", {"percent": 10, "text": "Reading image..."})
            time.sleep(0.1)

            yield sse_event("progress", {"percent": 25, "text": "Analyzing image..."})
            time.sleep(0.1)

            yield sse_event("progress", {"percent": 40, "text": "Removing background..."})

            start = time.time()
            output_bytes = remove_background(input_bytes)
            elapsed = round(time.time() - start, 2)

            yield sse_event("progress", {"percent": 80, "text": "Cleaning edges..."})
            time.sleep(0.1)

            result_name = f"bgremoved_{uuid.uuid4().hex[:8]}.png"
            result_path = os.path.join(app.config["RESULT_FOLDER"], result_name)
            with open(result_path, "wb") as out:
                out.write(output_bytes)

            yield sse_event("progress", {"percent": 100, "text": "Done!"})
            time.sleep(0.1)

            result = {
                "success": True,
                "filename": result_name,
                "original": original_name,
                "size": len(output_bytes),
                "time": elapsed,
                "download_url": f"/download/{result_name}",
            }
            yield sse_event("complete", result)

        except Exception as e:
            yield sse_event("error", {"error": str(e)})

    return Response(generate(), mimetype="text/event-stream")


@app.route("/remove-bulk-stream", methods=["POST"])
def remove_bulk_stream():
    if not is_model_ready():
        return jsonify({"error": "Model still loading."}), 503

    files = request.files.getlist("files")
    if not files or all(f.filename == "" for f in files):
        return jsonify({"error": "No files uploaded"}), 400

    valid_files = [f for f in files if f.filename and allowed_file(f.filename)]
    if not valid_files:
        return jsonify({"error": "No valid image files found"}), 400

    batch_id = uuid.uuid4().hex[:8]
    total = len(valid_files)

    file_data = []
    for f in valid_files:
        file_data.append({
            "name": secure_filename(f.filename),
            "bytes": f.read(),
        })

    def generate():
        results = []
        errors = []

        yield sse_event("progress", {"percent": 0, "text": f"Starting {total} images...", "current": 0, "total": total})

        for i, fd in enumerate(file_data):
            try:
                original_name = fd["name"]
                yield sse_event("progress", {
                    "percent": round((i / total) * 100),
                    "text": f"Processing {i + 1}/{total}: {original_name[:30]}...",
                    "current": i,
                    "total": total,
                })

                input_bytes = fd["bytes"]
                start = time.time()
                output_bytes = remove_background(input_bytes)
                elapsed = round(time.time() - start, 2)

                name_without_ext = os.path.splitext(original_name)[0]
                result_name = f"{name_without_ext}_nobg_{batch_id}.png"
                result_path = os.path.join(app.config["RESULT_FOLDER"], result_name)
                with open(result_path, "wb") as out:
                    out.write(output_bytes)

                results.append({
                    "original": original_name,
                    "filename": result_name,
                    "size": len(output_bytes),
                    "time": elapsed,
                    "download_url": f"/download/{result_name}",
                })

                yield sse_event("image-done", {
                    "index": i,
                    "original": original_name,
                    "filename": result_name,
                    "processed": len(results),
                    "total": total,
                })

            except Exception as e:
                errors.append({"original": fd["name"], "error": str(e)})
                yield sse_event("image-error", {"index": i, "error": str(e)})

        zip_name = f"batch_{batch_id}.zip"
        zip_path = os.path.join(app.config["RESULT_FOLDER"], zip_name)
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for r in results:
                file_path = os.path.join(app.config["RESULT_FOLDER"], r["filename"])
                zf.write(file_path, r["filename"])

        yield sse_event("progress", {"percent": 100, "text": "All done!", "current": total, "total": total})
        time.sleep(0.1)

        yield sse_event("complete", {
            "success": True,
            "batch_id": batch_id,
            "total": total,
            "processed": len(results),
            "failed": len(errors),
            "errors": errors,
            "results": results,
            "zip_url": f"/download/{zip_name}",
        })

    return Response(generate(), mimetype="text/event-stream")


@app.route("/download/<filename>")
def download(filename):
    safe = secure_filename(filename)
    path = os.path.join(app.config["RESULT_FOLDER"], safe)
    if not os.path.exists(path):
        return jsonify({"error": "File not found"}), 404
    return send_file(path, as_attachment=True)
