import io
import threading
import numpy as np
from PIL import Image
from rembg import remove, new_session

MODEL_NAME = "u2net"
_session = None
_model_ready = False


def get_session():
    global _session, _model_ready
    if _session is None:
        _session = new_session(MODEL_NAME)
        _model_ready = True
    return _session


def preload_model():
    def _load():
        global _session, _model_ready
        _session = new_session(MODEL_NAME)
        _model_ready = True
    threading.Thread(target=_load, daemon=True).start()


def is_model_ready():
    return _model_ready


def clean_alpha(img: Image.Image) -> Image.Image:
    arr = np.array(img)
    alpha = arr[:, :, 3]
    alpha[alpha < 60] = 0
    alpha[alpha > 180] = 255
    from scipy.ndimage import binary_erosion, binary_dilation
    mask = alpha > 128
    cleaned = binary_erosion(mask, iterations=2)
    cleaned = binary_dilation(cleaned, iterations=1)
    alpha[~cleaned] = 0
    arr[:, :, 3] = alpha
    return Image.fromarray(arr, "RGBA")


def remove_background(input_bytes: bytes) -> bytes:
    session = get_session()
    result = remove(
        input_bytes,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=200,
        alpha_matting_background_threshold=40,
        alpha_matting_erode_size=15,
    )
    img = Image.open(io.BytesIO(result)).convert("RGBA")
    img = clean_alpha(img)
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    return buf.getvalue()


preload_model()
