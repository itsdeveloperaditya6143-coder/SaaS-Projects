// --- DOM Elements ---
const landingPage = document.getElementById("landingPage");
const appPage = document.getElementById("appPage");
const modelBanner = document.getElementById("modelBanner");
const modelBannerText = document.getElementById("modelBannerText");
const modeBadge = document.getElementById("modeBadge");
const backToModes = document.getElementById("backToModes");
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const controls = document.getElementById("controls");
const fileCount = document.getElementById("fileCount");
const clearBtn = document.getElementById("clearBtn");
const processBtn = document.getElementById("processBtn");
const progressSection = document.getElementById("progressSection");
const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");
const progressDetail = document.getElementById("progressDetail");
const editorSection = document.getElementById("editorSection");
const comparisonContainer = document.getElementById("comparisonContainer");
const canvasOriginal = document.getElementById("canvasOriginal");
const canvasProcessed = document.getElementById("canvasProcessed");
const comparisonSlider = document.getElementById("comparisonSlider");
const downloadPng = document.getElementById("downloadPng");
const downloadJpg = document.getElementById("downloadJpg");
const backBtn = document.getElementById("backBtn");
const resultsSection = document.getElementById("resultsSection");
const resultsGrid = document.getElementById("resultsGrid");
const stats = document.getElementById("stats");
const downloadAllBtn = document.getElementById("downloadAllBtn");
const newBatchBtn = document.getElementById("newBatchBtn");
const errorToast = document.getElementById("errorToast");
const customBgInput = document.getElementById("customBgInput");

let selectedFiles = [];
let currentResults = [];
let currentZipUrl = null;
let modelReady = false;
let processedImageData = null;
let originalImage = null;
let currentBg = "transparent";
let customBgImage = null;
let sliderPos = 0.5;

// --- Mode Selection ---
function selectMode(mode) {
    currentMode = mode;
    localStorage.setItem("bgremover_mode", mode);
    API_URL = mode === "local" ? LOCAL_API_URL : CLOUD_API_URL;
    launchApp();
}

function launchApp() {
    landingPage.style.display = "none";
    appPage.style.display = "block";
    modeBadge.textContent = currentMode === "local" ? "LOCAL" : "CLOUD";
    modeBadge.className = "mode-badge " + currentMode;
    checkModel();
}

backToModes.addEventListener("click", () => {
    localStorage.removeItem("bgremover_mode");
    currentMode = null;
    appPage.style.display = "none";
    landingPage.style.display = "block";
    modelReady = false;
    resetAll();
});

// Auto-launch if mode was previously selected
if (currentMode) {
    launchApp();
}

// --- Model Status ---
async function checkModel() {
    modelBanner.classList.add("visible");
    modelBanner.classList.remove("ready", "error");
    modelBannerText.textContent = currentMode === "local"
        ? "Connecting to local server at localhost:5000..."
        : "Connecting to cloud server...";

    dropZone.style.opacity = "0.5";
    dropZone.style.pointerEvents = "none";

    try {
        const res = await fetch(`${API_URL}/model-status`);
        const data = await res.json();
        if (data.ready) {
            modelReady = true;
            modelBanner.classList.add("ready");
            modelBannerText.textContent = currentMode === "local"
                ? "Connected to local server!"
                : "Cloud server ready!";
            dropZone.style.opacity = "1";
            dropZone.style.pointerEvents = "auto";
            setTimeout(() => { modelBanner.style.display = "none"; }, 2000);
        } else {
            setTimeout(checkModel, 2000);
        }
    } catch {
        modelBanner.classList.remove("ready");
        modelBanner.classList.add("error");
        if (currentMode === "local") {
            modelBannerText.textContent = "Can't connect to localhost:5000. Start local server first: python app.py";
        } else {
            modelBannerText.textContent = "Cloud server is waking up... Please wait (may take 30-60s)";
        }
        setTimeout(checkModel, 3000);
    }
}

