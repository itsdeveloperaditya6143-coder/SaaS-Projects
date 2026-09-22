import io
import gc
import threading
import numpy as np
from PIL import Image
from rembg import remove, new_session

MODEL_NAME = "silueta"
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


def remove_background(input_bytes: bytes) -> bytes:
    session = get_session()
    result = remove(input_bytes, session=session)

    img = Image.open(io.BytesIO(result)).convert("RGBA")
    arr = np.array(img)

    alpha = arr[:, :, 3]
    alpha[alpha < 30] = 0
    alpha[alpha > 200] = 255
    arr[:, :, 3] = alpha

    img = Image.fromarray(arr, "RGBA")
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    del arr, alpha, img
    gc.collect()
    return buf.getvalue()


preload_model()