// --- Drag & Drop ---
dropZone.addEventListener("click", () => { if (!modelReady) return; fileInput.click(); });
dropZone.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.classList.add("dragover"); });
dropZone.addEventListener("dragleave", () => { dropZone.classList.remove("dragover"); });
dropZone.addEventListener("drop", (e) => { e.preventDefault(); dropZone.classList.remove("dragover"); handleFiles(e.dataTransfer.files); });
fileInput.addEventListener("change", (e) => handleFiles(e.target.files));

function handleFiles(fileList) {
    const valid = Array.from(fileList).filter((f) => /\.(jpg|jpeg|png|webp|bmp|tiff|tif|gif)$/i.test(f.name));
    if (valid.length === 0) { showError("No valid image files. Use JPG, PNG, WEBP, BMP, TIFF."); return; }
    selectedFiles = valid;
    fileCount.textContent = valid.length;
    controls.style.display = "flex";
    resultsSection.style.display = "none";
    editorSection.classList.remove("visible");
    progressSection.style.display = "none";
}

// --- Buttons ---
clearBtn.addEventListener("click", () => { selectedFiles = []; fileInput.value = ""; controls.style.display = "none"; });
processBtn.addEventListener("click", () => {
    if (selectedFiles.length === 0) return;
    selectedFiles.length === 1 ? processSingle(selectedFiles[0]) : processBulk(selectedFiles);
});
newBatchBtn.addEventListener("click", resetAll);
backBtn.addEventListener("click", resetAll);

function resetAll() {
    selectedFiles = [];
    fileInput.value = "";
    customBgInput.value = "";
    controls.style.display = "none";
    resultsSection.style.display = "none";
    editorSection.classList.remove("visible");
    progressSection.style.display = "none";
    processedImageData = null;
    originalImage = null;
    customBgImage = null;
    currentBg = "transparent";
    document.querySelectorAll(".bg-tab").forEach((t) => t.classList.remove("active"));
    document.querySelector('[data-tab="transparent"]').classList.add("active");
    Object.values(panels).forEach((p) => (p.style.display = "none"));
    panels.transparent.style.display = "block";
    document.querySelectorAll(".bg-color").forEach((c) => c.classList.remove("active"));
    document.querySelectorAll(".bg-gradient").forEach((g) => g.classList.remove("active"));
    customBgUpload.style.display = "flex";
    customBgPreview.style.display = "none";
}

// --- Single Processing ---
function processSingle(file) {
    showProgress(0, "Uploading...", "Preparing image...");
    processBtn.disabled = true;
    const formData = new FormData();
    formData.append("file", file);

    fetch(`${API_URL}/remove-stream`, { method: "POST", body: formData })
        .then((response) => {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            function read() {
                reader.read().then(({ done, value }) => {
                    if (done) { processBtn.disabled = false; return; }
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop();
                    let eventType = "";
                    for (const line of lines) {
                        if (line.startsWith("event: ")) eventType = line.slice(7).trim();
                        else if (line.startsWith("data: ")) {
                            try { handleSSEEvent(eventType, JSON.parse(line.slice(6))); } catch {}
                        }
                    }
                    read();
                });
            }
            read();
        })
        .catch(() => { showError("Network error. Is the server running?"); hideProgress(); processBtn.disabled = false; });
}

// --- Bulk Processing ---
function processBulk(files) {
    showProgress(0, "Uploading...", "Preparing images...");
    processBtn.disabled = true;
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    fetch(`${API_URL}/remove-bulk-stream`, { method: "POST", body: formData })
        .then((response) => {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            function read() {
                reader.read().then(({ done, value }) => {
                    if (done) { processBtn.disabled = false; return; }
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop();
                    let eventType = "";
                    for (const line of lines) {
                        if (line.startsWith("event: ")) eventType = line.slice(7).trim();
                        else if (line.startsWith("data: ")) {
                            try { handleSSEEvent(eventType, JSON.parse(line.slice(6))); } catch {}
                        }
                    }
                    read();
                });
            }
            read();
        })
        .catch(() => { showError("Network error. Is the server running?"); hideProgress(); processBtn.disabled = false; });
}

// --- SSE Handler ---
function handleSSEEvent(event, data) {
    switch (event) {
        case "progress":
            const detail = data.total ? `Processing ${data.current + 1} of ${data.total}` : data.text;
            showProgress(data.percent, data.text, detail);
            break;
        case "complete":
            if (data.results && data.results.length > 1) {
                currentResults = data.results;
                currentZipUrl = data.zip_url;
                showProgress(100, "Complete!", `${data.processed} images processed`);
                setTimeout(() => renderBulkResults(data), 500);
            } else {
                const result = data.results ? data.results[0] : data;
                showProgress(100, "Complete!", `Done in ${result.time}s`);
                setTimeout(() => showEditor(result), 400);
            }
            processBtn.disabled = false;
            break;
        case "error":
            showError(data.error);
            hideProgress();
            processBtn.disabled = false;
            break;
    }
}

// --- Editor ---
function showEditor(result) {
    progressSection.style.display = "none";
    controls.style.display = "none";
    editorSection.classList.add("visible");

    const downloadUrl = `${API_URL}${result.download_url}`;
    downloadPng.href = downloadUrl;
    downloadPng.download = result.filename;
    downloadJpg.href = downloadUrl;
    downloadJpg.download = result.filename.replace(".png", ".jpg");

    const imgOriginal = new Image();
    const imgProcessed = new Image();
    let loaded = 0;

    imgOriginal.onload = () => { originalImage = imgOriginal; if (++loaded === 2) initComparison(); };
    imgProcessed.onload = () => { processedImageData = imgProcessed; if (++loaded === 2) initComparison(); };

    imgOriginal.src = URL.createObjectURL(selectedFiles[0]);
    imgProcessed.src = downloadUrl;
}

function initComparison() {
    const container = comparisonContainer;
    const w = container.clientWidth;
    const h = container.clientHeight;
    canvasOriginal.width = w;
    canvasOriginal.height = h;
    canvasProcessed.width = w;
    canvasProcessed.height = h;
    drawComparison();
    setupSlider();
}

function drawComparison() {
    const ctx1 = canvasOriginal.getContext("2d");
    const ctx2 = canvasProcessed.getContext("2d");
    const w = canvasOriginal.width;
    const h = canvasOriginal.height;
    ctx1.clearRect(0, 0, w, h);
    ctx2.clearRect(0, 0, w, h);

    if (originalImage) {
        const scale = Math.min(w / originalImage.width, h / originalImage.height);
        const iw = originalImage.width * scale;
        const ih = originalImage.height * scale;
        ctx1.drawImage(originalImage, (w - iw) / 2, (h - ih) / 2, iw, ih);
    }

    if (processedImageData) {
        const scale = Math.min(w / processedImageData.width, h / processedImageData.height);
        const iw = processedImageData.width * scale;
        const ih = processedImageData.height * scale;
        const ox = (w - iw) / 2;
        const oy = (h - ih) / 2;

        if (currentBg !== "transparent") {
            if (customBgImage && currentBg === "custom") {
                ctx2.drawImage(customBgImage, 0, 0, w, h);
            } else if (currentBg.startsWith("linear-gradient")) {
                const grad = ctx2.createLinearGradient(0, 0, w, h);
                const colors = currentBg.match(/#[a-fA-F0-9]{6}/g);
                if (colors) { grad.addColorStop(0, colors[0]); grad.addColorStop(1, colors[1] || colors[0]); }
                ctx2.fillStyle = grad;
                ctx2.fillRect(0, 0, w, h);
            } else {
                ctx2.fillStyle = currentBg;
                ctx2.fillRect(0, 0, w, h);
            }
        } else {
            const size = 12;
            for (let y = 0; y < h; y += size) {
                for (let x = 0; x < w; x += size) {
                    ctx2.fillStyle = ((x / size + y / size) % 2 === 0) ? "#1a1a1a" : "#252525";
                    ctx2.fillRect(x, y, size, size);
                }
            }
        }
        ctx2.drawImage(processedImageData, ox, oy, iw, ih);
    }

    ctx2.save();
    ctx2.beginPath();
    ctx2.rect(0, 0, w * sliderPos, h);
    ctx2.clip();
    if (originalImage) {
        const scale = Math.min(w / originalImage.width, h / originalImage.height);
        const iw = originalImage.width * scale;
        const ih = originalImage.height * scale;
        ctx2.drawImage(originalImage, (w - iw) / 2, (h - ih) / 2, iw, ih);
    }
    ctx2.restore();
}

function setupSlider() {
    let isDragging = false;
    function updateSlider(x) {
        const rect = comparisonContainer.getBoundingClientRect();
        sliderPos = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
        comparisonSlider.style.left = (sliderPos * 100) + "%";
        drawComparison();
    }
    comparisonSlider.addEventListener("mousedown", () => isDragging = true);
    document.addEventListener("mousemove", (e) => { if (isDragging) updateSlider(e.clientX); });
    document.addEventListener("mouseup", () => isDragging = false);
    comparisonSlider.addEventListener("touchstart", () => isDragging = true);
    document.addEventListener("touchmove", (e) => { if (isDragging) updateSlider(e.touches[0].clientX); });
    document.addEventListener("touchend", () => isDragging = false);
    comparisonContainer.addEventListener("click", (e) => updateSlider(e.clientX));
}

// --- Background Picker ---
const panelTransparent = document.getElementById("panelTransparent");
const panelColors = document.getElementById("panelColors");
const panelGradients = document.getElementById("panelGradients");
const panelCustom = document.getElementById("panelCustom");
const customColorPicker = document.getElementById("customColorPicker");
const customBgUpload = document.getElementById("customBgUpload");
const customBgPreview = document.getElementById("customBgPreview");
const customBgThumb = document.getElementById("customBgThumb");
const removeCustomBg = document.getElementById("removeCustomBg");
const applyGradient = document.getElementById("applyGradient");
const gradColor1 = document.getElementById("gradColor1");
const gradColor2 = document.getElementById("gradColor2");

const panels = { transparent: panelTransparent, colors: panelColors, gradients: panelGradients, custom: panelCustom };

document.querySelectorAll(".bg-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".bg-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const type = tab.dataset.tab;
        Object.values(panels).forEach((p) => (p.style.display = "none"));
        panels[type].style.display = "block";
        if (type === "transparent") { currentBg = "transparent"; document.querySelectorAll(".bg-color").forEach((c) => c.classList.remove("active")); }
        drawComparison();
    });
});

document.querySelectorAll(".bg-color").forEach((colorEl) => {
    colorEl.addEventListener("click", () => {
        document.querySelectorAll(".bg-color").forEach((c) => c.classList.remove("active"));
        colorEl.classList.add("active");
        currentBg = colorEl.dataset.color;
        drawComparison();
    });
});

customColorPicker.addEventListener("input", (e) => { currentBg = e.target.value; document.querySelectorAll(".bg-color").forEach((c) => c.classList.remove("active")); drawComparison(); });

document.querySelectorAll(".bg-gradient").forEach((grad) => {
    grad.addEventListener("click", () => {
        document.querySelectorAll(".bg-gradient").forEach((g) => g.classList.remove("active"));
        grad.classList.add("active");
        currentBg = grad.dataset.gradient;
        drawComparison();
    });
});

applyGradient.addEventListener("click", () => {
    currentBg = `linear-gradient(135deg, ${gradColor1.value}, ${gradColor2.value})`;
    document.querySelectorAll(".bg-gradient").forEach((g) => g.classList.remove("active"));
    drawComparison();
});

customBgUpload.addEventListener("click", () => customBgInput.click());
customBgInput.addEventListener("change", (e) => { const file = e.target.files[0]; if (!file) return; loadCustomBg(file); });

function loadCustomBg(file) {
    const img = new Image();
    img.onload = () => {
        customBgImage = img;
        currentBg = "custom";
        customBgThumb.src = img.src;
        customBgUpload.style.display = "none";
        customBgPreview.style.display = "block";
        drawComparison();
    };
    img.src = URL.createObjectURL(file);
}

removeCustomBg.addEventListener("click", () => {
    customBgImage = null;
    currentBg = "transparent";
    customBgInput.value = "";
    customBgUpload.style.display = "flex";
    customBgPreview.style.display = "none";
    document.querySelectorAll(".bg-tab").forEach((t) => t.classList.remove("active"));
    document.querySelector('[data-tab="transparent"]').classList.add("active");
    Object.values(panels).forEach((p) => (p.style.display = "none"));
    panels.transparent.style.display = "block";
    drawComparison();
});

// --- Download JPG ---
downloadJpg.addEventListener("click", (e) => {
    if (!processedImageData || currentBg === "transparent") return;
    e.preventDefault();
    const canvas = document.createElement("canvas");
    canvas.width = processedImageData.naturalWidth;
    canvas.height = processedImageData.naturalHeight;
    const ctx = canvas.getContext("2d");

    if (customBgImage && currentBg === "custom") {
        ctx.drawImage(customBgImage, 0, 0, canvas.width, canvas.height);
    } else if (currentBg.startsWith("linear-gradient")) {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const colors = currentBg.match(/#[a-fA-F0-9]{6}/g);
        if (colors) { grad.addColorStop(0, colors[0]); grad.addColorStop(1, colors[1] || colors[0]); }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = currentBg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(processedImageData, 0, 0);
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "bgremoved.jpg";
        a.click();
        URL.revokeObjectURL(url);
    }, "image/jpeg", 0.95);
});

// --- Bulk Results ---
function renderBulkResults(bulkResult) {
    progressSection.style.display = "none";
    resultsSection.style.display = "block";
    resultsGrid.innerHTML = "";
    const successCount = currentResults.length;
    const failCount = bulkResult.failed || 0;
    stats.innerHTML = `
        <div class="stat-item"><div class="stat-dot green"></div> ${successCount} processed</div>
        ${failCount > 0 ? `<div class="stat-item"><div class="stat-dot red"></div> ${failCount} failed</div>` : ""}
        <div class="stat-item">Total: ${formatBytes(currentResults.reduce((a, r) => a + r.size, 0))}</div>
    `;
    currentResults.forEach((r) => {
        const card = document.createElement("div");
        card.className = "result-card";
        card.innerHTML = `
            <div class="result-thumb"><img src="${API_URL}${r.download_url}" alt="${r.original}" loading="lazy"></div>
            <div class="result-meta">
                <span class="result-name" title="${r.original}">${r.original}</span>
                <span class="result-size">${formatBytes(r.size)}</span>
            </div>
        `;
        card.addEventListener("click", () => window.open(`${API_URL}${r.download_url}`, "_blank"));
        resultsGrid.appendChild(card);
    });
    downloadAllBtn.style.display = successCount > 1 ? "inline-flex" : "none";
}

downloadAllBtn.addEventListener("click", () => { if (currentZipUrl) window.location.href = `${API_URL}${currentZipUrl}`; });

// --- Helpers ---
function showProgress(pct, text, detail) {
    progressSection.style.display = "block";
    editorSection.classList.remove("visible");
    resultsSection.style.display = "none";
    progressPercent.textContent = pct + "%";
    progressFill.style.width = pct + "%";
    progressText.textContent = text;
    progressDetail.textContent = detail;
}
function hideProgress() { progressSection.style.display = "none"; }
function showError(msg) { errorToast.textContent = msg; errorToast.style.display = "block"; setTimeout(() => { errorToast.style.display = "none"; }, 4000); }
function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
